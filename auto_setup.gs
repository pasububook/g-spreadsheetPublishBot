function runAutoSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // main
  setMainSheet()

  // .config
  setConfigSheet()

  // .changelog
  setChangelogSheet()

  // .editor
  setEditorSheet()
}


function setMainSheet(){
  const mainSheet = createNameSheet(docTitle);

  if (isShowCheckbox) {
    return
  } else {
    // 列の幅の調整
    const headerWidths = [34, 86, 74, 365, 60, 30, 41, 21];
    headerWidths.forEach((headerWidth, i) => {
      mainSheet.setColumnWidth(i + 1, headerWidth);
    });

    // ヘッダー
    // 値の保存
    const headerValues = [
      ["='.config'!B1", "", "", "", "", "Edit", "", ""],
      ["", "", "", "", "", "Ver.", "='.config'!B2", ""],
      ["", "", "", "", "=NOW()", "", "", "版"]
    ]

    mainSheet.getRange("A1:H3").setValues(headerValues);

    // セル結合
    const rangesToMerge = [
      "A1:E2", 
      "F1:H1", 
      "G2:H2", 
      "A3:D3", 
      "E3:G3"
    ];


    rangesToMerge.forEach(rangeAddress => {
      mainSheet.getRange(rangeAddress).merge();
    });

    // main
    // 表の見出し
    const mainTableValues = [
      ["", "", "ステータス", "", "", "更新日", "", ""]
    ]
    mainSheet.getRange("A5:H5").setValues(mainTableValues);
  }

  setupSubjectTable(mainSheet)
}

// .config
function setConfigSheet(){
  const configSheet = createNameSheet(".config");
  configSheet.getRange("A1:B2").setValues([["title", docTitle], ["version", "0"]])
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
 * スプレッドシートに行タイトルを入力する関数
 */
function setupSubjectTable(sheet) {
  let currentRow = 6; // 開始行

  // 既存のデータをクリア（必要に応じて）
  // sheet.getRange("A6:B100").clear();

  for (let key in subjectData) {
    const subItems = subjectData[key];

    if (key === "other") {
      // 'other' の場合はA列とB列を結合して記入
      subItems.forEach(item => {
        const range = sheet.getRange(currentRow, 1, 1, 2); // A列とB列の範囲を選択
        range.merge(); // セルを結合
        range.setValue(item);
        currentRow++;
      });
    } else {
      // 通常の教科処理
      const numRows = subItems.length;

      // A列：教科名を入力して結合
      const categoryRange = sheet.getRange(currentRow, 1, numRows, 1);
      categoryRange.setValue(key);
      if (numRows > 1) {
        categoryRange.merge();
      }

      // B列：各小科目を入力
      subItems.forEach((subItem, index) => {
        sheet.getRange(currentRow + index, 2).setValue(subItem);
      });

      // 次の教科の開始行へ移動
      currentRow += numRows;
    }
  }
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
