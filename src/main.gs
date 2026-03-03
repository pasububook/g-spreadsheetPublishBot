/**
 * スプレッドシート起動時にカスタムメニューを追加する。
 * @return {void}
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('出版');
  menu.addItem('変更内容を登録', 'showCommitRevision')
  menu.addItem('Google Chat に送信', 'mergeMainPermission');
  menu.addToUi();
}

/**
 * 変更内容入力用のサイドバーを表示する。
 * @return {void}
 */
function showCommitRevision() {
  const html = HtmlService.createTemplateFromFile('src/html/changesInput')
      .evaluate()
      .setTitle('変更内容を記述')
      .setWidth(400); // 必要に応じて幅を調整
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Google Chat 送信前の確認ダイアログを表示する。
 * @return {void}
 */
function mergeMainPermission() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert("Google Chat に送信します", ui.ButtonSet.OK_CANCEL);

  if (response == "OK") {
    mergeMain();
  }
}

/**
 * 変更内容を .changelog に保存する。
 * @param {(string[]|Array<Array<string>>)} changes 変更内容配列
 * @return {void}
 */
function saveCommitRevision(changes) {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const changelogSheet = activeSpreadsheet.getSheetByName('.changelog');
  const editorEmail = Session.getActiveUser().getEmail();

  const timeStamp = new Date()

  var changelogSheet_array = []
  for (let i = 0; i < changes.length; i++) {
    const row = changes[i];
    let subject = '';
    let commitMessage = '';

    if (Array.isArray(row)) {
      subject = row[0] != null ? String(row[0]).trim() : '';
      commitMessage = row[1] != null ? String(row[1]).trim() : '';
    } else {
      commitMessage = row != null ? String(row).trim() : '';
    }

    if (commitMessage === '') {
      continue;
    }

    changelogSheet_array.push([timeStamp, editorEmail, subject, commitMessage, false])
  }

  if (changelogSheet_array.length === 0) {
    return;
  }

  changelogSheet.getRange(changelogSheet.getLastRow() + 1, 1, changelogSheet_array.length, changelogSheet_array[0].length).setValues(changelogSheet_array)
}

/**
 * 未送信の変更内容のみを取得する。
 * @param {string} spreadsheetId スプレッドシートID
 * @param {string} sheetName シート名
 * @return {Array<Array<*>>} 未送信変更内容の行配列
 */
function getUnmergedChangelogs(spreadsheetId, sheetName) {
  const changelogSheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const lastRow = changelogSheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }

  const allChangelogs = changelogSheet.getRange(2, 1, lastRow - 1, changelogSheet.getLastColumn()).getValues();

  var changelog = [];

  for (let i = 0; i < allChangelogs.length; i++) {
    if (allChangelogs[i][4] === false) {
      changelog.push(allChangelogs[i]);
    }
  }

  return changelog;
}

/**
 * 未送信の変更内容行を送信済み(true)に更新する。
 * @param {string} spreadsheetId スプレッドシートID
 * @param {string} sheetName シート名
 * @return {void}
 */
function markChangelogsAsMerged(spreadsheetId, sheetName) {
  const changelogSheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const lastRow = changelogSheet.getLastRow();
  if (lastRow <= 1) {
    return;
  }

  const allChangelogs = changelogSheet.getRange(2, 1, lastRow - 1, changelogSheet.getLastColumn()).getValues();
  for (let i = 0; i < allChangelogs.length; i++) {
    if (allChangelogs[i][4] === false) {
      changelogSheet.getRange(i + 2, 5).setValue(true);
    }
  }
}

/**
 * エクスポート用にスプレッドシートをコピーする。
 * @param {string} spreadsheetId コピー元スプレッドシートID
 * @param {string} targetFolderId コピー先フォルダID
 * @param {Date=} baseTimestamp ファイル名に利用する日時
 * @param {string=} baseName ファイル名プレフィックス
 * @return {string} コピー先スプレッドシートID
 */
function createExportSpreadsheetCopy(spreadsheetId, targetFolderId, baseTimestamp, baseName) {
  const sourceFile = DriveApp.getFileById(spreadsheetId);
  const targetFolder = DriveApp.getFolderById(targetFolderId);
  const exportTime = baseTimestamp || new Date();
  const timestamp = Utilities.formatDate(exportTime, 'Asia/Tokyo', 'yyyyMMdd_HHmmss');
  const namePrefix = (baseName || sourceFile.getName()).toString().trim() || sourceFile.getName();
  const copiedFile = sourceFile.makeCopy(namePrefix + ' - ' + timestamp, targetFolder);
  return copiedFile.getId();
}

/**
 * コピー先スプレッドシートの NOW/TODAY を固定日時に置換する。
 * @param {string} spreadsheetId 対象スプレッドシートID
 * @param {Date=} baseTimestamp 固定日時
 * @return {void}
 */
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

/**
 * エクスポート先の親フォルダIDを解決する。
 * @param {string} configuredParentFolderId 設定済み親フォルダID
 * @param {string} spreadsheetId 元スプレッドシートID
 * @return {string} 親フォルダID
 */
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

/**
 * エクスポート用コピーの見出し(F1)を Issue に更新する。
 * @param {string} spreadsheetId 対象スプレッドシートID
 * @param {string} sheetName 対象シート名
 * @return {void}
 */
function replaceExportHeaderLabel(spreadsheetId, sheetName) {
  const exportSpreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const targetSheet = exportSpreadsheet.getSheetByName(".config");
  if (!targetSheet) {
    throw new Error('対象シートが見つかりません: ' + sheetName);
  }

  targetSheet.getRange('B2').setValue('Issue');
}

/**
 * 変更内容を取り込み、エクスポートと Google Chat 送信を実行する。
 * @return {void}
 */
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
  const changelogs = getUnmergedChangelogs(ss.getId(), '.changelog');
  var changes = []
  for (let i = 0; i < changelogs.length; i++) {
    changes.push(changelogs[i][3])
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
  // '.config'!B3: バージョン情報が記載されたセル
  const configSheet = ss.getSheetByName(".config")
  const nowDocVer = configSheet.getRange("B3").getValue();
  configSheet.getRange("B3").setValue(Number(nowDocVer) + 1);
  SpreadsheetApp.flush();

  // フォルダを作成
  const folder_id = createFolderWithCurrentTimestamp(exportParentFolderId, exportStartedAt);

  // エクスポート用にスプレッドシートをコピー
  const exportSpreadsheetId = createExportSpreadsheetCopy(spreadsheetId, folder_id, exportStartedAt, sheetName);

  // コピーしたスプレッドシート内の時間依存データを固定化
  freezeSpreadsheetValues(exportSpreadsheetId, exportStartedAt);

  // エクスポート用コピーの見出しを変更 (Edit -> Issue)
  replaceExportHeaderLabel(exportSpreadsheetId, sheetName);

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

  // 送信成功後に未送信ログを送信済みへ更新
  markChangelogsAsMerged(ss.getId(), '.changelog');
  
  ss.toast('出版が完了しました。');
}