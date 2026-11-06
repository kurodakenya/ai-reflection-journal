-- ============================================
-- RLS（Row Level Security）ポリシーの設定
-- 全テーブルで「自分のデータのみアクセス可能」を保証
-- ============================================

-- profiles（id = auth.uid() で判定）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- journal_entries
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries"
  ON journal_entries FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own entries"
  ON journal_entries FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own entries"
  ON journal_entries FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own entries"
  ON journal_entries FOR DELETE
  USING (user_id = auth.uid());

-- emotion_analyses
ALTER TABLE emotion_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON emotion_analyses FOR SELECT
  USING (entry_id IN (
    SELECT id FROM journal_entries WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own analyses"
  ON emotion_analyses FOR INSERT
  WITH CHECK (entry_id IN (
    SELECT id FROM journal_entries WHERE user_id = auth.uid()
  ));

-- streaks
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks"
  ON streaks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own streaks"
  ON streaks FOR UPDATE
  USING (user_id = auth.uid());

-- subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- monthly_reports
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON monthly_reports FOR SELECT
  USING (user_id = auth.uid());
