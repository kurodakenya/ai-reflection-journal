'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  entryDates: string[];
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function MiniCalendar({ entryDates }: Props) {
  const router = useRouter();
  const [now] = useState(() => new Date());
  const year = now.getFullYear();
  const month = now.getMonth();

  const entrySet = new Set(entryDates);

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }} className="mb-1 text-center text-xs text-gray-400 dark:text-gray-500">
        {WEEKDAYS.map((d, i) => (
          <span key={d} className={i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : ''}>
            {d}
          </span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }} className="gap-0.5 text-center">
        {cells.map((day, i) => {
          if (day === null) {
            return <span key={`e-${i}`} className="p-1" />;
          }
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasEntry = entrySet.has(dateStr);
          const isToday = dateStr === todayStr;
          const dayOfWeek = new Date(year, month, day).getDay();

          return (
            <button
              key={day}
              onClick={() => router.push(hasEntry ? '/calendar' : `/entries/new?date=${dateStr}`)}
              className={`relative rounded-md p-1 text-xs transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isToday
                  ? 'font-bold text-blue-600 dark:text-blue-400'
                  : dayOfWeek === 0
                    ? 'text-red-400'
                    : dayOfWeek === 6
                      ? 'text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {day}
              {hasEntry && (
                <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
