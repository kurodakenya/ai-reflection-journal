# AI振り返りジャーナル — 要件定義・基本設計書

> **プロジェクト名:** AI振り返りジャーナル (AI Reflection Journal)
> **作成日:** 2026-11-06
> **ステータス:** 要件定義完了 → 開発着手待ち

---

## 1. プロダクト概要

### 1.1 コンセプト

日記を書くと AI が感情を分析し、感情の推移や傾向を可視化するジャーナルアプリ。
「書く → 分析される → 自分の変化が見える」のサイクルでユーザーの自己理解と習慣化を支援する。

### 1.2 ターゲットユーザー

- 自己分析・内省に関心のある20〜40代
- 日記習慣を作りたいが続かない人
- メンタルヘルスに関心があり、感情の変化を客観視したい人

### 1.3 ビジネスモデル

| | Free | Pro（¥980/月） |
|---|---|---|
| 日記作成 | 10件/月 | 無制限 |
| AI感情分析 | 5件/月 | 全件自動 |
| 感情トレンド | 直近7日 | 全期間 |
| AIフィードバック | × | ○ |
| 月間レポート | × | ○ |
| データエクスポート | × | ○ |
| テンプレート | 3種類 | 全種類 |

**収益目標:** 60名の有料ユーザー = ¥30,000/月（初期マイルストーン）

---

## 2. 技術スタック

| レイヤー | 技術 | 選定理由 |
|---|---|---|
| フロントエンド | Next.js 14+ (App Router) / TypeScript | SSR/SSG対応、App Routerでの最新設計 |
| スタイリング | Tailwind CSS | ユーティリティファースト、高速UI構築 |
| バックエンド/DB | Supabase (PostgreSQL) | Auth・DB・RLS・Realtimeを一括提供 |
| 認証 | Supabase Auth | OAuth (Google/GitHub) + メール認証 |
| AI | Claude API (Anthropic) | 感情分析・月間レポート生成 |
| グラフ | Recharts | React対応、軽量、カスタマイズ性 |
| 決済 | Stripe | サブスクリプション管理、Webhook連携 |
| ホスティング | Vercel | Next.jsとの親和性、Edge Functions |

---

## 3. 機能一覧

### 3.1 認証・アカウント

| ID | 機能 | 説明 | Free | Pro |
|---|---|---|---|---|
| AUTH-01 | ユーザー登録 | メール+パスワード / OAuth (Google, GitHub) | ○ | ○ |
| AUTH-02 | ログイン / ログアウト | セッション管理（Supabase Auth） | ○ | ○ |
| AUTH-03 | パスワードリセット | メールによるリセットリンク送信 | ○ | ○ |
| AUTH-04 | プロフィール設定 | 表示名・アバター・タイムゾーン | ○ | ○ |

### 3.2 ジャーナル（日記）

| ID | 機能 | 説明 | Free | Pro |
|---|---|---|---|---|
| JOUR-01 | 日記作成 | Markdown対応テキスト入力 | 10件/月 | 無制限 |
| JOUR-02 | 日記編集 | 既存エントリの編集 | ○ | ○ |
| JOUR-03 | 日記削除 | 確認ダイアログ付き削除 | ○ | ○ |
| JOUR-04 | カレンダービュー | 月間カレンダーで日記の有無を表示 | ○ | ○ |
| JOUR-05 | テンプレート選択 | 「今日の振り返り」「感謝日記」「目標進捗」等 | 3種類 | 全種類 |
| JOUR-06 | タグ機能 | カスタムタグの付与・フィルタリング | ○ | ○ |
| JOUR-07 | 日記詳細表示 | Markdown→HTMLレンダリング + AI分析結果 | ○ | ○ |

### 3.3 AI分析

| ID | 機能 | 説明 | Free | Pro |
|---|---|---|---|---|
| AI-01 | 感情分析 | 5感情 (喜・怒・哀・驚・安心) + エネルギーレベル (1-5) | 5件/月 | 全件自動 |
| AI-02 | AIフィードバック | 1エントリごとの短いコメント生成 | × | ○ |
| AI-03 | 月間レポート | 「今月のあなた」AI生成サマリー（月初自動生成） | × | ○ |
| AI-04 | 感情トレンドグラフ | 週次・月次の感情推移チャート (Recharts) | 直近7日 | 全期間 |

### 3.4 モチベーション

| ID | 機能 | 説明 | Free | Pro |
|---|---|---|---|---|
| MOT-01 | ストリーク | 連続記録日数 + 最長記録の表示 | ○ | ○ |
| MOT-02 | リマインダー通知 | 毎日の記入リマインド（時間指定可） | ○ | ○ |

### 3.5 データ管理

| ID | 機能 | 説明 | Free | Pro |
|---|---|---|---|---|
| DATA-01 | データエクスポート | JSON / CSV形式でのダウンロード | × | ○ |
| DATA-02 | アカウント削除 | 全データの完全削除（確認ダイアログ付き） | ○ | ○ |

### 3.6 課金

| ID | 機能 | 説明 |
|---|---|---|
| PAY-01 | Stripe Checkout | サブスクリプション購入フロー |
| PAY-02 | Webhook連携 | 支払い状態の同期 (active/canceled/past_due) |
| PAY-03 | 請求ポータル | Stripeカスタマーポータルへのリダイレクト |
| PAY-04 | Free制限管理 | 月間利用カウントの追跡とリセット |

---

## 4. DB設計（Supabase / PostgreSQL）

### 4.1 テーブル一覧

| テーブル名 | 説明 |
|---|---|
| profiles | ユーザープロフィール（auth.usersと1:1） |
| journal_entries | 日記エントリ |
| emotion_analyses | AI感情分析結果 |
| streaks | 連続記録トラッキング |
| subscriptions | Stripeサブスクリプション情報 |
| monthly_reports | 月間AIレポート |

### 4.2 テーブル定義

#### profiles

```sql
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
```

**備考:**
- `auth.users` の作成時にトリガーで自動生成
- `free_entries_used` / `free_analyses_used` は月初にcronジョブでリセット

#### journal_entries

```sql
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
```

**備考:**
- `entry_date` と `created_at` は分離（深夜に「今日の分」を書くケース対応）
- `tags` は PostgreSQL の `text[]` 型、GINインデックスで高速検索
- `template_type`: `'free'`, `'gratitude'`, `'goal'`, `'reflection'`, `'custom'`

#### emotion_analyses

```sql
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
```

**備考:**
- 各感情スコアは 0.0〜1.0 の float（合計は1.0に正規化しない。複数感情が同時に高いケースを許容）
- `energy_level` は 1（低）〜5（高）の5段階
- `raw_response` に Claude API のレスポンス全体を JSONB で保存（デバッグ・改善用）
- 1エントリにつき1分析（`entry_id` に UNIQUE制約）

#### streaks

```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_entry_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**備考:**
- ユーザーごとに1レコード（UNIQUE制約）
- 日記投稿時に `last_entry_date` との差分で `current_streak` を更新
  - 差分 = 1日 → `current_streak += 1`
  - 差分 = 0日（同日2回目）→ 変更なし
  - 差分 > 1日 → `current_streak = 1`（リセット）
- `longest_streak = MAX(current_streak, longest_streak)`

#### subscriptions

```sql
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
```

**備考:**
- Stripe Webhook で `status` を同期
- `cancel_at_period_end = true` の場合、期間終了まではPro機能を維持
- `plan` はアプリ内での権限判定に使用

#### monthly_reports

```sql
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
```

**備考:**
- `year_month` は `'2026-11'` 形式
- `emotion_summary` 例:
  ```json
  {
    "avg_joy": 0.65,
    "avg_anger": 0.12,
    "avg_sadness": 0.20,
    "avg_surprise": 0.30,
    "avg_calm": 0.55,
    "dominant_emotion": "joy",
    "trend": "improving"
  }
  ```
- 月初にcronで前月分を自動生成（Proユーザーのみ）

### 4.3 RLS（Row Level Security）ポリシー

全テーブルに対して以下のポリシーを適用:

```sql
-- 全テーブル共通パターン
ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

-- SELECT: 自分のデータのみ閲覧可能
CREATE POLICY "Users can view own data"
  ON <table_name> FOR SELECT
  USING (user_id = auth.uid());

-- INSERT: 自分のデータのみ作成可能
CREATE POLICY "Users can insert own data"
  ON <table_name> FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- UPDATE: 自分のデータのみ更新可能
CREATE POLICY "Users can update own data"
  ON <table_name> FOR UPDATE
  USING (user_id = auth.uid());

-- DELETE: 自分のデータのみ削除可能
CREATE POLICY "Users can delete own data"
  ON <table_name> FOR DELETE
  USING (user_id = auth.uid());
```

**profiles テーブルは `id = auth.uid()` で判定**（`user_id` ではなく `id`）。

### 4.4 Database Functions / Triggers

```sql
-- 1. 新規ユーザー登録時にprofilesを自動作成
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));

  INSERT INTO streaks (user_id)
  VALUES (NEW.id);

  INSERT INTO subscriptions (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. updated_atの自動更新
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 5. 画面構成

### 5.1 画面一覧

| # | 画面名 | ルート | 認証 | 説明 |
|---|---|---|---|---|
| 1 | ランディングページ | `/` | 不要 | 未ログインユーザー向けLP |
| 2 | ログイン/サインアップ | `/auth` | 不要 | 認証画面 |
| 3 | ダッシュボード | `/dashboard` | 必要 | ホーム画面 |
| 4 | 日記作成 | `/entries/new` | 必要 | 新規日記入力 |
| 5 | 日記編集 | `/entries/[id]/edit` | 必要 | 既存日記の編集 |
| 6 | 日記詳細 | `/entries/[id]` | 必要 | 日記閲覧 + AI分析結果 |
| 7 | カレンダー | `/calendar` | 必要 | 月間カレンダービュー |
| 8 | 感情アナリティクス | `/analytics` | 必要 | 感情トレンドグラフ |
| 9 | 月間レポート | `/reports/[year-month]` | 必要 | AIサマリー（Pro） |
| 10 | 設定 | `/settings` | 必要 | アカウント・通知・課金管理 |
| 11 | 料金プラン | `/pricing` | 不要 | Free/Pro比較 + アップグレード |

### 5.2 画面詳細

#### 5.2.1 ランディングページ (`/`)

- **SSG（静的生成）** で配信
- ヒーローセクション: キャッチコピー + 「無料で始める」CTA
- 機能紹介: 3カラムレイアウトで主要機能をアイコン付き紹介
- 料金プラン: Free/Pro比較テーブル
- フッター: 利用規約・プライバシーポリシー
- OGP画像設定（SNSシェア対策）

#### 5.2.2 ログイン / サインアップ (`/auth`)

- メール + パスワード入力フォーム
- OAuth ボタン（Google / GitHub）
- 「アカウント作成」⇄「ログイン」切り替え
- パスワードリセット（メール送信フロー）
- 認証後 → `/dashboard` にリダイレクト

#### 5.2.3 ダッシュボード (`/dashboard`)

| コンポーネント | 説明 |
|---|---|
| 今日のカード | 未記入時: 「今日の振り返りを書く」ボタン / 記入済み: サマリー表示 |
| ストリーク表示 | 🔥 連続N日 + 最長記録 |
| 感情ミニチャート | 直近7日の感情推移（折れ線グラフ / Recharts） |
| 月間カレンダー | 日記のある日をドットでハイライト |
| Free残数バー | 「今月あとN件書けます」（Freeユーザーのみ表示） |

#### 5.2.4 日記作成・編集 (`/entries/new`, `/entries/[id]/edit`)

| コンポーネント | 説明 |
|---|---|
| テンプレート選択 | 「今日の振り返り」「感謝日記」「目標進捗」等のプリセット |
| テキストエディタ | Markdown対応のリッチテキストエリア |
| タグ入力 | チップ形式でのタグ追加・削除 |
| 日付選択 | デフォルトは今日、カレンダーから変更可能 |
| 保存ボタン | 保存時にAI感情分析をトリガー（Proは自動、Freeは残回数判定） |
| AI分析結果 | 保存後にモーダルまたはインラインで感情スコア + フィードバック表示 |

#### 5.2.5 日記詳細 (`/entries/[id]`)

- 日記本文（Markdown → HTMLレンダリング）
- 感情スコア表示（レーダーチャート / Recharts）
- AIフィードバック表示（Pro）
- アクションバー: 編集 / 削除

#### 5.2.6 カレンダービュー (`/calendar`)

- 月間カレンダー（日記ありの日を感情カラーのドットで表示）
- 感情カラーマッピング: 喜=緑、怒=赤、哀=青、驚=黄、安心=紫
- 日付クリック → 日記詳細へ遷移
- 月切り替えナビゲーション

#### 5.2.7 感情アナリティクス (`/analytics`)

| コンポーネント | 説明 |
|---|---|
| 期間切り替え | 7日 / 30日 / 90日 / 全期間（Free: 7日のみ） |
| 感情推移グラフ | 折れ線チャート。5感情を色分け |
| エネルギーレベル推移 | バーチャート |
| 感情分布 | 円グラフまたはレーダーチャート |
| Pro誘導 | 7日超選択時にFreeユーザーへアップグレード案内 |

#### 5.2.8 月間レポート (`/reports/[year-month]`) — Pro専用

- 「今月のあなた」AI生成サマリー文
- 感情ハイライト（最多感情 + 変化傾向）
- 記録統計（総記入日数 / 平均エネルギー / ストリーク）
- 過去レポート一覧（月別アーカイブ）

#### 5.2.9 設定 (`/settings`)

- プロフィール編集（表示名・アバター・タイムゾーン）
- 通知設定（リマインダー時間の設定）
- プラン管理（現在のプラン + Stripe請求ポータルリンク）
- データエクスポート（JSON / CSV）— Pro
- アカウント削除（確認ダイアログ付き）

#### 5.2.10 料金プラン (`/pricing`)

- Free / Pro 並列比較カード
- 「Proにアップグレード」→ Stripe Checkout
- FAQ（解約方法、データ移行等）

### 5.3 共通レイアウト

```
┌─────────────────────────────────────────┐
│  ヘッダー（ロゴ / ナビ / ユーザーメニュー）  │
├─────────────────────────────────────────┤
│                                         │
│           メインコンテンツ                 │
│                                         │
├─────────────────────────────────────────┤
│  モバイルナビ（ボトムタブ）                  │
└─────────────────────────────────────────┘
```

**ナビゲーション項目:**
- ホーム（ダッシュボード）
- 書く（日記作成）
- カレンダー
- 分析
- 設定

---

## 6. AI感情分析の設計

### 6.1 Claude API プロンプト設計

```
あなたは感情分析の専門家です。
以下の日記テキストを分析し、JSON形式で結果を返してください。

## 分析項目
- joy (喜び): 0.0〜1.0
- anger (怒り): 0.0〜1.0
- sadness (哀しみ): 0.0〜1.0
- surprise (驚き): 0.0〜1.0
- calm (安心): 0.0〜1.0
- energy_level (エネルギーレベル): 1〜5の整数
- feedback (フィードバック): 50〜100文字の共感的なコメント

## ルール
- 各感情スコアは独立して評価（合計が1.0になる必要はない）
- 複数の感情が同時に高いケースも許容
- フィードバックは共感的・肯定的なトーンで
- JSON以外の出力は不要

## 日記テキスト
{content}
```

### 6.2 レスポンス形式

```json
{
  "joy": 0.72,
  "anger": 0.05,
  "sadness": 0.15,
  "surprise": 0.30,
  "calm": 0.60,
  "energy_level": 4,
  "feedback": "新しい挑戦に前向きに取り組んでいる姿勢が印象的です。少し疲れも感じているようですが、充実した一日だったのが伝わってきます。"
}
```

### 6.3 月間レポート生成プロンプト

```
あなたはパーソナルコーチです。
以下はユーザーの1ヶ月分の日記と感情分析データです。
「今月のあなた」として、300〜500文字のナラティブレポートを生成してください。

## 含めるべき内容
- 全体的な感情の傾向と変化
- 特に印象的だった出来事やテーマ
- ポジティブな変化や成長のポイント
- 来月に向けた前向きなメッセージ

## データ
{monthly_data}
```

### 6.4 API呼び出しフロー

```
[日記保存] → [Free制限チェック] → [Claude API呼び出し]
                                       ↓
                              [レスポンスパース]
                                       ↓
                              [emotion_analyses に保存]
                                       ↓
                              [ストリーク更新]
                                       ↓
                              [UI に結果表示]
```

---

## 7. Stripe 課金フロー

### 7.1 アップグレードフロー

```
[Pro購入ボタン] → [API: Stripe Checkout Session作成]
                          ↓
                  [Stripe Checkout画面]
                          ↓
                  [支払い完了 → success_url にリダイレクト]
                          ↓
                  [Webhook: checkout.session.completed]
                          ↓
                  [subscriptions テーブル更新 (status: 'active')]
```

### 7.2 Webhook イベント処理

| イベント | 処理 |
|---|---|
| `checkout.session.completed` | subscriptions を `active` に更新 |
| `invoice.payment_succeeded` | `current_period_end` を更新 |
| `invoice.payment_failed` | status を `past_due` に更新 |
| `customer.subscription.deleted` | status を `canceled`、plan を `free` に更新 |
| `customer.subscription.updated` | `cancel_at_period_end` を同期 |

### 7.3 Free制限ロジック

```typescript
// 日記作成時の制限チェック
async function canCreateEntry(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  if (sub.plan === 'pro') return true;

  const profile = await getProfile(userId);
  return profile.free_entries_used < 10;
}

// AI分析の制限チェック
async function canAnalyze(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  if (sub.plan === 'pro') return true;

  const profile = await getProfile(userId);
  return profile.free_analyses_used < 5;
}

// 月初リセット（Supabase Edge Function / cron）
// 毎月1日 00:00 JST に実行
async function resetMonthlyLimits() {
  await supabase
    .from('profiles')
    .update({ free_entries_used: 0, free_analyses_used: 0 })
    .neq('id', null); // 全ユーザー
}
```

---

## 8. ディレクトリ構成（想定）

```
ai-journal/
├── public/
│   ├── og-image.png
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx              # ルートレイアウト
│   │   ├── page.tsx                # LP (/)
│   │   ├── auth/
│   │   │   └── page.tsx            # 認証
│   │   ├── dashboard/
│   │   │   └── page.tsx            # ダッシュボード
│   │   ├── entries/
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # 日記作成
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # 日記詳細
│   │   │       └── edit/
│   │   │           └── page.tsx    # 日記編集
│   │   ├── calendar/
│   │   │   └── page.tsx            # カレンダー
│   │   ├── analytics/
│   │   │   └── page.tsx            # 感情アナリティクス
│   │   ├── reports/
│   │   │   └── [yearMonth]/
│   │   │       └── page.tsx        # 月間レポート
│   │   ├── settings/
│   │   │   └── page.tsx            # 設定
│   │   ├── pricing/
│   │   │   └── page.tsx            # 料金プラン
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts        # AI感情分析 API
│   │       ├── reports/
│   │       │   └── generate/
│   │       │       └── route.ts    # 月間レポート生成 API
│   │       └── stripe/
│   │           ├── checkout/
│   │           │   └── route.ts    # Checkout Session作成
│   │           └── webhook/
│   │               └── route.ts    # Stripe Webhook
│   ├── components/
│   │   ├── ui/                     # 共通UIコンポーネント
│   │   ├── layout/                 # Header, Nav, Footer
│   │   ├── journal/                # 日記関連コンポーネント
│   │   ├── charts/                 # Rechartsラッパー
│   │   └── auth/                   # 認証関連コンポーネント
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # ブラウザ用クライアント
│   │   │   ├── server.ts           # サーバー用クライアント
│   │   │   └── middleware.ts       # 認証ミドルウェア
│   │   ├── stripe.ts               # Stripe設定
│   │   ├── claude.ts               # Claude API呼び出し
│   │   └── utils.ts                # ユーティリティ
│   ├── hooks/                      # カスタムフック
│   ├── types/                      # TypeScript型定義
│   └── middleware.ts               # Next.js ミドルウェア（認証ガード）
├── supabase/
│   ├── migrations/                 # DBマイグレーション
│   ├── functions/                  # Edge Functions（cronなど）
│   └── seed.sql                    # テストデータ
├── .env.local                      # 環境変数
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 9. 環境変数

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 10. 開発フェーズ（推奨順序）

### Phase 1: 基盤構築

1. Next.js + TypeScript + Tailwind CSS プロジェクト初期化
2. Supabase プロジェクト作成 + DB マイグレーション実行
3. 認証機能（メール + OAuth）
4. 共通レイアウト + ナビゲーション

### Phase 2: コア機能

5. 日記 CRUD（作成・閲覧・編集・削除）
6. カレンダービュー
7. ストリーク機能
8. ダッシュボード

### Phase 3: AI統合

9. Claude API 感情分析の実装
10. 分析結果の保存・表示
11. 感情アナリティクス画面（Recharts）

### Phase 4: 収益化

12. Stripe 統合（Checkout + Webhook）
13. Free/Pro 制限ロジック
14. 料金プランページ

### Phase 5: 高度な機能

15. 月間レポート生成
16. リマインダー通知
17. データエクスポート

### Phase 6: 公開準備

18. ランディングページ
19. SEO + OGP設定
20. README.md 作成
21. Vercel デプロイ + カスタムドメイン

---

## 11. ポートフォリオとしての評価ポイント

| 評価軸 | 本プロダクトでの実現 |
|---|---|
| クリーンなコード | TypeScript 厳格モード、ESLint + Prettier |
| テスト | Jest + React Testing Library（主要フローのテスト） |
| CI/CD | GitHub Actions（lint + test + 自動デプロイ） |
| README | スクショ付き、セットアップ手順、アーキテクチャ図 |
| AI API統合 | Claude API を活用した感情分析・レポート生成 |
| OAuth | Google / GitHub ソーシャルログイン |
| 外部API連携 | Stripe 決済統合 |
| クラウドデプロイ | Vercel + Supabase（本番環境） |
| セキュリティ | RLS、環境変数管理、Webhook署名検証 |
