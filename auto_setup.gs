function runAutoSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // main
  // setMainSheet()

  // .config
  // setConfigSheet()

  // .changelog
  setChangelogSheet()

  // .editor
  setEditorSheet()
}


// .changelog
function setChangelogSheet(){
  const changelogSheet = createNameSheet(".changelog");
  changelogSheet.getRange("A1:D1").setValues([["timestamp", "editorEmail", "commitMessage", "isMerged"]])
}

// .editor
function setEditorSheet(){
  const editorSheet = createNameSheet(".editor");
  editorSheet.getRange("A1:B1").setValues([["email", "name"]])
}



/**
 * 指定された名前のシートを新規作成します。
 * すでに存在する場合はアラートを表示し、既存のシートを返します。
 * * @param {string} sheetName - 作成したいシートの名前
 * @return {GoogleAppsScript.Spreadsheet.Sheet} 作成された（または既存の）シートオブジェクト
 */
function createNameSheet(sheetName) {
  // 1. アクティブなスプレッドシートを取得
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 2. すでに同じ名前のシートがないかチェック
  const existingSheet = ss.getSheetByName(sheetName);

  if (!existingSheet) {
    // 3. シートが存在しない場合は、新規作成
    const nameSheet = ss.insertSheet(sheetName);
    Logger.log("[log] シート '" + sheetName + "' を作成しました。");
    return nameSheet
  } else {
    // すでに存在する場合の通知
    Logger.log("[error] エラー：'" + sheetName + "' というシートは既に存在します。");
  }
}
