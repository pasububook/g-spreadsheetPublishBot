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
  main.gs              # エントリポイント・メニュー定義
  auto_setup.gs        # 初回セットアップ（シート自動生成）
  config.gs            # ドキュメント設定・教科データ定義
  export_pdf.gs        # PDF エクスポート処理
  notice.gs            # Google Chat 通知処理
  print.gs             # モノクロ印刷用シートの生成
  create_folder.gs     # Google Drive フォルダ管理
  delete_branch_sheet.gs  # 一時シートの削除
  html/
    changesInput.html  # 変更内容入力サイドバー
    chatPreview.html   # 送信前プレビューモーダル
appsscript.json        # Apps Script マニフェスト
```

## Google Drive 出力構成

```
${PARENT_FOLDER_ID}/
  └ issue/
      └ ${yyyyMMdd_HHmmss}/
          ├ ${sheet name} - ${yyyyMMdd_HHmmss}.pdf        # カラー版
          └ [print]${sheet name} - ${yyyyMMdd_HHmmss}.pdf # モノクロ版
```

## セットアップ

セットアップ手順の詳細は [docs/SETUP.md](docs/SETUP.md) を参照してください。

## スクリプトプロパティ

| プロパティ名 | 説明 |
|---|---|
| `GOOGLE_CHAT_WEBHOOK_URL` | 通知先 Google Chat の Incoming Webhook URL |
| `PARENT_FOLDER_ID` | エクスポート先 Google Drive フォルダの ID （省略時はスプレッドシートと同じフォルダ） |

## ライセンス

本プロジェクトは [MIT License](LICENSE.md) のもとで公開されています。

本プロジェクトが使用するサードパーティライブラリのライセンスについては [LICENSES.md](LICENSES.md) を参照してください。
