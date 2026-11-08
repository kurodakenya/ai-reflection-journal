'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { encryptIfEnabled } from '@/lib/encryption';

async function updateStreak(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, entryDate: string) {
  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!streak) return;

  const today = new Date(entryDate);
  const lastDate = streak.last_entry_date ? new Date(streak.last_entry_date) : null;

  let newStreak = streak.current_streak;

  if (!lastDate) {
    newStreak = 1;
  } else {
    const diffMs = today.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak = streak.current_streak + 1;
    } else if (diffDays === 0) {
      return;
    } else {
      newStreak = 1;
    }
  }

  const newLongest = Math.max(newStreak, streak.longest_streak);

  await supabase
    .from('streaks')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_entry_date: entryDate,
    })
    .eq('user_id', userId);
}

export async function createEntry(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: '認証が必要です' };
  }

  const content = formData.get('content') as string;
  const tagsRaw = formData.get('tags') as string;
  const templateType = (formData.get('templateType') as string) || 'free';
  const entryDate = formData.get('entryDate') as string;

  if (!content || content.trim().length === 0) {
    return { error: '日記の内容を入力してください' };
  }

  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const resolvedDate = entryDate || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase.from('journal_entries').insert({
    user_id: user.id,
    content: encryptIfEnabled(content.trim()) ?? '',
    tags,
    template_type: templateType,
    entry_date: resolvedDate,
  }).select('id').single();

  if (error) {
    return { error: error.message };
  }

  await updateStreak(supabase, user.id, resolvedDate);

  redirect(`/entries/${data.id}`);
}

export async function updateEntry(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: '認証が必要です' };
  }

  const content = formData.get('content') as string;
  const tagsRaw = formData.get('tags') as string;
  const templateType = (formData.get('templateType') as string) || 'free';
  const entryDate = formData.get('entryDate') as string;

  if (!content || content.trim().length === 0) {
    return { error: '日記の内容を入力してください' };
  }

  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const { error } = await supabase
    .from('journal_entries')
    .update({
      content: encryptIfEnabled(content.trim()) ?? '',
      tags,
      template_type: templateType,
      entry_date: entryDate || new Date().toISOString().split('T')[0],
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  redirect(`/entries/${id}`);
}

export async function deleteEntry(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: '認証が必要です' };
  }

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}
