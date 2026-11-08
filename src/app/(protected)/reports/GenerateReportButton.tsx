'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function GenerateReportButton({ yearMonth }: { yearMonth: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yearMonth }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'レポート生成に失敗しました');
        return;
      }

      router.refresh();
    } catch {
      setError('レポート生成に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  const label = yearMonth.replace('-', '年') + '月';

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? '生成中...' : `${label}のレポートを生成`}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
