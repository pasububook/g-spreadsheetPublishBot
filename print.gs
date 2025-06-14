/**
 * 指定された Google Spreadsheet のシートをコピーし、背景色と文字色を調整します。
 * コピーされたシートは、コピー前のセル結合や枠線などの書式を継承します。
 *
 * @param {string} spreadsheetId - 操作対象の Google Spreadsheet の ID。
 * @param {string} sheetName - コピーおよび調整対象のシート名。
 * @returns {string} コピーして作成されたシートの名前。
 */
function copyAndFormatSheet(spreadsheetId, sheetName) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const originalSheet = ss.getSheetByName(sheetName);

  if (!originalSheet) {
    throw new Error(`シート '${sheetName}' が見つかりません。`);
  }

  // 1. 指定された Google Spreadsheet ID のシートをコピーする
  // コピー後の名前は、 [print]${コピー前の名前} - ${コピー日時})
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const copiedSheetName = `[print]${sheetName} - ${year}${month}${day}${hours}${minutes}`;

  // copyTo() メソッドは、デフォルトで書式設定（セル結合、枠線、背景色など）をすべて継承します。
  const copiedSheet = originalSheet.copyTo(ss);
  copiedSheet.setName(copiedSheetName);

  // 2. 指定されたシートの背景色を全て削除し、透明にする
  // getDataRange() でシート全体のデータ範囲を取得し、setBackground(null) で背景色を透明にします。
  // これにより、他の書式（セル結合、枠線、フォントなど）は保持されます。
  const range = copiedSheet.getDataRange();
  if (range.getNumRows() > 0 && range.getNumColumns() > 0) {
    range.setBackground(null); // null を設定することで背景が透明になります
  }

  // 3. 指定されたシートの文字色を全て黒色にする
  // getDataRange() で取得した範囲の文字色を黒に設定します。
  if (range.getNumRows() > 0 && range.getNumColumns() > 0) {
    range.setFontColor("black");
  }

  return copiedSheet.getName();
}

function test_copyAndFormatSheet() {
  const spreadsheetId = "あなたのGoogle Spreadsheet IDをここに貼り付けてください"; // 例: "1abcdefgHIJKLMNOPqrstuvwxyz1234567890"
  const sheetName = "コピーしたいシートの名前"; // 例: "OriginalData"

  try {
    const newSheetName = copyAndFormatSheet(spreadsheetId, sheetName);
    Logger.log(`新しいシートが作成されました: ${newSheetName}`);
  } catch (e) {
    Logger.log(`エラーが発生しました: ${e.message}`);
  }
}