'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

type AnalyticsData = {
  totalEntries: number;
  totalAnalyses: number;
  avgEntriesPerWeek: number;
  weeklyData: { week: string; count: number }[];
  templateData: { name: string; value: number }[];
  tagData: { tag: string; count: number }[];
  emotionAvg: { emotion: string; score: number }[];
  emotionTrend: { date: string; joy: number; sadness: number; anger: number; surprise: number; calm: number }[];
};

const TEMPLATE_COLORS: Record<string, string> = {
  '自由記述': '#3B82F6',
  '振り返り': '#8B5CF6',
  '感謝': '#22C55E',
  '学び': '#F59E0B',
};

const PIE_COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B'];

export function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="総日記数" value={data.totalEntries} unit="件" />
        <StatCard label="AI分析回数" value={data.totalAnalyses} unit="回" />
        <StatCard label="週平均" value={data.avgEntriesPerWeek} unit="件/週" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="テンプレート別の割合">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data.templateData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.templateData.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={TEMPLATE_COLORS[entry.name] ?? PIE_COLORS[i % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                itemStyle={{ color: '#D1D5DB' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="感情スコア平均">
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={data.emotionAvg} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="emotion" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Radar name="平均" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="感情の推移" wide>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.emotionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line type="monotone" dataKey="joy" name="喜び" stroke="#FBBF24" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sadness" name="悲しみ" stroke="#60A5FA" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="anger" name="怒り" stroke="#F87171" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="surprise" name="不安" stroke="#A78BFA" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="calm" name="穏やか" stroke="#34D399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
            <Legend color="#FBBF24" label="喜び" />
            <Legend color="#60A5FA" label="悲しみ" />
            <Legend color="#F87171" label="怒り" />
            <Legend color="#A78BFA" label="不安" />
            <Legend color="#34D399" label="穏やか" />
          </div>
        </ChartCard>

        <ChartCard title="週別の投稿数">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#D1D5DB' }}
                itemStyle={{ color: '#93C5FD' }}
              />
              <Bar dataKey="count" name="日記数" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="よく使うタグ TOP10">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.tagData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} />
              <YAxis
                dataKey="tag"
                type="category"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                width={100}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                itemStyle={{ color: '#93C5FD' }}
              />
              <Bar dataKey="count" name="使用回数" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
        {value}
        <span className="ml-1 text-sm font-normal text-gray-400">{unit}</span>
      </p>
    </div>
  );
}

function ChartCard({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 ${wide ? 'lg:col-span-2' : ''}`}>
      <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      {children}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-gray-400">
      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
