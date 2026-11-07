'use client';

import { useState } from 'react';
import { updateProfile } from './actions';

const TIMEZONES = [
  { value: 'Asia/Tokyo', label: '日本標準時 (JST, UTC+9)' },
  { value: 'Asia/Seoul', label: '韓国標準時 (KST, UTC+9)' },
  { value: 'Asia/Shanghai', label: '中国標準時 (CST, UTC+8)' },
  { value: 'Asia/Singapore', label: 'シンガポール標準時 (SGT, UTC+8)' },
  { value: 'America/New_York', label: '米国東部時間 (EST, UTC-5)' },
  { value: 'America/Los_Angeles', label: '米国太平洋時間 (PST, UTC-8)' },
  { value: 'Europe/London', label: 'グリニッジ標準時 (GMT, UTC+0)' },
  { value: 'Europe/Paris', label: '中央ヨーロッパ時間 (CET, UTC+1)' },
];

type Props = {
  email: string;
  displayName: string;
  timezone: string;
};

export function SettingsForm({ email, displayName, timezone }: Props) {
  const [name, setName] = useState(displayName);
  const [tz, setTz] = useState(timezone);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData();
    formData.set('displayName', name);
    formData.set('timezone', tz);

    const result = await updateProfile(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/30 dark:text-green-400">
          プロフィールを更新しました
        </div>
      )}

      <div>
        <label
          htmlFor="displayName"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          表示名
        </label>
        <input
          id="displayName"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={50}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-400">{name.length}/50</p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
        />
        <p className="mt-1 text-xs text-gray-400">メールアドレスは変更できません</p>
      </div>

      <div>
        <label
          htmlFor="timezone"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          タイムゾーン
        </label>
        <select
          id="timezone"
          value={tz}
          onChange={e => setTz(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          {TIMEZONES.map(t => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? '更新中...' : '保存する'}
      </button>
    </form>
  );
}
