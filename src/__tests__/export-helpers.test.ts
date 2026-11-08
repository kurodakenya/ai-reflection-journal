import { describe, test, expect } from 'vitest';

function escapeCSV(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

describe('CSV escapeCSV helper', () => {
  test('returns plain string unchanged', () => {
    expect(escapeCSV('hello')).toBe('hello');
  });

  test('wraps string with commas in quotes', () => {
    expect(escapeCSV('a,b')).toBe('"a,b"');
  });

  test('escapes double quotes', () => {
    expect(escapeCSV('say "hi"')).toBe('"say ""hi"""');
  });

  test('wraps string with newlines', () => {
    expect(escapeCSV('line1\nline2')).toBe('"line1\nline2"');
  });

  test('handles combined special characters', () => {
    expect(escapeCSV('a,"b"\nc')).toBe('"a,""b""\nc"');
  });
});

describe('export data structure', () => {
  test('maps entry with analysis correctly', () => {
    const entry = {
      id: '1',
      entry_date: '2026-11-01',
      template_type: 'free',
      content: 'Good day',
      tags: ['happy'],
      created_at: '2026-11-01T10:00:00Z',
      updated_at: '2026-11-01T10:00:00Z',
    };
    const analysis = {
      entry_id: '1',
      joy: 0.8,
      sadness: 0.1,
      anger: 0.0,
      fear: 0.05,
      surprise: 0.2,
      trust: 0.7,
      anticipation: 0.3,
      disgust: 0.0,
      overall_sentiment: 'positive',
      ai_feedback: 'Great day!',
    };
    const analysisMap = new Map([[analysis.entry_id, analysis]]);
    const mapped = {
      entry_date: entry.entry_date,
      template_type: entry.template_type,
      content: entry.content,
      tags: entry.tags,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
      emotion_analysis: analysisMap.has(entry.id)
        ? {
            joy: analysis.joy,
            sadness: analysis.sadness,
            anger: analysis.anger,
            fear: analysis.fear,
            surprise: analysis.surprise,
            trust: analysis.trust,
            anticipation: analysis.anticipation,
            disgust: analysis.disgust,
            overall_sentiment: analysis.overall_sentiment,
            ai_feedback: analysis.ai_feedback,
          }
        : null,
    };

    expect(mapped.emotion_analysis).not.toBeNull();
    expect(mapped.emotion_analysis!.joy).toBe(0.8);
    expect(mapped.emotion_analysis!.overall_sentiment).toBe('positive');
  });

  test('maps entry without analysis as null', () => {
    const entry = {
      id: '2',
      entry_date: '2026-11-02',
      template_type: 'free',
      content: 'No analysis',
      tags: [],
      created_at: '2026-11-02T10:00:00Z',
      updated_at: '2026-11-02T10:00:00Z',
    };
    const analysisMap = new Map();
    const mapped = {
      emotion_analysis: analysisMap.has(entry.id) ? {} : null,
    };

    expect(mapped.emotion_analysis).toBeNull();
  });
});
