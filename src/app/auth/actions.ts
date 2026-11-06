'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'メールアドレスとパスワードを入力してください' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'メールアドレスまたはパスワードが正しくありません' };
  }

  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const displayName = (formData.get('displayName') as string) || '';

  if (!email || !password) {
    return { error: 'メールアドレスとパスワードを入力してください' };
  }

  if (password.length < 6) {
    return { error: 'パスワードは6文字以上で入力してください' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: displayName },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: '確認メールを送信しました。メールのリンクをクリックして登録を完了してください。' };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth');
}
