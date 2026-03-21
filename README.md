# g-spreadsheetPublishBot

Google Spreadsheet のシートを PDF にエクスポートし、Google Chat Webhook 経由で通知・配布するための Google Apps Script プロジェクトです。

## 概要

スプレッドシートに「出版」メニューを追加し、変更内容の記録から PDF 生成・Google Chat への通知までをワンクリックで実行できます。  
カラー版とモノクロ印刷用の PDF を同時に生成し、Google Drive に自動保存します。

## 主な機能

- **変更内容の記録** — サイドバーから教科・変更内容を入力し、`.changelog` シートへ蓄積
- **PDF プレビュー** — 送信前にモーダルダイアログで PDF を確認（[PDF.js](https://mozilla.github.io/pdf.js/) 使用）
- **PDF 自動エクスポート** — カラー版・モノクロ版の PDF を Google Drive に保存
- **Google Chat 通知** — 変更一覧・ダウンロードリンク付きのカードメッセージを Webhook で送信
- **自動セットアップ** — `runAutoSetup()` で必要なシート構成を一括作成

## ファイル構成

```
src/
  main.gs                 # エントリポイント・メニュー定義
  auto_setup.gs           # 初回セットアップ（シート自動生成）
  config.gs               # ドキュメント設定・教科データ定義
  export_pdf.gs           # PDF エクスポート処理
  notice.gs               # Google Chat 通知処理
  print.gs                # モノクロ印刷用シートの生成
  create_folder.gs        # Google Drive フォルダ管理
  delete_branch_sheet.gs  # 一時シートの削除
  html-src/               # HTML サイドバー / モーダル等のソースファイル群
    changesInput.html     # 変更内容入力サイドバーのエントリポイント
    chatPreview.html      # 送信前プレビューモーダルのエントリポイント
    scripts/              # 分割された JavaScript モジュール
    style/                # 分割された CSS ファイル
  html/                   # （ビルド結果：デプロイされるバンドル済みのHTML群）
appsscript.json           # Apps Script マニフェスト
build.js                  # Vite を用いたビルドスクリプト
package.json              # フロントエンド開発用パッケージ定義
```

## 開発とビルド（フロントエンド）

現在、UI 部分（サイドバーやモーダル）は保守性を高めるため、フロントエンドライブラリや JS/CSS ごとに分割して `src/html-src/` 配下で管理しています。  
Google Apps Script 上で動かすため、`build.js`（および Vite）を使用して単一の HTML ファイルとして `src/html/` にバンドルおよび圧縮するビルドステップが含まれています。

デプロイやテスト実行の前に、必ず以下のコマンドでビルドを行なってください。

```bash
# 依存パッケージのインストール
npm install

# バンドルされた HTML ファイルの生成（src/html/ に出力されます）
npm run build
```

## Google Drive 出力構成

```
${PARENT_FOLDER_ID}/
  ｜ issue/
  ｜  └ ${yyyyMMdd_HHmmss}/
  ｜      ├ ${sheet name} - ${yyyyMMdd_HHmmss}.pdf        # カラー版
  ｜      └ [print]${sheet name} - ${yyyyMMdd_HHmmss}.pdf # モノクロ版
  └ issue/
  　  └ preview/
          └ ${yyyyMMdd_HHmmss}.pdf    # プレビュー
```

## セットアップ

セットアップ手順の詳細は [docs/SETUP.md](docs/SETUP.md) を参照してください。

## スクリプトプロパティ

| プロパティ名 | 説明 |
|---|---|
| `GOOGLE_CHAT_WEBHOOK_URL` | 通知先 Google Chat の Incoming Webhook URL |
| `PARENT_FOLDER_ID` | エクスポート先 Google Drive フォルダの ID （省略時はスプレッドシートと同じフォルダ） |

## ライセンス

本プロジェクトは [MIT License](LICENSE) のもとで公開されています。

本プロジェクトが使用するサードパーティライブラリのライセンスについては [LICENSES.md](LICENSES.md) を参照してください。
