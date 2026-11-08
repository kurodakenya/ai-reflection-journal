import { createClient } from '@/lib/supabase/server';
import { getUserPlan } from '@/lib/subscription';
import Link from 'next/link';
import { GenerateReportButton } from './GenerateReportButton';

type EmotionSummary = {
  dominant_emotion: string;
  emotion_trend: string;
  highlights: string[];
  avg_scores: Record<string, number>;
};

type Report = {
  id: string;
  year_month: string;
  ai_narrative: string;
  emotion_summary: EmotionSummary;
  total_entries: number;
  created_at: string;
};

const EMOTION_LABELS: Record<string, string> = {
  joy: '喜び',
  sadness: '悲しみ',
  anger: '怒り',
  fear: '恐れ',
  surprise: '驚き',
  trust: '信頼',
  anticipation: '期待',
  disgust: '嫌悪',
};

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const plan = await getUserPlan();

  const { data: reports } = await supabase
    .from('monthly_reports')
    .select('*')
    .eq('user_id', user!.id)
    .order('year_month', { ascending: false });

  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevYearMonth = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;

  const hasCurrentReport = reports?.some(
    (r: Report) => r.year_month === prevYearMonth,
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          月間レポート
        </h1>
        {plan === 'pro' && !hasCurrentReport && (
          <GenerateReportButton yearMonth={prevYearMonth} />
        )}
      </div>

      {plan !== 'pro' ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Proプラン専用機能
          </p>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            月間レポートではAIがあなたの1ヶ月の振り返りを分析し、感情の推移やハイライトをまとめます。
          </p>
          <Link
            href="/pricing"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Proプランにアップグレード
          </Link>
        </div>
      ) : reports && reports.length > 0 ? (
        <div className="space-y-6">
          {(reports as Report[]).map((report) => (
            <article
              key={report.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {report.year_month.replace('-', '年')}月
                </h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {report.total_entries}件の日記
                </span>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {report.ai_narrative}
              </p>

              {report.emotion_summary?.highlights && (
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    ハイライト
                  </h3>
                  <ul className="space-y-1">
                    {report.emotion_summary.highlights.map(
                      (h: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                        >
                          <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                          {h}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                {report.emotion_summary?.dominant_emotion && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      主要感情:
                    </span>
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      {EMOTION_LABELS[report.emotion_summary.dominant_emotion] ??
                        report.emotion_summary.dominant_emotion}
                    </span>
                  </div>
                )}
                {report.emotion_summary?.emotion_trend && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {report.emotion_summary.emotion_trend}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            まだレポートがありません
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            先月の日記があれば、レポートを生成できます
          </p>
        </div>
      )}
    </>
  );
}
