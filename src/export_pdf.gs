/**
 * 指定したスプレッドシートの指定したシートをPDFでエクスポートし、指定したフォルダに保存します。
 *
 * @param {string} spreadsheetId - エクスポートするスプレッドシートのID。
 * @param {string} sheetName - エクスポートするシートの名前。
 * @param {string} folderId - エクスポートしたPDFを保存するフォルダのID。
 * @param {boolean} includeTimestamp - PDFファイル名にエクスポート時刻を含めるかどうか (true/false)。
 * @param {Date=} baseTimestamp - PDFファイル名に利用する基準時刻。未指定時は現在時刻。
 * @returns {Object} エクスポートしたPDFのファイル名、ファイルID、共有URLを含むオブジェクト。
 */
function exportSheetAsPdf(spreadsheetId, sheetName, folderId, includeTimestamp, baseTimestamp) {
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
                `&size=A4` + // 大きさ
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
      const now = baseTimestamp || new Date();
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
