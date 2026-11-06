-- ============================================
-- AI振り返りジャーナル — DBマイグレーション
-- 全6テーブルの作成
-- ============================================

-- 1. profiles（ユーザープロフィール）
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'Asia/Tokyo',
  free_entries_used INT DEFAULT 0,
  free_analyses_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. journal_entries（日記エントリ）
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  template_type TEXT DEFAULT 'free',
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_entries_entry_date ON journal_entries(user_id, entry_date);
CREATE INDEX idx_entries_tags ON journal_entries USING GIN(tags);

-- 3. emotion_analyses（AI感情分析結果）
CREATE TABLE emotion_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL UNIQUE REFERENCES journal_entries(id) ON DELETE CASCADE,
  joy REAL DEFAULT 0 CHECK (joy >= 0 AND joy <= 1),
  anger REAL DEFAULT 0 CHECK (anger >= 0 AND anger <= 1),
  sadness REAL DEFAULT 0 CHECK (sadness >= 0 AND sadness <= 1),
  surprise REAL DEFAULT 0 CHECK (surprise >= 0 AND surprise <= 1),
  calm REAL DEFAULT 0 CHECK (calm >= 0 AND calm <= 1),
  energy_level INT DEFAULT 3 CHECK (energy_level >= 1 AND energy_level <= 5),
  ai_feedback TEXT,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_entry_id ON emotion_analyses(entry_id);

-- 4. streaks（連続記録トラッキング）
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_entry_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. subscriptions（Stripeサブスクリプション情報）
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT DEFAULT 'free' CHECK (status IN ('free', 'active', 'canceled', 'past_due', 'incomplete')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. monthly_reports（月間AIレポート）
CREATE TABLE monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  year_month TEXT NOT NULL,
  emotion_summary JSONB,
  ai_narrative TEXT,
  total_entries INT DEFAULT 0,
  avg_energy REAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, year_month)
);

CREATE INDEX idx_reports_user_month ON monthly_reports(user_id, year_month);
