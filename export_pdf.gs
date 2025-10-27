/**
 * 指定したスプレッドシートの指定したシートをPDFでエクスポートし、指定したフォルダに保存します。
 *
 * @param {string} spreadsheetId - エクスポートするスプレッドシートのID。
 * @param {string} sheetName - エクスポートするシートの名前。
 * @param {string} folderId - エクスポートしたPDFを保存するフォルダのID。
 * @param {boolean} includeTimestamp - PDFファイル名にエクスポート時刻を含めるかどうか (true/false)。
 * @returns {Object} エクスポートしたPDFのファイル名、ファイルID、共有URLを含むオブジェクト。
 */
function exportSheetAsPdf(spreadsheetId, sheetName, folderId, includeTimestamp) {
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      throw new Error(`シート '${sheetName}' が見つかりません。`);
    }

    // PDFエクスポートオプションを設定
    // 参考: https://developers.google.com/sheets/api/guides/export#export_a_spreadsheet_as_a_pdf
    let url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=pdf` +
                `&gid=${sheet.getSheetId()}` +
                `&portrait=true` + // 縦向き (必要に応じて変更)
                `&fitw=true` +     // ページ幅に合わせる (必要に応じて変更)
                `&top_margin=0.75` + // 余白 (必要に応じて変更)
                `&bottom_margin=0.75` +
                `&left_margin=0.75` +
                `&right_margin=0.75` +
                `&printtitle=true` + // スプレッドシートのタイトルをヘッダーに挿入
                `&pagenum=CENTER` +     // ページ番号をフッターに挿入 (より汎用的な設定)
                `&gridlines=false`; // グリッド線非表示

    // 注: ヘッダーの右にエクスポート日時を挿入する、またはヘッダーの中心にワークブックのタイトルを挿入する
    // 直接的なURLパラメータはありません。`printtitle=true`は通常左上にタイトルを挿入します。

    const token = ScriptApp.getOAuthToken();
    const response = UrlFetchApp.fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      muteHttpExceptions: true // エラー時も例外を投げない
    });

    if (response.getResponseCode() !== 200) {
      throw new Error(`PDFエクスポートに失敗しました。ステータスコード: ${response.getResponseCode()}, レスポンス: ${response.getContentText()}`);
    }

    const blob = response.getBlob().setName(`${sheetName}.pdf`);

    let fileName = sheetName;
    if (includeTimestamp) {
      // ファイル名にエクスポート日時を含める
      const now = new Date();
      const year = now.getFullYear();
      const month = ('0' + (now.getMonth() + 1)).slice(-2);
      const day = ('0' + now.getDate()).slice(-2);
      const hours = ('0' + now.getHours()).slice(-2);
      const minutes = ('0' + now.getMinutes()).slice(-2);
      const seconds = ('0' + now.getSeconds()).slice(-2);
      fileName += ` - ${year}${month}${day}_${hours}${minutes}${seconds}`;
    }

    const folder = DriveApp.getFolderById(folderId);
    const pdfFile = folder.createFile(blob.setName(fileName + '.pdf'));

    return {
      fileName: pdfFile.getName(),
      fileId: pdfFile.getId(),
      sharingUrl: pdfFile.getUrl()
    };

  } catch (e) {
    Logger.log(`エラーが発生しました: ${e.message}`);
    throw e; // エラーを再スローして、呼び出し元で処理できるようにする
  }
}

/**
 * exportSheetAsPdf 関数のテストコード。
 * 実際に実行する際は、適切なスプレッドシートID、シート名、フォルダIDを設定してください。
 */
function test_exportSheetAsPdf() {
  // !!! ここに適切な値を設定してください !!!
  const testSpreadsheetId = 'あなたのテスト用スプレッドシートID'; // 例: '1abcdefghijklmnopqrstuvwxyz1234567890'
  const testSheetName = 'TestSheet'; // 例: 'シート1'
  const testFolderId = 'あなたのテスト用フォルダID'; // 例: '1abcdefghijklmnopqrstuvwxyz1234567890'

  if (testSpreadsheetId === 'あなたのテスト用スプレッドシートID' || 
      testSheetName === 'TestSheet' || 
      testFolderId === 'あなたのテスト用フォルダID') {
    Logger.log("注意: test_exportSheetAsPdf を実行する前に、'あなたのテスト用スプレッドシートID', 'あなたのテスト用シート名', 'あなたのテスト用フォルダID' を適切な値に置き換えてください。");
    return;
  }

  Logger.log('--- test_exportSheetAsPdf (時刻を含む) ---');
  try {
    const resultWithTimestamp = exportSheetAsPdf(testSpreadsheetId, testSheetName, testFolderId, true);
    Logger.log(`ファイル名 (時刻含む): ${resultWithTimestamp.fileName}`);
    Logger.log(`ファイルID (時刻含む): ${resultWithTimestamp.fileId}`);
    Logger.log(`共有URL (時刻含む): ${resultWithTimestamp.sharingUrl}`);
    // ここで、生成されたファイルが期待通りか手動で確認することもできます。
  } catch (e) {
    Logger.log(`テスト失敗 (時刻含む): ${e.message}`);
  }

  Logger.log('--- test_exportSheetAsPdf (時刻を含まない) ---');
  try {
    const resultWithoutTimestamp = exportSheetAsPdf(testSpreadsheetId, testSheetName, testFolderId, false);
    Logger.log(`ファイル名 (時刻含まない): ${resultWithoutTimestamp.fileName}`);
    Logger.log(`ファイルID (時刻含まない): ${resultWithoutTimestamp.fileId}`);
    Logger.log(`共有URL (時刻含まない): ${resultWithoutTimestamp.sharingUrl}`);
  } catch (e) {
    Logger.log(`テスト失敗 (時刻含まない): ${e.message}`);
  }

  Logger.log('--- test_exportSheetAsPdf (存在しないシート名) ---');
  try {
    exportSheetAsPdf(testSpreadsheetId, '存在しないシート', testFolderId, false);
  } catch (e) {
    Logger.log(`テスト成功 (存在しないシート名): ${e.message}`); // エラーが期待される
  }
}
