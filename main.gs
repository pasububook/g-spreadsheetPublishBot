// onOpen関数は変更不要です。
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('出版');
  menu.addItem('Google Chat に送信', 'showChangesDialog'); // 関数名を変更
  menu.addToUi();
}

// ユーザーに変更内容を尋ねるダイアログを表示する関数
function showChangesDialog() {
  const html = HtmlService.createTemplateFromFile('ChangesInput')
      .evaluate()
      .setWidth(400)
      .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, '変更内容を記述');
}

// メニュー: Google Chat に送信 (変更内容の処理を含む)
function processAndSend(changes) {
  // ユーザーがキャンセルした場合や何も入力しなかった場合の処理
  if (!changes) {
    SpreadsheetApp.getUi().alert('出版がキャンセルされました。');
    return;
  }
  
  const scriptProperties = PropertiesService.getScriptProperties();
  const PARENT_FOLDER_ID = scriptProperties.getProperty("PARENT_FOLDER_ID");
  const GOOGLE_CHAT_WEBHOOK_URL = scriptProperties.getProperty("GOOGLE_CHAT_WEBHOOK_URL");

  // 現在開かれているスプレッドシートのシート名とスプレッドシートIDを取得
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = ss.getActiveSheet().getName();
  const spreadsheetId = ss.getId();

  Logger.log('シート名: ' + sheetName);
  Logger.log('スプレッドシートID: ' + spreadsheetId);

  // ブランチファイル(キャッシュファイル)を削除
  deleteSheetsStartingWithBracket(spreadsheetId);

  // フォルダを作成
  const folder_id = createFolderWithCurrentTimestamp(PARENT_FOLDER_ID);

  // モノクロ印刷用にシートを作成
  const mono_sheet_name = copyAndFormatSheet(spreadsheetId, sheetName);

  // カラー版をエクスポート
  const color_data = exportSheetAsPdf(spreadsheetId, sheetName, folder_id, true);

  // モノクローム版をエクスポート
  const mono_data = exportSheetAsPdf(spreadsheetId, mono_sheet_name, folder_id, false)

  // Google Chat で送信
  const message_content = {
    "sheetName": sheetName,
    "changes": changes,
    "download": {
      "color": color_data.sharingUrl,
      "mono": mono_data.sharingUrl
    }
  }
  sendGooglechat(message_content, GOOGLE_CHAT_WEBHOOK_URL);
  
  SpreadsheetApp.getUi().alert('出版が完了しました。');
}
