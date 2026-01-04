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

  // ヘッダー
  if (isShowCheckbox) {
    return
  } else {
    // 列の幅の調整
    const headerWidths = [34, 86, 74, 365, 60, 30, 41, 21];
    headerWidths.forEach((headerWidth, i) => {
      mainSheet.setColumnWidth(i + 1, headerWidth);
    });

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
  }

  // main
  const subjectTableArea = setupSubjectTable(mainSheet);
  if (isShowCheckbox) {
    return
  } else {
    // 表の見出し
    const mainTableValues = [
      ["", "", "ステータス", "", "", "更新日", "", ""]
    ]
    mainSheet.getRange("A5:H5").setValues(mainTableValues);

    // 内容行の結合
    const mainTableContentRange = [6, 4, subjectTableArea.numericNotation[2], 2]  // 開始行, 開始列, 行数, 列数
    mainSheet.getRange(...mainTableContentRange).mergeAcross()

    // 更新行の結合
    const mainTableUpdateRange = [6, 6, subjectTableArea.numericNotation[2], 3]  // 開始行, 開始列, 行数, 列数
    mainSheet.getRange(...mainTableUpdateRange).mergeAcross()

  }
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
 * * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - 操作対象のシートオブジェクト
 * @return {{a1Notation: string, numericNotation: string}} 編集した範囲（A1形式と数値形式の文字列）
 */
function setupSubjectTable(sheet) {
  const startRow = 6; // 開始行
  let currentRow = startRow;

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

  // 編集範囲の計算
  const totalRows = currentRow - startRow;
  if (totalRows === 0) return { a1Notation: "", numericNotation: "" };

  const finalRange = sheet.getRange(startRow, 1, totalRows, 2);

  return {
    a1Notation: finalRange.getA1Notation(), // 例: 'A6:B10'
    numericNotation: [startRow, 1, totalRows, 2] // 例: '6, 1, 5, 2'
  };
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
