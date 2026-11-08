import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserPlan } from '@/lib/subscription';

export async function GET(request: NextRequest) {
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
      { error: 'データエクスポートはProプラン専用です' },
      { status: 403 },
    );
  }

  const format = request.nextUrl.searchParams.get('format') ?? 'json';
  if (format !== 'json' && format !== 'csv') {
    return NextResponse.json(
      { error: 'formatはjsonまたはcsvを指定してください' },
      { status: 400 },
    );
  }

  const { data: entries } = await supabase
    .from('journal_entries')
    .select('id, content, tags, template_type, entry_date, created_at, updated_at')
    .eq('user_id', user.id)
    .order('entry_date', { ascending: true });

  const entryIds = entries?.map((e) => e.id) ?? [];

  const { data: analyses } = await supabase
    .from('emotion_analyses')
    .select(
      'entry_id, joy, sadness, anger, fear, surprise, trust, anticipation, disgust, overall_sentiment, ai_feedback',
    )
    .in('entry_id', entryIds.length > 0 ? entryIds : ['__none__']);

  const analysisMap = new Map(analyses?.map((a) => [a.entry_id, a]) ?? []);

  const exportData = (entries ?? []).map((entry) => {
    const analysis = analysisMap.get(entry.id);
    return {
      entry_date: entry.entry_date,
      template_type: entry.template_type,
      content: entry.content,
      tags: entry.tags,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
      emotion_analysis: analysis
        ? {
            joy: analysis.joy,
            sadness: analysis.sadness,
            anger: analysis.anger,
            fear: analysis.fear,
            surprise: analysis.surprise,
            trust: analysis.trust,
            anticipation: analysis.anticipation,
            disgust: analysis.disgust,
            overall_sentiment: analysis.overall_sentiment,
            ai_feedback: analysis.ai_feedback,
          }
        : null,
    };
  });

  if (format === 'csv') {
    const headers = [
      'entry_date',
      'template_type',
      'content',
      'tags',
      'created_at',
      'updated_at',
      'joy',
      'sadness',
      'anger',
      'fear',
      'surprise',
      'trust',
      'anticipation',
      'disgust',
      'overall_sentiment',
      'ai_feedback',
    ];

    const escapeCSV = (val: string) => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const rows = exportData.map((d) =>
      [
        d.entry_date,
        d.template_type,
        escapeCSV(d.content),
        escapeCSV((d.tags ?? []).join('; ')),
        d.created_at,
        d.updated_at,
        d.emotion_analysis?.joy ?? '',
        d.emotion_analysis?.sadness ?? '',
        d.emotion_analysis?.anger ?? '',
        d.emotion_analysis?.fear ?? '',
        d.emotion_analysis?.surprise ?? '',
        d.emotion_analysis?.trust ?? '',
        d.emotion_analysis?.anticipation ?? '',
        d.emotion_analysis?.disgust ?? '',
        d.emotion_analysis?.overall_sentiment ?? '',
        escapeCSV(d.emotion_analysis?.ai_feedback ?? ''),
      ].join(','),
    );

    const csv = '﻿' + headers.join(',') + '\n' + rows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="journal_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  }

  return NextResponse.json(exportData, {
    headers: {
      'Content-Disposition': `attachment; filename="journal_export_${new Date().toISOString().split('T')[0]}.json"`,
    },
  });
}
