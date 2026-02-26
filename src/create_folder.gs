/**
 * 指定したフォルダ内に現在時刻を名前に持つ新しいフォルダを作成します。
 * 例: 現在時刻が2025年6月14日21時27分の場合、フォルダ名は「20250614_2127」となります。
 *
 * @param {string} parentFolderId 新しいフォルダを作成する親フォルダのID。
 * @param {Date=} baseTimestamp フォルダ名に利用する基準時刻。未指定時は現在時刻。
 * @return {string} 作成された新しいフォルダのID。
 */
function createFolderWithCurrentTimestamp(parentFolderId, baseTimestamp) {
  // タイムゾーンを日本時間に設定
  const timeZone = 'Asia/Tokyo';

  // 現在の日時を取得
  const now = baseTimestamp || new Date();

  // フォーマットされた日付と時刻の文字列を作成
  // YYYYMMDD_HHmm 形式
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるため+1
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  const folderName = `${year}${month}${day}_${hours}${minutes}`;

  try {
    const targetParentFolderId = (parentFolderId || '').toString().trim();
    if (!targetParentFolderId) {
      throw new Error('親フォルダIDが空です。');
    }

    // 親フォルダを取得
    const parentFolder = DriveApp.getFolderById(targetParentFolderId);

    // 新しいフォルダを作成
    const newFolder = parentFolder.createFolder(folderName);

    // 作成したフォルダのIDを返す
    return newFolder.getId();

  } catch (e) {
    Logger.log(`フォルダの作成中にエラーが発生しました: ${e.message}`);
    throw new Error(`フォルダの作成に失敗しました: ${e.message}`);
  }
}
