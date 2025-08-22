# g-spreadsheetPublishBot
Google Spreadsheet のシートを PDF にエクスポートし、 Webhook 経由で送信します

## セットアップ
### 1. スプレッドシートの `拡張機能` の `Apps Script` でプロジェクトの作成
### 2. PDF保存用フォルダの作成
Google Drive 上に、エクスポートされたPDFを保存するためのフォルダを作成します。作成したフォルダを起点に以下のような構成でファイルが保存されます。

#### フォルダ構成例
```
${root folder name}/
　├ ${yyyyMMdd_hhmm}/
　│　└ ${sheet name} - ${yyyyMMdd_hhmmss}.pdf
　│　└ [print]${sheet name} - ${yyyyMMdd_hhmmss}.pdf
```
※ `[print]` がついたPDFはモノクロバージョンです。

#### 例
```
pdf/
　├ 20250822_2214/
　│　└ テスト - 20250822_221411.pdf
　│　└ [print]テスト - 20250822_221411.pdf
　├ 20250822_2234/
　│　└ テスト - 20250822_223412.pdf
　│　└ [print]テスト - 20250822_223412.pdf
　└ ...
```

### 3. スクリプトプロパティの設定
以下のプロパティを設定します。
- `GOOGLE_CHAT_WEBHOOK_URL`: Google Chat の Webhook のURL
- `PARENT_FOLDER_ID`: エクスポートされたPDFのフォルダが保存されるフォルダのID

### 4. プログラムの配置
本レポジトリに存在する全ての `.gs` ファイルをコピーし、Apps Scriptのプロジェクト内に同一ファイル名で貼り付け、保存します。
