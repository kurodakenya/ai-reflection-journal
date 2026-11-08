import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side, PatternFill, numbers
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

wb = openpyxl.Workbook()

# -- Styles --
HEADER_FONT = Font(name="Meiryo UI", bold=True, size=10, color="FFFFFF")
HEADER_FILL = PatternFill(start_color="2F5496", end_color="2F5496", fill_type="solid")
TITLE_FONT = Font(name="Meiryo UI", bold=True, size=14, color="2F5496")
SUBTITLE_FONT = Font(name="Meiryo UI", bold=True, size=11)
BODY = Font(name="Meiryo UI", size=10)
BODY_BOLD = Font(name="Meiryo UI", bold=True, size=10)
THIN = Border(
    left=Side(style="thin"), right=Side(style="thin"),
    top=Side(style="thin"), bottom=Side(style="thin"),
)
WRAP = Alignment(wrap_text=True, vertical="top")
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT_TOP = Alignment(vertical="top", wrap_text=True)

# Phase colors
PHASE_COLORS = {
    "Phase 1": PatternFill(start_color="D6E4F0", end_color="D6E4F0", fill_type="solid"),  # blue
    "Phase 2": PatternFill(start_color="E2EFDA", end_color="E2EFDA", fill_type="solid"),  # green
    "Phase 3": PatternFill(start_color="FCE4D6", end_color="FCE4D6", fill_type="solid"),  # orange
    "Phase 4": PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid"),  # yellow
    "Phase 5": PatternFill(start_color="E4DFEC", end_color="E4DFEC", fill_type="solid"),  # purple
    "Phase 6": PatternFill(start_color="D9D9D9", end_color="D9D9D9", fill_type="solid"),  # gray
}
STATUS_COLORS = {
    "未着手": PatternFill(start_color="F2F2F2", end_color="F2F2F2", fill_type="solid"),
    "進行中": PatternFill(start_color="BDD7EE", end_color="BDD7EE", fill_type="solid"),
    "完了": PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid"),
    "保留": PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid"),
}
PRIORITY_COLORS = {
    "高": Font(name="Meiryo UI", size=10, color="CC0000", bold=True),
    "中": Font(name="Meiryo UI", size=10, color="BF8F00", bold=True),
    "低": Font(name="Meiryo UI", size=10),
}


def write_header(ws, row, headers, widths):
    for c, (h, w) in enumerate(zip(headers, widths), 1):
        cell = ws.cell(row=row, column=c, value=h)
        cell.font = HEADER_FONT
        cell.fill = HEADER_FILL
        cell.alignment = CENTER
        cell.border = THIN
        ws.column_dimensions[get_column_letter(c)].width = w


def write_row(ws, row, values, center_cols=None, phase=None):
    for c, v in enumerate(values, 1):
        cell = ws.cell(row=row, column=c, value=v)
        cell.font = BODY
        cell.border = THIN
        if center_cols and c in center_cols:
            cell.alignment = CENTER
        else:
            cell.alignment = LEFT_TOP
        if phase and c == 1:
            cell.fill = PHASE_COLORS.get(phase, PatternFill())
            cell.font = BODY_BOLD


# ==============================
# Sheet 1: ロードマップ
# ==============================
ws1 = wb.active
ws1.title = "ロードマップ"
ws1.sheet_properties.tabColor = "2F5496"

ws1.cell(row=1, column=1, value="AI振り返りジャーナル — 開発ロードマップ").font = TITLE_FONT
ws1.merge_cells("A1:L1")
ws1.cell(row=2, column=1, value="作成日: 2026-11-06　ステータス: Phase 6 完了（デプロイ除く）").font = Font(name="Meiryo UI", size=9, color="666666")

headers = [
    "Phase", "No.", "タスク名", "カテゴリ", "説明",
    "優先度", "ステータス", "担当", "見積(h)",
    "開始予定", "完了予定", "備考"
]
widths = [10, 5, 28, 14, 40, 8, 10, 10, 9, 12, 12, 25]
write_header(ws1, 4, headers, widths)

# Freeze panes
ws1.freeze_panes = "A5"

# Data validation for status
dv_status = DataValidation(type="list", formula1='"未着手,進行中,完了,保留"', allow_blank=True)
dv_status.error = "未着手/進行中/完了/保留 から選択してください"
dv_status.errorTitle = "ステータスエラー"
ws1.add_data_validation(dv_status)

dv_priority = DataValidation(type="list", formula1='"高,中,低"', allow_blank=True)
ws1.add_data_validation(dv_priority)

# -- Roadmap data --
tasks = [
    # Phase 1: 基盤構築
    ("Phase 1", 1, "Next.js プロジェクト初期化", "環境構築",
     "Next.js 14+ (App Router) + TypeScript + Tailwind CSS のセットアップ",
     "高", "完了", "", 4, "", "", "npx create-next-app"),
    ("Phase 1", 2, "ESLint / Prettier 設定", "環境構築",
     "コード品質ツールの導入・設定ファイル作成",
     "高", "完了", "", 2, "", "", ""),
    ("Phase 1", 3, "Git リポジトリ初期化", "環境構築",
     "git init, .gitignore, 初回コミット",
     "高", "完了", "", 1, "", "", ""),
    ("Phase 1", 4, "Supabase プロジェクト作成", "環境構築",
     "Supabase ダッシュボードでプロジェクト作成・接続情報取得",
     "高", "完了", "", 2, "", "", ""),
    ("Phase 1", 5, "DB マイグレーション実行", "DB",
     "全6テーブル (profiles, journal_entries, emotion_analyses, streaks, subscriptions, monthly_reports) の作成",
     "高", "完了", "", 4, "", "", "RLS ポリシー含む"),
    ("Phase 1", 6, "DB トリガー・関数設定", "DB",
     "handle_new_user, update_updated_at トリガーの作成",
     "高", "完了", "", 2, "", "", ""),
    ("Phase 1", 7, "Supabase クライアント設定", "環境構築",
     "client.ts (ブラウザ用) / server.ts (サーバー用) の作成",
     "高", "完了", "", 2, "", "", ""),
    ("Phase 1", 8, "環境変数設定", "環境構築",
     ".env.local にSupabase/Stripe/Claude APIキーを設定",
     "高", "完了", "", 1, "", "", ""),
    ("Phase 1", 9, "認証機能 — メール+パスワード", "認証",
     "Supabase Auth によるメール認証（登録・ログイン・ログアウト）",
     "高", "完了", "", 6, "", "", "AUTH-01, AUTH-02"),
    ("Phase 1", 10, "認証機能 — OAuth", "認証",
     "Google / GitHub ソーシャルログインの設定",
     "高", "完了", "", 4, "", "", "AUTH-01"),
    ("Phase 1", 11, "パスワードリセット", "認証",
     "メールによるリセットリンク送信フロー",
     "中", "完了", "", 3, "", "", "AUTH-03"),
    ("Phase 1", 12, "認証ミドルウェア", "認証",
     "Next.js middleware.ts による認証ガード（未認証→/auth リダイレクト）",
     "高", "完了", "", 3, "", "", ""),
    ("Phase 1", 13, "共通レイアウト作成", "UI",
     "ヘッダー・ナビゲーション・モバイルボトムタブ・フッター",
     "高", "完了", "", 6, "", "", ""),

    # Phase 2: コア機能
    ("Phase 2", 14, "日記作成画面", "ジャーナル",
     "テンプレート選択・Markdownエディタ・タグ入力・日付選択・保存",
     "高", "完了", "", 8, "", "", "JOUR-01, JOUR-05, JOUR-06"),
    ("Phase 2", 15, "日記詳細画面", "ジャーナル",
     "Markdown→HTMLレンダリング・AI分析結果表示・編集/削除アクション",
     "高", "完了", "", 5, "", "", "JOUR-07"),
    ("Phase 2", 16, "日記編集画面", "ジャーナル",
     "既存エントリの編集フォーム（作成画面の再利用）",
     "高", "完了", "", 3, "", "", "JOUR-02"),
    ("Phase 2", 17, "日記削除機能", "ジャーナル",
     "確認ダイアログ付き削除処理",
     "中", "完了", "", 2, "", "", "JOUR-03"),
    ("Phase 2", 18, "カレンダービュー", "ジャーナル",
     "月間カレンダー表示・感情カラードット・日付クリック遷移・月切替",
     "高", "完了", "", 8, "", "", "JOUR-04"),
    ("Phase 2", 19, "ストリーク機能", "モチベーション",
     "連続記録日数の計算・表示・最長記録の更新ロジック",
     "中", "完了", "", 4, "", "", "MOT-01"),
    ("Phase 2", 20, "ダッシュボード画面", "UI",
     "今日のカード・ストリーク・感情ミニチャート・カレンダー・Free残数バー",
     "高", "完了", "", 8, "", "", ""),
    ("Phase 2", 21, "プロフィール設定画面", "UI",
     "表示名・アバター・タイムゾーン編集",
     "中", "完了", "", 4, "", "", "AUTH-04"),

    # Phase 3: AI統合
    ("Phase 3", 22, "Claude API クライアント実装", "AI",
     "lib/claude.ts — API呼び出し・プロンプト送信・レスポンスパース",
     "高", "完了", "", 4, "", "", ""),
    ("Phase 3", 23, "感情分析 API エンドポイント", "AI",
     "api/analyze/route.ts — 日記テキスト受付→Claude API→結果保存",
     "高", "完了", "", 6, "", "", "AI-01"),
    ("Phase 3", 24, "感情分析結果の表示", "AI",
     "保存後のモーダル/インライン表示・レーダーチャート（Recharts）",
     "高", "完了", "", 5, "", "", "AI-01"),
    ("Phase 3", 25, "AIフィードバック表示", "AI",
     "Pro向け：1エントリごとの短いコメント表示",
     "低", "保留", "", 3, "", "", "AI-02 / プレースホルダー対応"),
    ("Phase 3", 26, "感情アナリティクス画面", "AI",
     "期間切替・折れ線チャート・バーチャート・円グラフ（Recharts）",
     "低", "保留", "", 10, "", "", "AI-04 / プレースホルダー対応"),

    # Phase 4: 収益化
    ("Phase 4", 27, "Stripe 初期設定", "課金",
     "Stripe アカウント設定・商品/価格作成・lib/stripe.ts",
     "高", "完了", "", 3, "", "", ""),
    ("Phase 4", 28, "Checkout Session API", "課金",
     "api/stripe/checkout/route.ts — Stripe Checkout セッション作成",
     "高", "完了", "", 4, "", "", "PAY-01"),
    ("Phase 4", 29, "Stripe Webhook 処理", "課金",
     "api/stripe/webhook/route.ts — 5イベントの処理・署名検証",
     "高", "完了", "", 6, "", "", "PAY-02"),
    ("Phase 4", 30, "請求ポータル連携", "課金",
     "Stripeカスタマーポータルへのリダイレクト",
     "中", "完了", "", 2, "", "", "PAY-03"),
    ("Phase 4", 31, "Free/Pro 制限ロジック", "課金",
     "日記作成10件/月・AI分析5件/月のカウント・判定・月初リセット",
     "高", "完了", "", 5, "", "", "PAY-04"),
    ("Phase 4", 32, "料金プランページ", "UI",
     "Free/Pro比較カード・アップグレードCTA・FAQ",
     "高", "完了", "", 5, "", "", ""),

    # Phase 5: 高度な機能
    ("Phase 5", 33, "月間レポート生成", "AI",
     "api/reports/generate/route.ts — 月初cron・AIナラティブ生成・保存",
     "中", "完了", "", 8, "", "", "AI-03"),
    ("Phase 5", 34, "月間レポート画面", "UI",
     "AIサマリー文・感情ハイライト・統計・過去レポート一覧",
     "中", "完了", "", 6, "", "", ""),
    ("Phase 5", 35, "リマインダー通知", "モチベーション",
     "毎日の記入リマインド（時間指定可）— 設定画面から時間指定",
     "低", "完了", "", 6, "", "", "MOT-02"),
    ("Phase 5", 36, "データエクスポート", "データ管理",
     "JSON / CSV形式でのダウンロード機能（Pro専用）",
     "低", "完了", "", 4, "", "", "DATA-01"),
    ("Phase 5", 37, "アカウント削除", "データ管理",
     "確認ダイアログ付き全データ完全削除",
     "中", "完了", "", 3, "", "", "DATA-02"),

    # Phase 6: 公開準備
    ("Phase 6", 38, "ランディングページ", "UI",
     "ヒーロー・機能紹介・料金比較・FAQ・フッター（SSG配信）",
     "高", "完了", "", 8, "", "", ""),
    ("Phase 6", 39, "SEO / OGP 設定", "公開準備",
     "メタタグ・OGP画像・sitemap.xml・robots.txt",
     "中", "完了", "", 3, "", "", ""),
    ("Phase 6", 40, "テスト作成・実行", "品質",
     "Vitest + React Testing Library — LP・subscription・export のユニットテスト",
     "高", "完了", "", 12, "", "", "16テスト通過"),
    ("Phase 6", 41, "CI/CD パイプライン", "公開準備",
     "GitHub Actions — lint + format:check + test + build",
     "高", "完了", "", 4, "", "", ""),
    ("Phase 6", 42, "README.md 作成", "公開準備",
     "機能一覧・技術スタック・アーキテクチャ・セットアップ手順・プラン比較",
     "中", "完了", "", 4, "", "", ""),
    ("Phase 6", 43, "Vercel デプロイ", "公開準備",
     "本番デプロイ・環境変数設定・カスタムドメイン",
     "高", "未着手", "", 3, "", "", ""),
    ("Phase 6", 44, "GitHub リポジトリ公開", "公開準備",
     "ライセンス (MIT)・Description・トピック設定",
     "高", "完了", "", 1, "", "", "gh CLI未導入のためdescription/topics手動設定"),
]

r = 5
for t in tasks:
    write_row(ws1, r, t, center_cols={1, 2, 6, 7, 8, 9, 10, 11}, phase=t[0])
    # Apply data validation
    dv_status.add(ws1.cell(row=r, column=7))
    dv_priority.add(ws1.cell(row=r, column=6))
    r += 1

# -- Summary section --
r += 1
summary_start = r
ws1.cell(row=r, column=1, value="サマリー").font = SUBTITLE_FONT
r += 1

data_start = 5
data_end = data_start + len(tasks) - 1

summary_items = [
    ("総タスク数", f'=COUNTA(C{data_start}:C{data_end})'),
    ("総見積工数 (h)", f'=SUM(I{data_start}:I{data_end})'),
    ("未着手", f'=COUNTIF(G{data_start}:G{data_end},"未着手")'),
    ("進行中", f'=COUNTIF(G{data_start}:G{data_end},"進行中")'),
    ("完了", f'=COUNTIF(G{data_start}:G{data_end},"完了")'),
    ("保留", f'=COUNTIF(G{data_start}:G{data_end},"保留")'),
    ("進捗率", f'=IFERROR(COUNTIF(G{data_start}:G{data_end},"完了")/COUNTA(C{data_start}:C{data_end}),0)'),
]

for label, formula in summary_items:
    ws1.cell(row=r, column=1, value=label).font = BODY_BOLD
    ws1.cell(row=r, column=1).border = THIN
    ws1.cell(row=r, column=1).fill = PatternFill(start_color="D6E4F0", end_color="D6E4F0", fill_type="solid")
    cell = ws1.cell(row=r, column=2, value=formula)
    cell.font = BODY_BOLD
    cell.border = THIN
    cell.alignment = CENTER
    if label == "進捗率":
        cell.number_format = '0.0%'
    r += 1

# Phase summary
r += 1
ws1.cell(row=r, column=1, value="Phase別サマリー").font = SUBTITLE_FONT
r += 1

phase_headers = ["Phase", "フェーズ名", "タスク数", "見積(h)", "完了数", "Phase進捗率"]
phase_widths_dummy = [10, 14, 10, 10, 10, 12]
for c, (h, _) in enumerate(zip(phase_headers, phase_widths_dummy), 1):
    cell = ws1.cell(row=r, column=c, value=h)
    cell.font = HEADER_FONT
    cell.fill = HEADER_FILL
    cell.alignment = CENTER
    cell.border = THIN
r += 1

phase_info = [
    ("Phase 1", "基盤構築"),
    ("Phase 2", "コア機能"),
    ("Phase 3", "AI統合"),
    ("Phase 4", "収益化"),
    ("Phase 5", "高度な機能"),
    ("Phase 6", "公開準備"),
]
for phase, name in phase_info:
    ws1.cell(row=r, column=1, value=phase).font = BODY_BOLD
    ws1.cell(row=r, column=1).border = THIN
    ws1.cell(row=r, column=1).fill = PHASE_COLORS[phase]
    ws1.cell(row=r, column=2, value=name).font = BODY
    ws1.cell(row=r, column=2).border = THIN
    # Task count per phase
    ws1.cell(row=r, column=3, value=f'=COUNTIF(A{data_start}:A{data_end},"{phase}")').font = BODY
    ws1.cell(row=r, column=3).border = THIN
    ws1.cell(row=r, column=3).alignment = CENTER
    # Hours per phase
    ws1.cell(row=r, column=4, value=f'=SUMIF(A{data_start}:A{data_end},"{phase}",I{data_start}:I{data_end})').font = BODY
    ws1.cell(row=r, column=4).border = THIN
    ws1.cell(row=r, column=4).alignment = CENTER
    # Completed per phase
    ws1.cell(row=r, column=5, value=f'=COUNTIFS(A{data_start}:A{data_end},"{phase}",G{data_start}:G{data_end},"完了")').font = BODY
    ws1.cell(row=r, column=5).border = THIN
    ws1.cell(row=r, column=5).alignment = CENTER
    # Progress per phase
    cell = ws1.cell(row=r, column=6,
        value=f'=IFERROR(COUNTIFS(A{data_start}:A{data_end},"{phase}",G{data_start}:G{data_end},"完了")/COUNTIF(A{data_start}:A{data_end},"{phase}"),0)')
    cell.font = BODY_BOLD
    cell.border = THIN
    cell.alignment = CENTER
    cell.number_format = '0.0%'
    r += 1


# ==============================
# Sheet 2: マイルストーン
# ==============================
ws2 = wb.create_sheet("マイルストーン")
ws2.sheet_properties.tabColor = "00B050"

ws2.cell(row=1, column=1, value="マイルストーン").font = TITLE_FONT

headers = ["#", "マイルストーン", "対応Phase", "完了条件", "ステータス", "目標日", "備考"]
widths = [5, 25, 12, 45, 10, 12, 25]
write_header(ws2, 3, headers, widths)

ws2.freeze_panes = "A4"

dv_ms_status = DataValidation(type="list", formula1='"未着手,進行中,完了"', allow_blank=True)
ws2.add_data_validation(dv_ms_status)

milestones = [
    (1, "開発環境構築完了", "Phase 1",
     "Next.js + Supabase + 認証が動作する状態", "完了", "", ""),
    (2, "認証・レイアウト完了", "Phase 1",
     "メール/OAuth認証・共通レイアウト・ナビゲーション完成", "完了", "", ""),
    (3, "日記CRUD完了", "Phase 2",
     "日記の作成・閲覧・編集・削除が一通り動作", "完了", "", ""),
    (4, "ダッシュボード完成", "Phase 2",
     "カレンダー・ストリーク・ダッシュボードが表示される", "完了", "", ""),
    (5, "AI感情分析動作", "Phase 3",
     "日記保存→Claude API→感情スコア保存・グラフ表示", "完了", "", ""),
    (6, "アナリティクス画面完成", "Phase 3",
     "感情推移・エネルギー・分布の各チャートが表示される", "未着手", "", ""),
    (7, "決済フロー完成", "Phase 4",
     "Stripe Checkout→Webhook→Pro有効化の一連が動作", "完了", "", ""),
    (8, "Free/Pro制限動作", "Phase 4",
     "Free制限（日記10件/分析5件）とPro無制限が正しく判定される", "完了", "", ""),
    (9, "高度機能完成", "Phase 5",
     "月間レポート・リマインダー・エクスポート・アカウント削除", "完了", "", ""),
    (10, "LP・公開準備完了", "Phase 6",
     "ランディングページ・SEO/OGP・README完成", "完了", "", ""),
    (11, "テスト・CI/CD完了", "Phase 6",
     "主要フローのテスト通過・GitHub Actions動作確認", "完了", "", ""),
    (12, "本番デプロイ・GitHub公開", "Phase 6",
     "Vercelデプロイ完了・GitHubリポジトリ公開", "未着手", "", "デプロイ待ち"),
]

r = 4
for ms in milestones:
    write_row(ws2, r, ms, center_cols={1, 3, 5, 6})
    dv_ms_status.add(ws2.cell(row=r, column=5))
    r += 1


# ==============================
# Sheet 3: 変更履歴
# ==============================
ws3 = wb.create_sheet("変更履歴")
ws3.sheet_properties.tabColor = "808080"

ws3.cell(row=1, column=1, value="変更履歴").font = TITLE_FONT

headers = ["日付", "変更内容", "変更者", "備考"]
widths = [14, 50, 12, 30]
write_header(ws3, 3, headers, widths)

ws3.freeze_panes = "A4"

write_row(ws3, 4, ("2026-11-06", "ロードマップ初版作成（Phase 1〜6, 全44タスク）", "", "仕様書ベース"), center_cols={1, 3})
write_row(ws3, 5, ("2026-11-07", "Phase 1 全完了（No.1〜13）、Phase 2 No.14〜17 完了", "", "日記CRUD実装"), center_cols={1, 3})
write_row(ws3, 6, ("2026-11-07", "Phase 2 全完了（No.18〜21）カレンダー・ストリーク・ダッシュボード・設定画面", "", "Phase 2 完了"), center_cols={1, 3})
write_row(ws3, 7, ("2026-11-07", "Phase 3 No.22〜24 完了（Claude API連携・感情分析・レーダーチャート）、No.25-26 保留", "", "AI感情分析実装"), center_cols={1, 3})
write_row(ws3, 8, ("2026-11-07", "Phase 4 全完了（No.27〜32）Stripe決済・Webhook・請求ポータル・制限ロジック・料金プランページ", "", "収益化機能実装"), center_cols={1, 3})
write_row(ws3, 9, ("2026-11-08", "Phase 5 全完了（No.33〜37）月間レポート生成・レポート画面・リマインダー通知・データエクスポート・アカウント削除", "", "高度な機能実装"), center_cols={1, 3})
write_row(ws3, 10, ("2026-11-08", "Phase 6 完了（No.38〜42,44）LP・SEO/OGP・Vitest・CI/CD・README・LICENSE（No.43 Vercelデプロイ除く）", "", "公開準備"), center_cols={1, 3})


# ==============================
# Save
# ==============================
output = r"C:\sorce\AI-Reflection-Journal\docs\進捗管理.xlsx"
wb.save(output)
print(f"Saved: {output}")
