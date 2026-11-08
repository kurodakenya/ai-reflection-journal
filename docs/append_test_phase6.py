import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side

wb = openpyxl.load_workbook(r"C:\sorce\AI-Reflection-Journal\docs\テスト仕様書.xlsx")
ws = wb["認証テスト"]

BODY = Font(name="Meiryo UI", size=10)
THIN = Border(
    left=Side(style="thin"), right=Side(style="thin"),
    top=Side(style="thin"), bottom=Side(style="thin"),
)
WRAP = Alignment(wrap_text=True, vertical="top")
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)

new_tests = [
    # ランディングページ (UI-LP)
    (95, "UI-LP", "LP - ヒーローセクション",
     "1. / にアクセス",
     "ヒーロー見出し・サブテキスト・CTAボタンが表示される", "高", "未実施", ""),
    (96, "UI-LP", "LP - 機能紹介セクション",
     "1. / にアクセス\n2. #features までスクロール",
     "6つの機能カードが表示される", "中", "未実施", ""),
    (97, "UI-LP", "LP - 料金プランセクション",
     "1. / にアクセス\n2. #pricing までスクロール",
     "Free/Proプラン比較カードが表示、Proに「おすすめ」バッジ", "高", "未実施", ""),
    (98, "UI-LP", "LP - FAQセクション",
     "1. FAQ項目をクリック",
     "アコーディオンが開閉し回答が表示される", "中", "未実施", ""),
    (99, "UI-LP", "LP - フッター",
     "1. ページ最下部を確認",
     "ナビリンク・コピーライトが表示される", "低", "未実施", ""),

    # SEO / OGP (SEO-01)
    (100, "SEO-01", "メタデータ - タイトル",
     "1. / のHTMLソースを確認",
     "<title>にサイト名と説明が含まれる", "高", "未実施", ""),
    (101, "SEO-01", "メタデータ - OGPタグ",
     "1. / のHTMLソースを確認",
     "og:title, og:description, og:image, twitter:card が設定されている", "高", "未実施", ""),
    (102, "SEO-01", "sitemap.xml",
     "1. /sitemap.xml にアクセス",
     "XML形式のサイトマップが返される", "中", "未実施", ""),
    (103, "SEO-01", "robots.txt",
     "1. /robots.txt にアクセス",
     "robots.txtが返され、/api/等が disallow されている", "中", "未実施", ""),

    # テスト (TEST-01)
    (104, "TEST-01", "Vitest - テスト実行",
     "1. npm test を実行",
     "全テストがパスする（exit code 0）", "高", "未実施", ""),
    (105, "TEST-01", "Vitest - LP レンダリング",
     "1. landing-page.test.tsx を実行",
     "ヒーロー・CTA・機能カード・料金・FAQ・フッターの各テストがパス", "高", "未実施", ""),
    (106, "TEST-01", "Vitest - subscription判定",
     "1. subscription.test.ts を実行",
     "free/pro判定の3ケースがパス", "高", "未実施", ""),
    (107, "TEST-01", "Vitest - CSVエスケープ",
     "1. export-helpers.test.ts を実行",
     "カンマ・ダブルクォート・改行のエスケープが正しい", "中", "未実施", ""),

    # CI/CD (CI-01)
    (108, "CI-01", "GitHub Actions - ワークフロー存在",
     "1. .github/workflows/ci.yml を確認",
     "lint, format:check, test, build の各ステップが定義されている", "高", "未実施", ""),
    (109, "CI-01", "GitHub Actions - push時実行",
     "1. masterブランチにpush",
     "CIワークフローが自動実行される", "高", "未実施", ""),

    # ドキュメント (DOC-01)
    (110, "DOC-01", "README.md - 内容確認",
     "1. README.md を確認",
     "機能一覧・技術スタック・アーキテクチャ・セットアップ手順が記載", "高", "未実施", ""),
    (111, "DOC-01", "LICENSE - 内容確認",
     "1. LICENSE を確認",
     "MIT License が記載されている", "中", "未実施", ""),
]

start_row = ws.max_row + 1

for test in new_tests:
    row = start_row + (test[0] - new_tests[0][0])
    for col_idx, value in enumerate(test, 1):
        cell = ws.cell(row=row, column=col_idx, value=value)
        cell.font = BODY
        cell.border = THIN
        if col_idx in (1, 6, 7):
            cell.alignment = CENTER
        else:
            cell.alignment = WRAP

output = r"C:\sorce\AI-Reflection-Journal\docs\テスト仕様書.xlsx"
wb.save(output)
print(f"Saved: {output} ({len(new_tests)} test cases appended)")
