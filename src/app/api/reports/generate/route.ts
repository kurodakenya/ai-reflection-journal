import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateMonthlyReport } from '@/lib/claude';
import { getUserPlan } from '@/lib/subscription';
import { decryptIfEnabled, encryptIfEnabled } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const plan = await getUserPlan();
  if (plan !== 'pro') {
    return NextResponse.json(
      { error: '月間レポートはProプラン専用です' },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { yearMonth } = body;

  if (!yearMonth || !/^\d{4}-\d{2}$/.test(yearMonth)) {
    return NextResponse.json(
      { error: 'yearMonth（YYYY-MM形式）が必要です' },
      { status: 400 },
    );
  }

  const { data: existing } = await supabase
    .from('monthly_reports')
    .select('id')
    .eq('user_id', user.id)
    .eq('year_month', yearMonth)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: 'このレポートは既に生成済みです' },
      { status: 409 },
    );
  }

  const [year, month] = yearMonth.split('-');
  const monthStart = `${yearMonth}-01`;
  const nextMonth =
    Number(month) === 12
      ? `${Number(year) + 1}-01-01`
      : `${year}-${String(Number(month) + 1).padStart(2, '0')}-01`;

  const { data: entries } = await supabase
    .from('journal_entries')
    .select('id, content, entry_date, template_type')
    .eq('user_id', user.id)
    .gte('entry_date', monthStart)
    .lt('entry_date', nextMonth)
    .order('entry_date', { ascending: true });

  if (!entries || entries.length === 0) {
    return NextResponse.json(
      { error: 'この月の日記がありません' },
      { status: 400 },
    );
  }

  const { data: analyses } = await supabase
    .from('emotion_analyses')
    .select('entry_id, overall_sentiment')
    .in(
      'entry_id',
      entries.map((e) => e.id),
    );

  const emotionMap = new Map(
    analyses?.map((a) => [a.entry_id, a.overall_sentiment]) ?? [],
  );

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'APIキーが設定されていません' },
      { status: 500 },
    );
  }

  try {
    const result = await generateMonthlyReport(
      entries.map((e) => ({
        date: e.entry_date,
        content: decryptIfEnabled(e.content) ?? '',
        emotion: emotionMap.get(e.id),
      })),
      yearMonth,
    );

    const { data: report, error } = await supabase
      .from('monthly_reports')
      .insert({
        user_id: user.id,
        year_month: yearMonth,
        ai_narrative: encryptIfEnabled(result.narrative),
        emotion_summary: {
          highlights: result.highlights,
          ...result.emotion_summary,
        },
        total_entries: entries.length,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ report });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'レポート生成に失敗しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
