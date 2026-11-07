'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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

  const { data, error } = await supabase.from('journal_entries').insert({
    user_id: user.id,
    content: content.trim(),
    tags,
    template_type: templateType,
    entry_date: entryDate || new Date().toISOString().split('T')[0],
  }).select('id').single();

  if (error) {
    return { error: error.message };
  }

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
      content: content.trim(),
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
