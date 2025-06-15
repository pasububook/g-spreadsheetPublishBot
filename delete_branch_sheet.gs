/**
 * 指定したスプレッドシートの '[' から始まるシート名のシートを全て削除します。
 *
 * @param {string} spreadsheetId - 対象のスプレッドシートID。
 * @returns {string[]} 削除したシート名の配列。
 */
function deleteSheetsStartingWithBracket(spreadsheetId) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheets = ss.getSheets();
  const deletedSheetNames = [];

  for (let i = sheets.length - 1; i >= 0; i--) {
    const sheet = sheets[i];
    const sheetName = sheet.getName();
    if (sheetName.startsWith('[')) {
      ss.deleteSheet(sheet);
      deletedSheetNames.push(sheetName);
    }
  }
  return deletedSheetNames;
}

function testDeleteSheets() {
  const targetSpreadsheetId = 'あなたのスプレッドシートIDをここに貼り付けてください'; // ここに実際のIDを入力
  const deletedNames = deleteSheetsStartingWithBracket(targetSpreadsheetId);
  if (deletedNames.length > 0) {
    Logger.log('以下のシートが削除されました: ' + deletedNames.join(', '));
  } else {
    Logger.log('「[」から始まるシートは見つかりませんでした。');
  }
}
