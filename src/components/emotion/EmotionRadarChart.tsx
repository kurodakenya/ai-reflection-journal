'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

type EmotionData = {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  trust: number;
  anticipation: number;
  disgust: number;
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

export function EmotionRadarChart({ scores }: { scores: EmotionData }) {
  const data = Object.entries(scores).map(([key, value]) => ({
    emotion: EMOTION_LABELS[key] ?? key,
    score: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis
          dataKey="emotion"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#6B7280', fontSize: 10 }}
        />
        <Radar
          name="感情スコア"
          dataKey="score"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.3}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
