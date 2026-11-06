import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signout } from '@/app/auth/actions';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            AI振り返りジャーナル
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
            <form action={signout}>
              <button
                type="submit"
                className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">ダッシュボード</h2>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            ようこそ！ダッシュボードは今後のフェーズで実装します。
          </p>
        </div>
      </main>
    </div>
  );
}
