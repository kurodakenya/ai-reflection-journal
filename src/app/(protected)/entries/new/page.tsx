'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createEntry } from '../actions';

const TEMPLATES = [
  { id: 'free', label: '自由記述', placeholder: '今日あったこと、感じたことを自由に書いてみましょう...' },
  { id: 'reflection', label: '振り返り', placeholder: '【良かったこと】\n\n【改善したいこと】\n\n【明日の目標】' },
  { id: 'gratitude', label: '感謝', placeholder: '【今日感謝したいこと 3つ】\n1. \n2. \n3. \n\n【その理由】' },
  { id: 'learning', label: '学び', placeholder: '【今日学んだこと】\n\n【気づき】\n\n【次に活かすこと】' },
] as const;

export default function NewEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [template, setTemplate] = useState('free');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [entryDate, setEntryDate] = useState(searchParams.get('date') ?? new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentTemplate = TEMPLATES.find(t => t.id === template) ?? TEMPLATES[0];

  function handleTemplateChange(id: string) {
    setTemplate(id);
    if (!content) {
      const tmpl = TEMPLATES.find(t => t.id === id);
      if (tmpl && tmpl.id !== 'free') {
        setContent(tmpl.placeholder);
      }
    }
  }

  function addTag() {
    const value = tagInput.trim();
    if (value && !tags.includes(value) && tags.length < 10) {
      setTags([...tags, value]);
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set('content', content);
    formData.set('tags', tags.join(','));
    formData.set('templateType', template);
    formData.set('entryDate', entryDate);

    const result = await createEntry(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          日記を書く
        </h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          戻る
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTemplateChange(t.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                template === t.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
          <label
            htmlFor="entryDate"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            日付
          </label>
          <input
            id="entryDate"
            type="date"
            value={entryDate}
            onChange={e => setEntryDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:w-auto"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={currentTemplate.placeholder}
            rows={12}
            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            {content.length} 文字
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            タグ
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="タグを入力してEnter"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              追加
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-8"
          >
            {loading ? '保存中...' : '保存する'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            キャンセル
          </button>
        </div>
      </form>
    </>
  );
}
