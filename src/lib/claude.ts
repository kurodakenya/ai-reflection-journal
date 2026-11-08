import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type EmotionScores = {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  trust: number;
  anticipation: number;
  disgust: number;
};

export type EmotionAnalysisResult = {
  scores: EmotionScores;
  summary: string;
  dominant_emotion: string;
};

export async function analyzeEmotion(
  content: string,
): Promise<EmotionAnalysisResult> {
  const response = await client.messages.create({
    model: 'claude-haiku-5-5',
    max_tokens: 1024,
    system: `あなたは感情分析の専門家です。与えられた日記テキストを分析し、以下のJSON形式で感情スコアを返してください。
各感情スコアは0〜100の整数で、テキストに含まれる感情の強さを表します。
summaryは日記の感情的な要約を1〜2文の日本語で書いてください。
dominant_emotionは最も強い感情の英語名です。

必ず以下のJSON形式のみで回答してください（他のテキストは不要）:
{
  "scores": {
    "joy": 0,
    "sadness": 0,
    "anger": 0,
    "fear": 0,
    "surprise": 0,
    "trust": 0,
    "anticipation": 0,
    "disgust": 0
  },
  "summary": "...",
  "dominant_emotion": "joy"
}`,
    messages: [
      {
        role: 'user',
        content: `以下の日記テキストの感情を分析してください:\n\n${content}`,
      },
    ],
  });

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === 'text',
  );

  if (!textBlock) {
    throw new Error('No text response from Claude API');
  }

  const parsed = JSON.parse(textBlock.text) as EmotionAnalysisResult;
  return parsed;
}

export type MonthlyReportResult = {
  narrative: string;
  highlights: string[];
  emotion_summary: {
    dominant_emotion: string;
    emotion_trend: string;
    avg_scores: EmotionScores;
  };
};

export async function generateMonthlyReport(
  entries: { date: string; content: string; emotion?: string }[],
  yearMonth: string,
): Promise<MonthlyReportResult> {
  const entrySummaries = entries
    .map((e) => `【${e.date}】${e.emotion ? `(${e.emotion}) ` : ''}${e.content.slice(0, 300)}`)
    .join('\n\n');

  const response = await client.messages.create({
    model: 'claude-haiku-5-5',
    max_tokens: 2048,
    system: `あなたは振り返りジャーナルのAIアシスタントです。ユーザーの1ヶ月分の日記データを分析し、月間レポートを生成してください。

必ず以下のJSON形式のみで回答してください（他のテキストは不要）:
{
  "narrative": "月間の振り返りナラティブ（300〜500文字の日本語）",
  "highlights": ["印象的な出来事や気づき（3〜5個の短い文）"],
  "emotion_summary": {
    "dominant_emotion": "最も多かった感情（英語）",
    "emotion_trend": "感情の推移の説明（1〜2文の日本語）",
    "avg_scores": {
      "joy": 0, "sadness": 0, "anger": 0, "fear": 0,
      "surprise": 0, "trust": 0, "anticipation": 0, "disgust": 0
    }
  }
}`,
    messages: [
      {
        role: 'user',
        content: `${yearMonth}の日記データ（${entries.length}件）を分析して月間レポートを生成してください:\n\n${entrySummaries}`,
      },
    ],
  });

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === 'text',
  );

  if (!textBlock) {
    throw new Error('No text response from Claude API');
  }

  return JSON.parse(textBlock.text) as MonthlyReportResult;
}
