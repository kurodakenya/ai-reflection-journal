import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEMO_MODE, getDemoStreak } from '@/lib/demo';

export async function StreakCard() {
  await connection();
  let currentStreak: number;
  let longestStreak: number;
  let lastEntryDate: string | undefined;

  if (DEMO_MODE) {
    const streak = getDemoStreak();
    currentStreak = streak.current_streak;
    longestStreak = streak.longest_streak;
    lastEntryDate = streak.last_entry_date;
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: streak } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak, last_entry_date')
      .eq('user_id', user.id)
      .single();

    currentStreak = streak?.current_streak ?? 0;
    longestStreak = streak?.longest_streak ?? 0;
    lastEntryDate = streak?.last_entry_date;
  }

  const today = new Date().toISOString().split('T')[0];
  const wroteToday = lastEntryDate === today;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
        連続記録
      </h3>

      <div className="flex items-end gap-6">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {currentStreak}
          </span>
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            日連続
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {longestStreak}
          </span>
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            最長記録
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        {wroteToday ? (
          <>
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-green-600 dark:text-green-400">今日は記録済み</span>
          </>
        ) : (
          <>
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-gray-500 dark:text-gray-400">今日はまだ書いていません</span>
          </>
        )}
      </div>
    </div>
  );
}
