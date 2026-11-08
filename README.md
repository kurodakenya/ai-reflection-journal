# AI振り返りジャーナル

日記を書くだけでAIが感情を自動分析し、自己理解と習慣化を支援するジャーナルアプリです。

## 主な機能

| 機能 | 説明 |
|------|------|
| 日記CRUD | テンプレート選択・Markdownエディタ・タグ管理 |
| カレンダービュー | 月間カレンダーに感情カラードット表示 |
| AI感情分析 | Claude APIで8つの感情軸をスコアリング＆レーダーチャート表示 |
| 月間レポート | AIが1ヶ月分の日記を総括（Pro） |
| ストリーク | 連続記録日数・リマインダー通知 |
| データエクスポート | JSON / CSV形式でダウンロード（Pro） |
| 収益化 | Stripe決済によるFree/Proプラン |
| アカウント削除 | 全データ完全削除（CASCADE） |
| データ暗号化 | 日記本文・表示名・AIフィードバックをAES-256-GCMで暗号化 |

## 技術スタック

```
Frontend:  Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS v4
Backend:   Next.js API Routes (Route Handlers)
Database:  Supabase (PostgreSQL + RLS + Auth)
AI:        Claude API (Anthropic)
Payment:   Stripe (Checkout + Webhook + Customer Portal)
Testing:   Vitest + React Testing Library
CI/CD:     GitHub Actions
```

## アーキテクチャ

```
src/
├── app/
│   ├── page.tsx                  # ランディングページ
│   ├── auth/                     # 認証（ログイン/登録）
│   ├── (protected)/              # 認証必須ルート
│   │   ├── dashboard/            # ダッシュボード
│   │   ├── journal/              # 日記 CRUD
│   │   ├── calendar/             # カレンダービュー
│   │   ├── reports/              # 月間レポート
│   │   └── settings/             # プロフィール・リマインダー・エクスポート・削除
│   └── api/
│       ├── analyze/              # AI感情分析
│       ├── reports/generate/     # 月間レポート生成
│       ├── reminders/            # リマインダー設定
│       ├── export/               # データエクスポート
│       ├── account/              # アカウント削除
│       └── stripe/               # Checkout・Webhook・Portal
├── components/
│   ├── layout/                   # Header・Sidebar・MobileNav
│   ├── journal/                  # 日記エディタ・カード
│   └── settings/                 # リマインダー・エクスポート・削除
└── lib/
    ├── supabase/                 # Supabaseクライアント（client/server）
    ├── stripe.ts                 # Stripe設定・プラン定義
    ├── claude.ts                 # Claude API連携
    ├── encryption.ts             # AES-256-GCM暗号化/復号
    └── subscription.ts           # Free/Pro判定・利用制限
```

## セットアップ

### 前提条件

- Node.js 20+
- npm
- Supabase プロジェクト
- Stripe アカウント（テストモード）
- Anthropic API キー

### インストール

```bash
git clone https://github.com/kurodakenya/ai-reflection-journal.git
cd ai-reflection-journal
npm install
```

### 環境変数

`.env.local` を作成:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

ANTHROPIC_API_KEY=your_anthropic_api_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=your_pro_price_id

NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 個人情報暗号化（AES-256-GCM）
ENCRYPTION_KEY=your_64char_hex_key
```

`ENCRYPTION_KEY` は以下のコマンドで生成できます:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### DBマイグレーション

`supabase/migrations/` 内のSQLファイルをSupabaseダッシュボードのSQL Editorで順番に実行:

1. `001_create_tables.sql` — テーブル・RLS作成
2. `002_create_triggers.sql` — トリガー関数
3. `003_add_stripe_fields.sql` — Stripe関連カラム
4. `004_add_reminder_settings.sql` — リマインダー設定カラム

### 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアクセス。

### テスト

```bash
npm test
```

## Free / Pro プラン

| | Free | Pro (¥980/月) |
|---|---|---|
| 日記作成 | 月10件 | 無制限 |
| AI感情分析 | 月5回 | 無制限 |
| 月間レポート | - | ○ |
| データエクスポート | - | ○ |
| カレンダー・ストリーク | ○ | ○ |

## ライセンス

MIT
