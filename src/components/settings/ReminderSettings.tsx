'use client';

import { useState, useEffect } from 'react';

export function ReminderSettings() {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('21:00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/reminders')
      .then((res) => res.json())
      .then((data) => {
        setEnabled(data.enabled ?? false);
        setTime(data.time?.slice(0, 5) ?? '21:00');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/reminders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, time: `${time}:00` }),
      });

      if (res.ok) {
        setMessage('保存しました');
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await res.json();
        setMessage(data.error ?? '保存に失敗しました');
      }
    } catch {
      setMessage('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            毎日のリマインダー
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            設定した時間に日記の記入を通知します
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div>
          <label
            htmlFor="reminderTime"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            通知時間
          </label>
          <input
            id="reminderTime"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:w-auto"
          />
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? '保存中...' : '保存する'}
      </button>

      {message && (
        <p
          className={`text-sm ${message.includes('失敗') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
