import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side, PatternFill

wb = openpyxl.load_workbook(r"C:\sorce\AI-Reflection-Journal\docs\テスト仕様書.xlsx")
ws = wb["認証テスト"]

# -- Styles (match existing) --
BODY = Font(name="Meiryo UI", size=10)
THIN = Border(
    left=Side(style="thin"), right=Side(style="thin"),
    top=Side(style="thin"), bottom=Side(style="thin"),
)
WRAP = Alignment(wrap_text=True, vertical="top")
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)

new_tests = [
    # 月間レポート生成 (AI-03)
    (73, "AI-03", "月間レポートAPI - 正常系",
     "1. Pro会員でログイン\n2. /api/reports/generate に yearMonth: \"YYYY-MM\" でPOST",
     "monthly_reportsにレコードが保存される", "高", "未実施", "有料API"),
    (74, "AI-03", "月間レポートAPI - Free制限",
     "1. Free会員でログイン\n2. /api/reports/generate にPOST",
     "403エラー「Proプラン専用」が返される", "高", "未実施", ""),
    (75, "AI-03", "月間レポートAPI - 重複防止",
     "1. 既にレポート生成済みの月を指定してPOST",
     "409エラー「既に生成済み」が返される", "中", "未実施", ""),
    (76, "AI-03", "月間レポートAPI - 日記なし",
     "1. 日記が0件の月を指定してPOST",
     "400エラー「日記がありません」が返される", "中", "未実施", ""),
    (77, "AI-03", "月間レポートAPI - 不正yearMonth",
     "1. 不正な形式のyearMonthでPOST",
     "400エラー「YYYY-MM形式が必要」が返される", "中", "未実施", ""),

    # 月間レポート画面
    (78, "AI-03", "レポート画面 - Pro表示",
     "1. Pro会員でログイン\n2. /reports にアクセス",
     "レポート一覧とレポート生成ボタンが表示される", "高", "未実施", ""),
    (79, "AI-03", "レポート画面 - Free表示",
     "1. Free会員でログイン\n2. /reports にアクセス",
     "Proプラン専用の案内とアップグレードリンクが表示", "高", "未実施", ""),
    (80, "AI-03", "レポート画面 - レポート内容",
     "1. 生成済みレポートがある状態で /reports にアクセス",
     "年月・ナラティブ・ハイライト・主要感情・日記件数が表示", "高", "未実施", ""),

    # リマインダー通知 (MOT-02)
    (81, "MOT-02", "リマインダー設定取得",
     "1. GET /api/reminders",
     "enabled/timeのデフォルト値が返される", "高", "未実施", ""),
    (82, "MOT-02", "リマインダー設定更新",
     "1. PUT /api/reminders に enabled: true, time: \"20:00:00\" を送信",
     "profilesテーブルが更新される", "高", "未実施", ""),
    (83, "MOT-02", "リマインダーUI - トグル",
     "1. 設定画面のリマインダーセクションでトグルをON",
     "通知時間入力欄が表示される", "中", "未実施", ""),
    (84, "MOT-02", "リマインダーUI - 時間設定",
     "1. トグルON\n2. 時間を変更\n3. 保存ボタンクリック",
     "「保存しました」メッセージが表示される", "中", "未実施", ""),

    # データエクスポート (DATA-01)
    (85, "DATA-01", "JSONエクスポート",
     "1. Pro会員でログイン\n2. GET /api/export?format=json",
     "JSON形式の日記データがダウンロードされる", "高", "未実施", ""),
    (86, "DATA-01", "CSVエクスポート",
     "1. Pro会員でログイン\n2. GET /api/export?format=csv",
     "CSV形式（BOM付きUTF-8）でダウンロードされる", "高", "未実施", ""),
    (87, "DATA-01", "エクスポート - Free制限",
     "1. Free会員でGET /api/export",
     "403エラー「Proプラン専用」が返される", "高", "未実施", ""),
    (88, "DATA-01", "エクスポート - 感情分析含む",
     "1. 分析済みの日記がある状態でエクスポート",
     "感情スコアとフィードバックがデータに含まれる", "中", "未実施", ""),
    (89, "DATA-01", "エクスポートUI",
     "1. 設定画面のデータエクスポートセクションを確認",
     "JSON/CSVボタンが表示される（Pro）またはPro専用表示（Free）", "中", "未実施", ""),

    # アカウント削除 (DATA-02)
    (90, "DATA-02", "アカウント削除API",
     "1. DELETE /api/account",
     "profilesが削除され、CASCADEで全関連データも削除される", "高", "未実施", ""),
    (91, "DATA-02", "アカウント削除UI - 確認ダイアログ",
     "1. 設定画面「アカウントを削除」ボタンをクリック",
     "確認入力欄が表示される", "高", "未実施", ""),
    (92, "DATA-02", "アカウント削除UI - 確認テキスト一致",
     "1. 確認入力欄に「削除する」と入力\n2. 「完全に削除する」をクリック",
     "アカウントが削除され /auth にリダイレクト", "高", "未実施", ""),
    (93, "DATA-02", "アカウント削除UI - テキスト不一致",
     "1. 確認入力欄に異なるテキストを入力",
     "削除ボタンが無効（disabled）のまま", "中", "未実施", ""),
    (94, "DATA-02", "アカウント削除UI - キャンセル",
     "1. 確認ダイアログで「キャンセル」をクリック",
     "確認ダイアログが閉じ、元の状態に戻る", "中", "未実施", ""),
]

# Find the next empty row
start_row = ws.max_row + 1

for test in new_tests:
    row = start_row + (test[0] - 73)  # offset from first new test number
    for col_idx, value in enumerate(test, 1):
        cell = ws.cell(row=row, column=col_idx, value=value)
        cell.font = BODY
        cell.border = THIN
        if col_idx in (1, 6, 7):  # No., 優先度, ステータス
            cell.alignment = CENTER
        else:
            cell.alignment = WRAP

output = r"C:\sorce\AI-Reflection-Journal\docs\テスト仕様書.xlsx"
wb.save(output)
print(f"Saved: {output} ({len(new_tests)} test cases appended)")
