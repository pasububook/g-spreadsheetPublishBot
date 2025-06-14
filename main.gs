function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('出版');
  menu.addItem('Google Chat に送信', 'publish_and_send_google_chat');
  menu.addToUi();
}

// メニュー: Google Chat に送信
function publish_and_send_google_chat() {
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
  google_chat_message = sheetName + "が更新されました\nカラー版: " + color_data.sharingUrl + "\nモノクローム版: " + mono_data.sharingUrl
  google_chat_webhook(google_chat_message, GOOGLE_CHAT_WEBHOOK_URL)
}
