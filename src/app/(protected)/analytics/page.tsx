import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEMO_MODE } from '@/lib/demo';
import { getDemoAnalytics } from '@/lib/demo';
import { AnalyticsCharts } from './AnalyticsCharts';

export const instant = false;

const TEMPLATE_LABELS: Record<string, string> = {
  free: '自由記述',
  reflection: '振り返り',
  gratitude: '感謝',
  learning: '学び',
};

const EMOTION_LABELS: Record<string, string> = {
  joy: '喜び',
  sadness: '悲しみ',
  anger: '怒り',
  surprise: '驚き',
  calm: '穏やか',
};

export default async function AnalyticsPage() {
  await connection();

  if (DEMO_MODE) {
    const data = getDemoAnalytics();
    return (
      <>
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">分析</h1>
        <AnalyticsCharts data={data} />
      </>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: entries } = await supabase
    .from('journal_entries')
    .select('id, entry_date, template_type, tags, created_at')
    .order('entry_date', { ascending: true });

  const { data: analyses } = await supabase
    .from('emotion_analyses')
    .select('entry_id, joy, anger, sadness, surprise, calm, created_at');

  const allEntries = entries ?? [];
  const allAnalyses = analyses ?? [];
  const totalEntries = allEntries.length;
  const totalAnalyses = allAnalyses.length;

  const dates = allEntries.map((e) => new Date(e.entry_date));
  let avgEntriesPerWeek = 0;
  if (dates.length >= 2) {
    const first = dates[0].getTime();
    const last = dates[dates.length - 1].getTime();
    const weeks = Math.max(1, (last - first) / (7 * 24 * 60 * 60 * 1000));
    avgEntriesPerWeek = Math.round((totalEntries / weeks) * 10) / 10;
  } else {
    avgEntriesPerWeek = totalEntries;
  }

  const weeklyMap = new Map<string, number>();
  for (const e of allEntries) {
    const d = new Date(e.entry_date);
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    const key = `${monday.getMonth() + 1}/${monday.getDate()}`;
    weeklyMap.set(key, (weeklyMap.get(key) ?? 0) + 1);
  }
  const weeklyData = Array.from(weeklyMap.entries())
    .slice(-8)
    .map(([week, count]) => ({ week, count }));

  const templateMap = new Map<string, number>();
  for (const e of allEntries) {
    const label = TEMPLATE_LABELS[e.template_type] ?? e.template_type;
    templateMap.set(label, (templateMap.get(label) ?? 0) + 1);
  }
  const templateData = Array.from(templateMap.entries()).map(([name, value]) => ({ name, value }));

  const tagMap = new Map<string, number>();
  for (const e of allEntries) {
    if (e.tags) {
      for (const tag of e.tags) {
        tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
      }
    }
  }
  const tagData = Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  const emotionSums: Record<string, number> = { joy: 0, sadness: 0, anger: 0, surprise: 0, calm: 0 };
  for (const a of allAnalyses) {
    emotionSums.joy += (a.joy ?? 0) * 100;
    emotionSums.sadness += (a.sadness ?? 0) * 100;
    emotionSums.anger += (a.anger ?? 0) * 100;
    emotionSums.surprise += (a.surprise ?? 0) * 100;
    emotionSums.calm += (a.calm ?? 0) * 100;
  }
  const n = allAnalyses.length || 1;
  const emotionAvg = Object.entries(emotionSums).map(([key, sum]) => ({
    emotion: EMOTION_LABELS[key] ?? key,
    score: Math.round(sum / n),
  }));

  const analysisMap = new Map<string, typeof allAnalyses[0]>();
  for (const a of allAnalyses) {
    analysisMap.set(a.entry_id, a);
  }
  const emotionTrend = allEntries
    .filter((e) => analysisMap.has(e.id))
    .slice(-20)
    .map((e) => {
      const a = analysisMap.get(e.id)!;
      return {
        date: e.entry_date.slice(5),
        joy: Math.round((a.joy ?? 0) * 100),
        sadness: Math.round((a.sadness ?? 0) * 100),
        anger: Math.round((a.anger ?? 0) * 100),
        surprise: Math.round((a.surprise ?? 0) * 100),
        calm: Math.round((a.calm ?? 0) * 100),
      };
    });

  const data = {
    totalEntries,
    totalAnalyses,
    avgEntriesPerWeek,
    weeklyData,
    templateData,
    tagData,
    emotionAvg,
    emotionTrend,
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">分析</h1>
      <AnalyticsCharts data={data} />
    </>
  );
}
