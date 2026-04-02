/**
 * GAS との通信処理用モジュール (変更内容入力用)
 */

/**
 * 変更内容をGASに保存する
 * @param {Array<Array<string>>} changes 変更データの配列 [[subject, content], ...]
 * @return {Promise<void>}
 */
export function saveCommitRevision(changes) {
    return new Promise((resolve, reject) => {
        google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            .saveCommitRevision(changes);
    });
}

/**
 * モーダルを閉じる
 */
export function closeSidebar() {
    google.script.host.close();
}