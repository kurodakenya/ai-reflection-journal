import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeEmotion } from '@/lib/claude';
import { decryptIfEnabled, encryptIfEnabled } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const body = await request.json();
  const { entryId } = body;

  if (!entryId) {
    return NextResponse.json(
      { error: 'entryId が必要です' },
      { status: 400 },
    );
  }

  const { data: entry } = await supabase
    .from('journal_entries')
    .select('id, content, user_id')
    .eq('id', entryId)
    .single();

  if (!entry || entry.user_id !== user.id) {
    return NextResponse.json(
      { error: 'エントリが見つかりません' },
      { status: 404 },
    );
  }

  const { data: existing } = await supabase
    .from('emotion_analyses')
    .select('id')
    .eq('entry_id', entryId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: 'すでに分析済みです' },
      { status: 409 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'APIキーが設定されていません' },
      { status: 500 },
    );
  }

  try {
    const result = await analyzeEmotion(decryptIfEnabled(entry.content) ?? '');

    const { data: analysis, error } = await supabase
      .from('emotion_analyses')
      .insert({
        entry_id: entryId,
        user_id: user.id,
        joy: result.scores.joy,
        sadness: result.scores.sadness,
        anger: result.scores.anger,
        fear: result.scores.fear,
        surprise: result.scores.surprise,
        trust: result.scores.trust,
        anticipation: result.scores.anticipation,
        disgust: result.scores.disgust,
        overall_sentiment: result.dominant_emotion,
        ai_feedback: encryptIfEnabled(result.summary),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ analysis });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '感情分析に失敗しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
