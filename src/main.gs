function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('出版');
  menu.addItem('変更内容を登録', 'showCommitRevision')
  menu.addItem('Google Chat に送信', 'mergeMainPermission');
  menu.addToUi();
}

// ユーザーに変更内容を尋ねるダイアログを表示する関数
function showCommitRevision() {
  const html = HtmlService.createTemplateFromFile('src/html/changesInput')
      .evaluate()
      .setTitle('変更内容を記述')
      .setWidth(400); // 必要に応じて幅を調整
  SpreadsheetApp.getUi().showSidebar(html);
}

// 本当に Google Chat に送信してよいか確認するダイアログ
function mergeMainPermission() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert("Google Chat に送信します", ui.ButtonSet.OK_CANCEL);

  if (response == "OK") {
    mergeMain();
  }
}

// 変更内容の保存
function saveCommitRevision(changes) {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const changelogSheet = activeSpreadsheet.getSheetByName('.changelog');
  const editorEmail = Session.getActiveUser().getEmail();

  const timeStamp = new Date()

  var changelogSheet_array = []
  for (let i = 0; i < changes.length; i++) {
    changelogSheet_array.push([timeStamp, editorEmail, changes[i], false])
  }

  changelogSheet.getRange(changelogSheet.getLastRow() + 1, 1, changelogSheet_array.length, changelogSheet_array[0].length).setValues(changelogSheet_array)
}

// 変更内容の取得
function getChangelogs(spreadsheetId, sheetName) {
  const changelogSheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const allChangelogs = changelogSheet.getRange(1, 1, changelogSheet.getLastRow(), changelogSheet.getLastColumn()).getValues();

  var changelog = []
  var isMergedFlags = []
  var sellIndex = 1
  for (let i = 0; i < allChangelogs.length - 1; i++) {
    if (allChangelogs[sellIndex][3] == false) {
      changelog.push(allChangelogs[sellIndex]);
      isMergedFlags.push([true])
    } else {
      isMergedFlags.push([true])
    }
    sellIndex += 1
  }

  changelogSheet.getRange(2, 4, changelogSheet.getLastRow()-1).setValues(isMergedFlags)

  return changelog
}

// エクスポート用にスプレッドシートをコピー
function createExportSpreadsheetCopy(spreadsheetId, targetFolderId, baseTimestamp, baseName) {
  const sourceFile = DriveApp.getFileById(spreadsheetId);
  const targetFolder = DriveApp.getFolderById(targetFolderId);
  const exportTime = baseTimestamp || new Date();
  const timestamp = Utilities.formatDate(exportTime, 'Asia/Tokyo', 'yyyyMMdd_HHmmss');
  const namePrefix = (baseName || sourceFile.getName()).toString().trim() || sourceFile.getName();
  const copiedFile = sourceFile.makeCopy(namePrefix + ' - ' + timestamp, targetFolder);
  return copiedFile.getId();
}

// コピーしたスプレッドシート内の値を固定化 (数式を値に変換)
function freezeSpreadsheetValues(spreadsheetId, baseTimestamp) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheets = ss.getSheets();
  const exportTime = baseTimestamp || new Date();
  const year = exportTime.getFullYear();
  const month = exportTime.getMonth() + 1;
  const day = exportTime.getDate();
  const hours = exportTime.getHours();
  const minutes = exportTime.getMinutes();
  const seconds = exportTime.getSeconds();

  const fixedNowExpr = '(DATE(' + year + ',' + month + ',' + day + ')+TIME(' + hours + ',' + minutes + ',' + seconds + '))';
  const fixedTodayExpr = '(DATE(' + year + ',' + month + ',' + day + '))';

  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    if (sheet.getName().startsWith('.')) {
      continue;
    }

    const range = sheet.getDataRange();
    if (range.getNumRows() === 0 || range.getNumColumns() === 0) {
      continue;
    }

    const formulas = range.getFormulas();
    for (let rowIndex = 0; rowIndex < formulas.length; rowIndex++) {
      for (let colIndex = 0; colIndex < formulas[rowIndex].length; colIndex++) {
        const formula = formulas[rowIndex][colIndex];
        if (!formula) {
          continue;
        }

        const rewritten = formula
          .replace(/NOW\(\)/gi, fixedNowExpr)
          .replace(/TODAY\(\)/gi, fixedTodayExpr);

        if (rewritten !== formula) {
          range.getCell(rowIndex + 1, colIndex + 1).setFormula(rewritten);
        }
      }
    }
  }
}

// エクスポート先の親フォルダIDを解決
function resolveExportParentFolderId(configuredParentFolderId, spreadsheetId) {
  const trimmedFolderId = (configuredParentFolderId || '').toString().trim();
  if (trimmedFolderId) {
    return trimmedFolderId;
  }

  const sourceFile = DriveApp.getFileById(spreadsheetId);
  const parents = sourceFile.getParents();
  if (parents.hasNext()) {
    return parents.next().getId();
  }

  throw new Error('PARENT_FOLDER_ID が未設定で、コピー元スプレッドシートの親フォルダも取得できません。');
}

// メニュー: Google Chat に送信 (変更内容の処理を含む)
function mergeMain() {
  const exportStartedAt = new Date();

  const scriptProperties = PropertiesService.getScriptProperties();
  const PARENT_FOLDER_ID = scriptProperties.getProperty("PARENT_FOLDER_ID");
  const GOOGLE_CHAT_WEBHOOK_URL = scriptProperties.getProperty("GOOGLE_CHAT_WEBHOOK_URL");

  // 現在開かれているスプレッドシートのシート名とスプレッドシートIDを取得
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = ss.getActiveSheet().getName();
  const spreadsheetId = ss.getId();
  const exportParentFolderId = resolveExportParentFolderId(PARENT_FOLDER_ID, spreadsheetId);

  Logger.log('シート名: ' + sheetName);
  Logger.log('スプレッドシートID: ' + spreadsheetId);

  // 変更内容の取得
  const changelogs = getChangelogs(ss.getId(), '.changelog');
  var changes = []
  for (let i = 0; i < changelogs.length; i++) {
    changes.push(changelogs[i][2])
  }

  // 編集者のメールアドレスを取得
  var editorEmail = []
  for (let i = 0; i < changelogs.length; i++) {
    editorEmail.push(changelogs[i][1])
  }

  // 出版者の情報を取得
  const publisherEmail = Session.getActiveUser().getEmail();
  const editorSheet = ss.getSheetByName(".editor");
  const editors = editorSheet.getRange(2, 1, editorSheet.getLastRow() - 1, 2).getValues();
  const publisherName = editors.find(row => row[0] === publisherEmail)[1];

  // バージョン表記の更新
  // '.config'!B2: バージョン情報が記載されたせる
  const configSheet = ss.getSheetByName(".config")
  const nowDocVer = configSheet.getRange("B2").getValue();
  const newDocVer = configSheet.getRange("B2").setValue(Number(nowDocVer) + 1);

  // フォルダを作成
  const folder_id = createFolderWithCurrentTimestamp(exportParentFolderId, exportStartedAt);

  // エクスポート用にスプレッドシートをコピー
  const exportSpreadsheetId = createExportSpreadsheetCopy(spreadsheetId, folder_id, exportStartedAt, sheetName);

  // コピーしたスプレッドシート内の時間依存データを固定化
  freezeSpreadsheetValues(exportSpreadsheetId, exportStartedAt);

  // コピー先に残っている一時シートを削除
  deleteSheetsStartingWithBracket(exportSpreadsheetId);

  // モノクロ印刷用にシートを作成
  const mono_sheet_name = copyAndFormatSheet(exportSpreadsheetId, sheetName, exportStartedAt);

  // カラー版をエクスポート
  const color_data = exportSheetAsPdf(exportSpreadsheetId, sheetName, folder_id, true, exportStartedAt);

  // モノクローム版をエクスポート
  const mono_data = exportSheetAsPdf(exportSpreadsheetId, mono_sheet_name, folder_id, false, exportStartedAt)

  // Google Chat で送信
  const message_content = {
    "sheetName": sheetName,
    "publisher": {
      "name": publisherName,
      "email": publisherEmail
    },
    "editor": Array.from(new Set(editorEmail)),
    "changes": changes,
    "download": {
      "color": color_data.sharingUrl,
      "mono": mono_data.sharingUrl
    }
  }
  sendGooglechat(message_content, GOOGLE_CHAT_WEBHOOK_URL);
  
  SpreadsheetApp.getUi().alert('出版が完了しました。');
}