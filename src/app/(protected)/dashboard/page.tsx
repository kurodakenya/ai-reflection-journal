import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StreakCard } from '@/components/streak/StreakCard';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split('T')[0];

  const { data: todayEntry } = await supabase
    .from('journal_entries')
    .select('id, content, template_type')
    .eq('entry_date', today)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { count: monthlyCount } = await supabase
    .from('journal_entries')
    .select('*', { count: 'exact', head: true })
    .gte('entry_date', `${today.slice(0, 7)}-01`)
    .lt('entry_date', today.slice(0, 7) === '12'
      ? `${Number(today.slice(0, 4)) + 1}-01-01`
      : `${today.slice(0, 4)}-${String(Number(today.slice(5, 7)) + 1).padStart(2, '0')}-01`
    );

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        ダッシュボード
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            今日の日記
          </h3>
          {todayEntry ? (
            <div>
              <p className="line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
                {todayEntry.content}
              </p>
              <Link
                href={`/entries/${todayEntry.id}`}
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                詳細を見る &rarr;
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                今日の振り返りを書きましょう
              </p>
              <Link
                href="/entries/new"
                className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                日記を書く
              </Link>
            </div>
          )}
        </div>

        <StreakCard />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              今月の記録
            </h3>
            <Link
              href="/calendar"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              カレンダーを見る &rarr;
            </Link>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {monthlyCount ?? 0}
            <span className="ml-1 text-base font-normal text-gray-500 dark:text-gray-400">
              件
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
