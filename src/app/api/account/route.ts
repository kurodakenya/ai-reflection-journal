import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  // CASCADE削除: profiles → journal_entries, emotion_analyses, streaks, subscriptions, monthly_reports
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id);

  if (profileError) {
    return NextResponse.json(
      { error: 'データ削除に失敗しました: ' + profileError.message },
      { status: 500 },
    );
  }

  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}
