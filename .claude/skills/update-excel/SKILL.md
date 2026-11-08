---
name: update-excel
description: >
  How to update the project's Excel files (進捗管理.xlsx, テスト仕様書.xlsx) without breaking
  layout or fonts. Use this skill whenever you need to modify, regenerate, or append data to
  any Excel (.xlsx) file in this project — including progress tracking, test specs, or any new
  spreadsheet. Also use it when the user mentions Excel, xlsx, 進捗管理, テスト仕様書, openpyxl,
  or spreadsheet updates. Node.js xlsx libraries destroy formatting, so this skill exists to
  prevent that mistake.
---

# Excel更新ルール

このプロジェクトのExcelファイルは **openpyxl (Python)** で操作する。
Node.js の `xlsx` / `exceljs` などのライブラリは**絶対に使わない** — レイアウトが壊れ、フォントが消える。

## 実行コマンド

Windows環境で以下のように実行する:

```
py -3 -I <script.py>
```

`-I` (isolated mode) をつけることで、カレントディレクトリの意図しないモジュールを読み込まない。

---

## 進捗管理.xlsx

このファイルは `docs/generate_roadmap.py` で**全体を再生成**する方式。

### 更新手順

1. `docs/generate_roadmap.py` を読む
2. 必要な箇所を編集する（ステータス変更、新行追加、集計値更新など）
3. `py -3 -I docs/generate_roadmap.py` で再実行
4. 出力を確認: `Saved: ...進捗管理.xlsx` と表示されること

### 注意点

- スクリプトは毎回ゼロから `.xlsx` を生成する（`Workbook()` で新規作成）
- 変更は必ずスクリプトを編集して反映する — 直接Excelを開いて手で編集しない
- 集計値（完了数、進捗率など）もスクリプト内で計算しているので整合性を保つ

---

## テスト仕様書.xlsx

このファイルは `openpyxl.load_workbook()` で**既存ファイルを開いて追記**する方式。

### 更新手順

1. 追記用の Python スクリプトを作成する（例: `docs/append_test_phaseN.py`）
2. `load_workbook` で既存ファイルを開く
3. `ws.max_row` で最終行を取得し、その次の行から追記する
4. `py -3 -I docs/append_test_phaseN.py` で実行

### スクリプトテンプレート

```python
import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side

wb = openpyxl.load_workbook(r"docs\テスト仕様書.xlsx")
ws = wb["認証テスト"]

BODY = Font(name="Meiryo UI", size=10)
THIN = Border(
    left=Side(style="thin"), right=Side(style="thin"),
    top=Side(style="thin"), bottom=Side(style="thin"),
)
WRAP = Alignment(wrap_text=True, vertical="top")
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)

new_tests = [
    # (No, テスト分類, テスト項目, 手順, 期待結果, 優先度, ステータス, 備考)
    (99, "CAT-01", "テスト名",
     "1. 手順1\n2. 手順2",
     "期待される結果", "高", "未実施", ""),
]

start_row = ws.max_row + 1

for test in new_tests:
    row = start_row + (test[0] - new_tests[0][0])
    for col_idx, value in enumerate(test, 1):
        cell = ws.cell(row=row, column=col_idx, value=value)
        cell.font = BODY
        cell.border = THIN
        if col_idx in (1, 6, 7):  # No., 優先度, ステータス
            cell.alignment = CENTER
        else:
            cell.alignment = WRAP

wb.save(r"docs\テスト仕様書.xlsx")
print(f"Saved ({len(new_tests)} test cases appended)")
```

### 列構成（8列）

| 列 | 内容 | 配置 |
|----|------|------|
| A  | No.  | CENTER |
| B  | テスト分類 | WRAP |
| C  | テスト項目 | WRAP |
| D  | 手順 | WRAP |
| E  | 期待結果 | WRAP |
| F  | 優先度 | CENTER |
| G  | ステータス | CENTER |
| H  | 備考 | WRAP |

---

## フォント規約

**すべてのセルに `Font(name="Meiryo UI")` を適用する。** 例外なし。

```python
# ヘッダー
HEADER_FONT = Font(name="Meiryo UI", bold=True, size=10, color="FFFFFF")

# 本文
BODY = Font(name="Meiryo UI", size=10)

# タイトル
TITLE_FONT = Font(name="Meiryo UI", bold=True, size=14, color="2F5496")
```

## セル装飾

```python
# 罫線（全セルに適用）
THIN = Border(
    left=Side(style="thin"), right=Side(style="thin"),
    top=Side(style="thin"), bottom=Side(style="thin"),
)

# 折り返し（本文セル）
WRAP = Alignment(wrap_text=True, vertical="top")

# 中央揃え（No., 優先度, ステータス列）
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
```

---

## やってはいけないこと

- Node.js の `xlsx`, `exceljs`, `SheetJS` を使う → フォントとレイアウトが壊れる
- 進捗管理.xlsx を `load_workbook` で部分更新する → generate_roadmap.py を編集して再生成する
- フォント指定を省略する → 必ず `name="Meiryo UI"` を全セルに設定
- `py -3` の `-I` フラグを省略する → 意図しないモジュール読み込みのリスク
