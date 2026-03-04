/**
 * 指定した親フォルダ内に指定名のサブフォルダを取得または作成します。
 * 同名フォルダが既に存在する場合は既存のフォルダを返します。
 *
 * @param {string} parentFolderId 親フォルダのID。
 * @param {string} subFolderName 取得または作成するサブフォルダ名。
 * @return {string} サブフォルダのID。
 */
function getOrCreateSubFolder(parentFolderId, subFolderName) {
  const parentFolder = DriveApp.getFolderById(parentFolderId);
  const existing = parentFolder.getFoldersByName(subFolderName);
  if (existing.hasNext()) {
    return existing.next().getId();
  }
  return parentFolder.createFolder(subFolderName).getId();
}

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
  // YYYYMMDD_HHmmss 形式
  const folderName = Utilities.formatDate(now, timeZone, 'yyyyMMdd_HHmmss');

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
