'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type EntryInfo = {
  id: string;
  entry_date: string;
  template_type: string;
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const TEMPLATE_COLORS: Record<string, string> = {
  free: 'bg-blue-500',
  reflection: 'bg-purple-500',
  gratitude: 'bg-green-500',
  learning: 'bg-amber-500',
};

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [entries, setEntries] = useState<EntryInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate =
      month === 11
        ? `${year + 1}-01-01`
        : `${year}-${String(month + 2).padStart(2, '0')}-01`;

    const { data } = await supabase
      .from('journal_entries')
      .select('id, entry_date, template_type')
      .gte('entry_date', startDate)
      .lt('entry_date', endDate)
      .order('entry_date');

    setEntries(data ?? []);
    setLoading(false);
  }, [year, month]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function goToday() {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
  }

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const entriesByDate = new Map<string, EntryInfo[]>();
  for (const entry of entries) {
    const list = entriesByDate.get(entry.entry_date) ?? [];
    list.push(entry);
    entriesByDate.set(entry.entry_date, list);
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function handleDayClick(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEntries = entriesByDate.get(dateStr);
    if (dayEntries && dayEntries.length > 0) {
      router.push(`/entries/${dayEntries[0].id}`);
    } else {
      router.push(`/entries/new?date=${dateStr}`);
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          カレンダー
        </h1>
        <button
          onClick={goToday}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          今日
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <button
            onClick={prevMonth}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            &larr;
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {year}年{month + 1}月
          </h2>
          <button
            onClick={nextMonth}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            &rarr;
          </button>
        </div>

        <div className="p-4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }} className="mb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {WEEKDAYS.map((day, i) => (
              <div
                key={day}
                className={
                  i === 0
                    ? 'text-red-400'
                    : i === 6
                      ? 'text-blue-400'
                      : ''
                }
              >
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }} className="rounded-lg bg-gray-200 dark:bg-gray-700">
            {cells.map((day, i) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${i}`}
                    className="bg-gray-50 p-2 dark:bg-gray-900/50"
                    style={{ minHeight: '72px' }}
                  />
                );
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEntries = entriesByDate.get(dateStr) ?? [];
              const isToday = dateStr === todayStr;
              const dayOfWeek = (firstDayOfWeek + day - 1) % 7;

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`relative bg-white p-2 text-left transition-colors hover:bg-blue-50 dark:bg-gray-900 dark:hover:bg-gray-800 ${
                    i < 7 && i === 0 ? 'rounded-tl-lg' : ''
                  } ${i < 7 && i === 6 ? 'rounded-tr-lg' : ''} ${
                    i >= cells.length - 7 && i % 7 === 0 ? 'rounded-bl-lg' : ''
                  } ${i >= cells.length - 7 && i % 7 === 6 ? 'rounded-br-lg' : ''}`}
                  style={{ minHeight: '72px' }}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                      isToday
                        ? 'bg-blue-600 font-bold text-white'
                        : dayOfWeek === 0
                          ? 'text-red-500 dark:text-red-400'
                          : dayOfWeek === 6
                            ? 'text-blue-500 dark:text-blue-400'
                            : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {day}
                  </span>
                  {dayEntries.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {dayEntries.slice(0, 3).map((entry) => (
                        <span
                          key={entry.id}
                          className={`inline-block h-2 w-2 rounded-full ${
                            TEMPLATE_COLORS[entry.template_type] ?? 'bg-gray-400'
                          }`}
                        />
                      ))}
                      {dayEntries.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{dayEntries.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="px-6 pb-4 text-center text-sm text-gray-400">
            読み込み中...
          </div>
        )}

        <div className="border-t border-gray-200 px-6 py-3 dark:border-gray-800">
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              自由記述
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-purple-500" />
              振り返り
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              感謝
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              学び
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {entries.length > 0
          ? `${month + 1}月の日記: ${entries.length}件`
          : `${month + 1}月の日記はまだありません`}
      </div>
    </>
  );
}
