function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('出版');
  menu.addItem('Google Chat に送信', 'publish_and_send_google_chat');
  menu.addToUi();
}

// メニュー: Google Chat に送信
function publish_and_send_google_chat() {
  // 現在開かれているスプレッドシートのシート名とスプレッドシートIDを取得
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = ss.getActiveSheet().getName();
  const spreadsheetId = ss.getId();

  Logger.log('シート名: ' + sheetName);
  Logger.log('スプレッドシートID: ' + spreadsheetId);
}
