'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (confirmText !== '削除する') return;

    setLoading(true);
    try {
      const res = await fetch('/api/account', { method: 'DELETE' });

      if (res.ok) {
        router.push('/auth');
      } else {
        const data = await res.json();
        alert(data.error ?? 'アカウント削除に失敗しました');
      }
    } catch {
      alert('アカウント削除に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  if (!showConfirm) {
    return (
      <div>
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          アカウントを削除すると、すべての日記・分析結果・レポートが完全に削除されます。この操作は取り消せません。
        </p>
        <button
          onClick={() => setShowConfirm(true)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          アカウントを削除
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <p className="text-sm font-medium text-red-800 dark:text-red-300">
        本当にアカウントを削除しますか？
      </p>
      <p className="text-xs text-red-600 dark:text-red-400">
        確認のため「削除する」と入力してください
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="削除する"
        className="w-full rounded-lg border border-red-300 px-4 py-2.5 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:bg-gray-800 dark:text-white sm:w-auto"
      />
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={loading || confirmText !== '削除する'}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? '削除中...' : '完全に削除する'}
        </button>
        <button
          onClick={() => {
            setShowConfirm(false);
            setConfirmText('');
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
