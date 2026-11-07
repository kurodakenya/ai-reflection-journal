'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AnalyzeButton({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? '分析に失敗しました');
        return;
      }

      router.refresh();
    } catch {
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? '分析中...' : 'AI感情分析を実行'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
