export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

function getToday() {
  return new Date();
}

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function buildEntries() {
  const today = getToday();
  return [
    {
      id: 'demo-1',
      entry_date: fmt(today),
      content:
        '今日はNext.jsのServer Componentsについて深く理解できた。データフェッチングがサーバー側で完結するので、クライアントバンドルが軽くなるのが良い。チームのコードレビューでも指摘をもらい、エラーハンドリングの改善ができた。少しずつ成長を実感している。',
      template_type: 'learning',
      tags: ['Next.js', 'React', 'コードレビュー'],
      created_at: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 30).toISOString(),
      updated_at: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 30).toISOString(),
    },
    {
      id: 'demo-2',
      entry_date: fmt(daysAgo(1)),
      content:
        '【良かったこと】\nSupabaseの認証機能を実装完了できた。OAuthの仕組みを理解しながら進められた。\n\n【改善したいこと】\nテストコードをもっと早い段階から書くべきだった。後付けだと漏れが出やすい。\n\n【明日の目標】\nCI/CDパイプラインの構築に取り掛かる。',
      template_type: 'reflection',
      tags: ['Supabase', '認証', 'テスト'],
      created_at: daysAgo(1).toISOString(),
      updated_at: daysAgo(1).toISOString(),
    },
    {
      id: 'demo-3',
      entry_date: fmt(daysAgo(2)),
      content:
        '【今日感謝したいこと 3つ】\n1. 先輩エンジニアが丁寧にGitの使い方を教えてくれた\n2. 家族が夜遅くまでの勉強を応援してくれている\n3. オンラインコミュニティで質問に答えてもらえた\n\n【その理由】\n一人では限界がある。周りのサポートがあるからこそ前に進める。',
      template_type: 'gratitude',
      tags: ['感謝', 'コミュニティ', '成長'],
      created_at: daysAgo(2).toISOString(),
      updated_at: daysAgo(2).toISOString(),
    },
    {
      id: 'demo-4',
      entry_date: fmt(daysAgo(3)),
      content:
        'TypeScriptの型パズルに1時間ハマったが、最終的にジェネリクスで綺麗に解決できた。型安全性を保ちながら柔軟なAPIを設計するコツが掴めてきた気がする。夕方に散歩してリフレッシュしたのも良かった。',
      template_type: 'free',
      tags: ['TypeScript', 'ジェネリクス'],
      created_at: daysAgo(3).toISOString(),
      updated_at: daysAgo(3).toISOString(),
    },
    {
      id: 'demo-5',
      entry_date: fmt(daysAgo(5)),
      content:
        '【今日学んだこと】\nTailwind CSSのレスポンシブデザインパターン。モバイルファーストで考えるとコードがすっきりする。\n\n【気づき】\nデザインシステムを先に決めておくと、実装が格段に速くなる。\n\n【次に活かすこと】\nコンポーネントの設計段階でブレイクポイントを意識する。',
      template_type: 'learning',
      tags: ['Tailwind', 'レスポンシブ', 'デザイン'],
      created_at: daysAgo(5).toISOString(),
      updated_at: daysAgo(5).toISOString(),
    },
    {
      id: 'demo-6',
      entry_date: fmt(daysAgo(7)),
      content:
        'ポートフォリオのアイデアが浮かんだ。日記アプリにAI感情分析を組み込めば、技術力のアピールになりそう。Claude APIとの連携も面白い。週末に企画をまとめてみよう。',
      template_type: 'free',
      tags: ['ポートフォリオ', 'AI', '企画'],
      created_at: daysAgo(7).toISOString(),
      updated_at: daysAgo(7).toISOString(),
    },
    {
      id: 'demo-7',
      entry_date: fmt(daysAgo(10)),
      content:
        '【良かったこと】\nGitHub Actionsでの自動テストが通った。PRのワークフローが整ってきた。\n\n【改善したいこと】\nドキュメントを書く習慣をもっとつけたい。\n\n【明日の目標】\nREADMEの充実とコンポーネントのStorybook化。',
      template_type: 'reflection',
      tags: ['CI/CD', 'GitHub Actions'],
      created_at: daysAgo(10).toISOString(),
      updated_at: daysAgo(10).toISOString(),
    },
    {
      id: 'demo-8',
      entry_date: fmt(daysAgo(12)),
      content:
        '【今日感謝したいこと 3つ】\n1. 勉強会で登壇の機会をもらえた\n2. 健康でいられること\n3. 新しいフレームワークに挑戦する好奇心があること',
      template_type: 'gratitude',
      tags: ['勉強会', '感謝'],
      created_at: daysAgo(12).toISOString(),
      updated_at: daysAgo(12).toISOString(),
    },
    {
      id: 'demo-9',
      entry_date: fmt(daysAgo(14)),
      content:
        'Prismaのマイグレーションで少し躓いたが、公式ドキュメントを読み直して解決。やはりドキュメントを読む力は大事。エラーメッセージをちゃんと読む習慣が身についてきた。',
      template_type: 'free',
      tags: ['Prisma', 'デバッグ'],
      created_at: daysAgo(14).toISOString(),
      updated_at: daysAgo(14).toISOString(),
    },
    {
      id: 'demo-10',
      entry_date: fmt(daysAgo(18)),
      content:
        '【今日学んだこと】\nReact Hook FormとZodを使ったバリデーション。型安全なフォームが簡単に作れる。\n\n【気づき】\nライブラリの選定は最初に時間をかけるべき。後から変えるのは大変。',
      template_type: 'learning',
      tags: ['React Hook Form', 'Zod', 'バリデーション'],
      created_at: daysAgo(18).toISOString(),
      updated_at: daysAgo(18).toISOString(),
    },
    {
      id: 'demo-11',
      entry_date: fmt(daysAgo(21)),
      content:
        '朝活を始めて1週間。6時起きが定着してきた。朝の静かな時間にコードを書くと集中できる。体調も良くなった気がする。この習慣は続けたい。',
      template_type: 'free',
      tags: ['朝活', '習慣', '集中力'],
      created_at: daysAgo(21).toISOString(),
      updated_at: daysAgo(21).toISOString(),
    },
    {
      id: 'demo-12',
      entry_date: fmt(daysAgo(25)),
      content:
        '【良かったこと】\n初めてのOSSコントリビュートが受理された！小さなバグ修正だったが嬉しい。\n\n【改善したいこと】\n英語のドキュメントを読むスピードをもっと上げたい。',
      template_type: 'reflection',
      tags: ['OSS', '英語', 'コントリビュート'],
      created_at: daysAgo(25).toISOString(),
      updated_at: daysAgo(25).toISOString(),
    },
  ];
}

export function getDemoEmotionAnalysis() {
  return {
    id: 'demo-emotion-1',
    entry_id: 'demo-1',
    joy: 72,
    sadness: 8,
    anger: 3,
    fear: 10,
    surprise: 35,
    trust: 68,
    anticipation: 80,
    disgust: 2,
    overall_sentiment: '期待・成長',
    ai_feedback:
      '学びへの意欲と成長を実感できている充実した一日でした。技術的な理解が深まり、チームからのフィードバックも前向きに受け止められています。この姿勢を継続することで、さらなるスキルアップが期待できます。',
  };
}

export function getDemoStreak() {
  return {
    current_streak: 4,
    longest_streak: 12,
    last_entry_date: fmt(getToday()),
  };
}

export function getDemoReport() {
  const today = getToday();
  const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  return {
    id: 'demo-report-1',
    year_month: `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`,
    total_entries: 15,
    ai_narrative:
      '先月は技術的な成長が目覚ましい1ヶ月でした。Next.js、TypeScript、Supabaseなどモダンな技術スタックへの理解が深まり、実践的なプロジェクトを通じて着実にスキルアップしています。特にServer Componentsの活用やCI/CDの構築など、実務で求められるスキルの習得が進んでいます。感情面では「期待」と「信頼」のスコアが高く、前向きな姿勢が維持されています。',
    emotion_summary: {
      dominant_emotion: 'anticipation',
      emotion_trend: '月を通じて期待と信頼のスコアが安定して高い傾向',
      highlights: [
        'OSSへの初コントリビュートが受理された',
        'GitHub ActionsによるCI/CDパイプラインを構築',
        '朝活の習慣化に成功（6時起き1週間継続）',
        'AI感情分析機能の企画・設計を開始',
      ],
      avg_scores: {
        joy: 65,
        sadness: 12,
        anger: 5,
        fear: 15,
        surprise: 30,
        trust: 70,
        anticipation: 75,
        disgust: 3,
      },
    },
    created_at: new Date().toISOString(),
  };
}

export const DEMO_PROFILE = {
  display_name: 'テストユーザー',
  avatar_url: null,
  timezone: 'Asia/Tokyo',
};

export const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  app_metadata: { provider: 'github' },
};

export function getDemoEntryDates(): string[] {
  return buildEntries().map((e) => e.entry_date);
}

export function getDemoRecentEntries(limit = 5) {
  return buildEntries().slice(0, limit);
}

export function getDemoTodayEntry() {
  const todayStr = fmt(getToday());
  return buildEntries().find((e) => e.entry_date === todayStr) ?? null;
}

export function getDemoMonthEntries() {
  const today = getToday();
  const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  const nextMonth =
    today.getMonth() === 11
      ? `${today.getFullYear() + 1}-01-01`
      : `${today.getFullYear()}-${String(today.getMonth() + 2).padStart(2, '0')}-01`;
  return buildEntries().filter(
    (e) => e.entry_date >= monthStart && e.entry_date < nextMonth,
  );
}

export function getDemoEntry(id: string) {
  const entries = buildEntries();
  return entries.find((e) => e.id === id) ?? entries[0];
}

export function getDemoAnalytics() {
  const entries = buildEntries();
  const today = getToday();

  const weeklyMap = new Map<string, number>();
  for (const e of entries) {
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

  const templateLabels: Record<string, string> = {
    free: '自由記述', reflection: '振り返り', gratitude: '感謝', learning: '学び',
  };
  const templateMap = new Map<string, number>();
  for (const e of entries) {
    const label = templateLabels[e.template_type] ?? e.template_type;
    templateMap.set(label, (templateMap.get(label) ?? 0) + 1);
  }
  const templateData = Array.from(templateMap.entries()).map(([name, value]) => ({ name, value }));

  const tagMap = new Map<string, number>();
  for (const e of entries) {
    for (const tag of e.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }
  const tagData = Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  const emotionAvg = [
    { emotion: '喜び', score: 68 },
    { emotion: '悲しみ', score: 15 },
    { emotion: '怒り', score: 8 },
    { emotion: '不安', score: 78 },
    { emotion: '穏やか', score: 72 },
  ];

  const emotionTrend = [
    { date: fmt(daysAgo(25)).slice(5), joy: 55, sadness: 20, anger: 10, surprise: 70, calm: 60 },
    { date: fmt(daysAgo(21)).slice(5), joy: 60, sadness: 12, anger: 5, surprise: 75, calm: 65 },
    { date: fmt(daysAgo(18)).slice(5), joy: 65, sadness: 18, anger: 8, surprise: 72, calm: 68 },
    { date: fmt(daysAgo(14)).slice(5), joy: 50, sadness: 25, anger: 15, surprise: 68, calm: 55 },
    { date: fmt(daysAgo(12)).slice(5), joy: 70, sadness: 10, anger: 5, surprise: 80, calm: 65 },
    { date: fmt(daysAgo(10)).slice(5), joy: 62, sadness: 15, anger: 8, surprise: 74, calm: 60 },
    { date: fmt(daysAgo(7)).slice(5), joy: 65, sadness: 8, anger: 3, surprise: 82, calm: 64 },
    { date: fmt(daysAgo(5)).slice(5), joy: 68, sadness: 12, anger: 6, surprise: 78, calm: 62 },
    { date: fmt(daysAgo(3)).slice(5), joy: 58, sadness: 15, anger: 10, surprise: 76, calm: 55 },
    { date: fmt(daysAgo(2)).slice(5), joy: 62, sadness: 8, anger: 4, surprise: 80, calm: 60 },
    { date: fmt(daysAgo(1)).slice(5), joy: 65, sadness: 14, anger: 7, surprise: 78, calm: 62 },
    { date: fmt(today).slice(5), joy: 60, sadness: 8, anger: 3, surprise: 82, calm: 65 },
  ];

  return {
    totalEntries: entries.length,
    totalAnalyses: 10,
    avgEntriesPerWeek: 3.4,
    weeklyData,
    templateData,
    tagData,
    emotionAvg,
    emotionTrend,
  };
}

export function getDemoCalendarEntries(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const end =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, '0')}-01`;
  return buildEntries().filter((e) => e.entry_date >= start && e.entry_date < end);
}
