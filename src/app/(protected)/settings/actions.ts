'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateProfile(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: '認証が必要です' };
  }

  const displayName = formData.get('displayName') as string;
  const timezone = formData.get('timezone') as string;

  if (!displayName || displayName.trim().length === 0) {
    return { error: '表示名を入力してください' };
  }

  if (displayName.trim().length > 50) {
    return { error: '表示名は50文字以内にしてください' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName.trim(),
      timezone: timezone || 'Asia/Tokyo',
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
