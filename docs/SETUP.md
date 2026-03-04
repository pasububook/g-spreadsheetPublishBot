# セットアップガイド

## 前提条件

- Google アカウント
- 対象の Google スプレッドシートへの編集権限
- Google Chat スペースの Incoming Webhook 設定済み（通知が不要な場合は省略可）

---

## 手順

### 1. Apps Script プロジェクトの作成

1. 対象のスプレッドシートを開く
2. メニューバーの **拡張機能 > Apps Script** を選択
3. 新しい Apps Script プロジェクトが開く

### 2. スクリプトファイルの配置

本リポジトリに存在する全ての `.gs` ファイルおよび `html/` フォルダ内のファイルを Apps Script プロジェクトへ配置します。

```
src/
  main.gs
  auto_setup.gs
  config.gs
  export_pdf.gs
  notice.gs
  print.gs
  create_folder.gs
  delete_branch_sheet.gs
  html/
    changesInput.html
    chatPreview.html
```

**配置方法（手動コピー）:**

1. Apps Script エディタの左側ファイル一覧で「+」をクリックし、スクリプト/HTML を新規追加
2. 各ファイルと同一のファイル名を付ける
3. 対応するファイルの内容をそのまま貼り付けて保存

> **注意:** `appsscript.json` はマニフェストです。Apps Script エディタの **プロジェクトの設定 > 「appsscript.json」マニフェスト ファイルをエディタで表示する** を有効化してから内容を上書きしてください。

### 3. config.gs の編集

`src/config.gs` を環境に合わせて編集します。

```js
// ドキュメントデータ
const docTitle = "任意のシート名"     // メインシートのタイトル
const isShowCheckbox = false          // チェックボックス列を表示する場合は true

// 教科データ（必要に応じて追加・変更）
const subjectData = {
  "国語": ["現代文", "古典"],
  ...
};
```

### 4. スクリプトプロパティの設定

Apps Script エディタのメニューから **プロジェクトの設定 > スクリプト プロパティ** を開き、以下を登録します。

| プロパティ名 | 値 | 必須 |
|---|---|---|
| `GOOGLE_CHAT_WEBHOOK_URL` | Google Chat の Incoming Webhook URL | 任意 |
| `PARENT_FOLDER_ID` | PDF を保存する Google Drive フォルダの ID | 任意 |

> `PARENT_FOLDER_ID` を省略した場合は、スプレッドシートと同じ親フォルダに保存されます。

#### Google Drive フォルダ ID の確認方法

Google Drive でフォルダを開いたときの URL の末尾の文字列がフォルダ ID です。

```
https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXXXXXXXXXXX
                                       ↑ これがフォルダ ID
```

#### Google Chat Webhook URL の取得方法

1. Google Chat スペースを開く
2. スペース名 > **アプリと統合 > Webhook を管理**
3. **Incoming Webhook を追加** で名前・アイコンを設定し URL を取得

### 5. 初回セットアップの実行

Apps Script エディタで `runAutoSetup` 関数を実行します。

1. エディタ上部の関数選択から `runAutoSetup` を選択
2. **実行** ボタンをクリック
3. 必要な権限の承認ダイアログが表示された場合は承認する

実行後、スプレッドシートに以下のシートが自動作成されます。

| シート名 | 用途 |
|---|---|
| `.config` | ドキュメントメタ情報（タイトル・バージョン等） |
| `.changelog` | 変更内容の記録 |
| `.editor` | 編集者情報 |
| メインシート | ドキュメント本体（`docTitle` で指定した名前） |

### 6. 動作確認

1. スプレッドシートを再読み込みする
2. メニューバーに **出版** が表示されることを確認
3. **出版 > 変更内容を登録** でサイドバーが開くことを確認

---

## 使い方

### 変更内容の登録

1. **出版 > 変更内容を登録** を選択
2. サイドバーに教科と変更内容を入力して登録

変更内容は `.changelog` シートに蓄積され、未送信のものが次回送信時にまとめて通知されます。

### 出版（PDF 送信）

1. 対象シートをアクティブにした状態で **出版 > Google Chat に送信** を選択
2. プレビューモーダルで PDF の内容と変更一覧を確認
3. 送信ボタンをクリック

送信が完了すると以下が実行されます。

- カラー版・モノクロ版の PDF が Google Drive に保存される
- 変更内容とダウンロードリンクが Google Chat に通知される
- `.changelog` の未送信レコードが送信済みに更新される
- `.config` シートのバージョンが +1 される

---

## トラブルシューティング

### `.changelog` シートが存在しない

`runAutoSetup` を実行してシートを作成してください。

### PDF のエクスポートに失敗する

スクリプトが Google Drive / Spreadsheet へのアクセス権限を持っているか確認してください。Apps Script エディタの **プロジェクトの設定 > OAuth スコープ** に以下が含まれていることを確認します。

- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/drive`
- `https://www.googleapis.com/auth/script.external_request`

### 出版メニューが表示されない

スプレッドシートを完全に再読み込み（Ctrl+Shift+R）してください。それでも表示されない場合は `onOpen` 関数を手動実行してください。
