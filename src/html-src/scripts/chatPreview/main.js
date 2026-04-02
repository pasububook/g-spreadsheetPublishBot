import { fetchUnmergedChangelogsForPreview } from './api.js';
import { setupUI, renderChangesList, hideChangesLoading, showChangesError, setupPdfRetryButton } from './ui.js';
import { loadPreviewPdf } from './pdfViewer.js';

document.addEventListener('DOMContentLoaded', function() {
    // UI の初期化
    setupUI();

    // 変更内容の非同期取得
    loadChangesList();

    // PDF 遅延読み込み
    loadPreviewPdf();
    
    // PDF 再試行ボタンの設定
    setupPdfRetryButton(loadPreviewPdf);
});

/**
 * GAS の getUnmergedChangelogsForPreview を非同期呼び出しし、変更内容リストを描画する。
 */
function loadChangesList() {
    fetchUnmergedChangelogsForPreview()
        .then(function(changes) {
            hideChangesLoading();
            renderChangesList(changes);
        })
        .catch(function(err) {
            showChangesError();
            console.error('変更内容取得エラー:', err);
        });
}
