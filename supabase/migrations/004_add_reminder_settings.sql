-- リマインダー通知設定カラムの追加
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reminder_time TIME DEFAULT '21:00:00';
