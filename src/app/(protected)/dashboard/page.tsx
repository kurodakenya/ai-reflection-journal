import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StreakCard } from '@/components/streak/StreakCard';
import { MiniCalendar } from '@/components/dashboard/MiniCalendar';

const TEMPLATE_LABELS: Record<string, string> = {
  free: '自由記述',
  reflection: '振り返り',
  gratitude: '感謝',
  learning: '学び',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split('T')[0];
  const monthStart = `${today.slice(0, 7)}-01`;
  const monthNum = Number(today.slice(5, 7));
  const yearNum = Number(today.slice(0, 4));
  const nextMonth = monthNum === 12
    ? `${yearNum + 1}-01-01`
    : `${yearNum}-${String(monthNum + 1).padStart(2, '0')}-01`;

  const { data: todayEntry } = await supabase
    .from('journal_entries')
    .select('id, content, template_type')
    .eq('entry_date', today)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: monthEntries } = await supabase
    .from('journal_entries')
    .select('entry_date')
    .gte('entry_date', monthStart)
    .lt('entry_date', nextMonth);

  const monthlyCount = monthEntries?.length ?? 0;
  const entryDates = monthEntries?.map(e => e.entry_date) ?? [];

  const { data: recentEntries } = await supabase
    .from('journal_entries')
    .select('id, content, entry_date, template_type')
    .order('entry_date', { ascending: false })
    .limit(5);

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

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {monthNum}月のカレンダー
            </h3>
            <Link
              href="/calendar"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              詳細 &rarr;
            </Link>
          </div>
          <MiniCalendar entryDates={entryDates} />
          <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
            {monthlyCount}件の日記
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            感情の推移
          </h3>
          <div className="flex h-24 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Phase 3 で実装予定
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              最近の日記
            </h3>
          </div>
          {recentEntries && recentEntries.length > 0 ? (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentEntries.map(entry => (
                <li key={entry.id}>
                  <Link
                    href={`/entries/${entry.id}`}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 rounded-lg"
                  >
                    <time className="shrink-0 text-xs text-gray-400 dark:text-gray-500 w-20">
                      {entry.entry_date}
                    </time>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {TEMPLATE_LABELS[entry.template_type] ?? entry.template_type}
                    </span>
                    <p className="min-w-0 flex-1 truncate text-sm text-gray-700 dark:text-gray-300">
                      {entry.content}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-sm text-gray-400 dark:text-gray-500">
              まだ日記がありません
            </p>
          )}
        </div>
      </div>
    </>
  );
}
