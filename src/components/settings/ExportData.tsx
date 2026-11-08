'use client';

import { useState } from 'react';

export function ExportData({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleExport(format: 'json' | 'csv') {
    setLoading(true);
    try {
      const res = await fetch(`/api/export?format=${format}`);
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? 'エクスポートに失敗しました');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        format === 'csv'
          ? `journal_export_${new Date().toISOString().split('T')[0]}.csv`
          : `journal_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('エクスポートに失敗しました');
    } finally {
      setLoading(false);
    }
  }

  if (!isPro) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        データエクスポートはProプラン専用機能です
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        すべての日記データと感情分析結果をダウンロードできます
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => handleExport('json')}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          JSON形式
        </button>
        <button
          onClick={() => handleExport('csv')}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          CSV形式
        </button>
      </div>
    </div>
  );
}
