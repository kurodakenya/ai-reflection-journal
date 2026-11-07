import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from './DeleteButton';
import { EmotionRadarChart } from '@/components/emotion/EmotionRadarChart';
import { AnalyzeButton } from '@/components/emotion/AnalyzeButton';

const TEMPLATE_LABELS: Record<string, string> = {
  free: '自由記述',
  reflection: '振り返り',
  gratitude: '感謝',
  learning: '学び',
};

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (!entry) {
    notFound();
  }

  const { data: emotionAnalysis } = await supabase
    .from('emotion_analyses')
    .select('*')
    .eq('entry_id', id)
    .maybeSingle();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          &larr; ダッシュボードに戻る
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/entries/${id}/edit`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            編集
          </Link>
          <DeleteButton id={id} />
        </div>
      </div>

      <article className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time>{entry.entry_date}</time>
          <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {TEMPLATE_LABELS[entry.template_type] ?? entry.template_type}
          </span>
        </div>

        <div className="prose prose-gray max-w-none dark:prose-invert">
          {entry.content.split('\n').map((line: string, i: number) => (
            <p key={i} className={line.trim() === '' ? 'h-4' : ''}>
              {line || ' '}
            </p>
          ))}
        </div>

        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5 border-t border-gray-200 pt-4 dark:border-gray-700">
            {entry.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-gray-200 pt-4 text-xs text-gray-400 dark:border-gray-700">
          作成: {new Date(entry.created_at).toLocaleString('ja-JP')}
          {entry.updated_at !== entry.created_at && (
            <> ・ 更新: {new Date(entry.updated_at).toLocaleString('ja-JP')}</>
          )}
        </div>
      </article>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          AI感情分析
        </h2>
        {emotionAnalysis ? (
          <div>
            <EmotionRadarChart
              scores={{
                joy: emotionAnalysis.joy,
                sadness: emotionAnalysis.sadness,
                anger: emotionAnalysis.anger,
                fear: emotionAnalysis.fear,
                surprise: emotionAnalysis.surprise,
                trust: emotionAnalysis.trust,
                anticipation: emotionAnalysis.anticipation,
                disgust: emotionAnalysis.disgust,
              }}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  主要感情:
                </span>
                <span className="rounded-full bg-purple-100 px-3 py-0.5 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {emotionAnalysis.overall_sentiment}
                </span>
              </div>
              {emotionAnalysis.ai_feedback && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {emotionAnalysis.ai_feedback}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              この日記の感情をAIが分析します
            </p>
            <AnalyzeButton entryId={id} />
          </div>
        )}
      </div>
    </>
  );
}
