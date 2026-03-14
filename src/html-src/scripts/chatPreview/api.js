/**
 * GAS との通信処理用モジュール
 */

/**
 * GAS の getUnmergedChangelogsForPreview を非同期呼び出しする
 * @return {Promise<Array>} 変更内容リスト
 */
export function fetchUnmergedChangelogsForPreview() {
    return new Promise((resolve, reject) => {
        google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            .getUnmergedChangelogsForPreview();
    });
}

/**
 * GAS の createPreviewPdf を非同期呼び出しする
 * @return {Promise<string>} Base64エンコードされたPDFデータ
 */
export function fetchPreviewPdf() {
    return new Promise((resolve, reject) => {
        google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            .createPreviewPdf();
    });
}

/**
 * 変更内容をChatに送信する
 */
export function submitMergeMain() {
    google.script.run.mergeMain();
}

/**
 * ホスト(GASモーダルダイアログ)を閉じる
 */
export function closeHost() {
    google.script.host.close();
}
