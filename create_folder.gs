/**
 * 指定したフォルダ内に現在時刻を名前に持つ新しいフォルダを作成します。
 * 例: 現在時刻が2025年6月14日21時27分の場合、フォルダ名は「20250614_2127」となります。
 *
 * @param {string} parentFolderId 新しいフォルダを作成する親フォルダのID。
 * @return {string} 作成された新しいフォルダのID。
 */
function createFolderWithCurrentTimestamp(parentFolderId) {
  // タイムゾーンを日本時間に設定
  const timeZone = 'Asia/Tokyo';

  // 現在の日時を取得
  const now = new Date();

  // フォーマットされた日付と時刻の文字列を作成
  // YYYYMMDD_HHmm 形式
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるため+1
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  const folderName = `${year}${month}${day}_${hours}${minutes}`;

  try {
    // 親フォルダを取得
    const parentFolder = DriveApp.getFolderById(parentFolderId);

    // 新しいフォルダを作成
    const newFolder = parentFolder.createFolder(folderName);

    // 作成したフォルダのIDを返す
    return newFolder.getId();

  } catch (e) {
    Logger.log(`フォルダの作成中にエラーが発生しました: ${e.message}`);
    throw new Error(`フォルダの作成に失敗しました: ${e.message}`);
  }
}

function testCreateFolder() {
  const yourParentFolderId = 'ここに親フォルダのIDを入力してください'; // 例: '1a2b3c4d5e6f7g8h9i0jklmnopqrstuvwx'
  try {
    const newFolderId = createFolderWithCurrentTimestamp(yourParentFolderId);
    Logger.log(`新しいフォルダが作成されました。フォルダID: ${newFolderId}`);
  } catch (e) {
    Logger.log(e.message);
  }
}
