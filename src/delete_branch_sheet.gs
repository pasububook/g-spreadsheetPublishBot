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
