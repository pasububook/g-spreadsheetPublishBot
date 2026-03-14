import { fetchPreviewPdf } from './api.js';

/**
 * PDFビューアのレンダリング機能
 */
export function loadPreviewPdf() {
    // PDF.js worker を CDN から指定
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    fetchPreviewPdf()
        .then(function(base64Data) {
            var binary = atob(base64Data);
            var bytes = new Uint8Array(binary.length);
            for (var i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }

            pdfjsLib.getDocument({ data: bytes }).promise.then(function(pdfDoc) {
                document.getElementById('pdf-status-loading').classList.add('hidden');
                var wrapper = document.getElementById('pdf-canvas-wrapper');
                wrapper.innerHTML = '';

                var renderPage = function(pageNum) {
                    return pdfDoc.getPage(pageNum).then(function(page) {
                        var viewport = page.getViewport({ scale: 1.5 });
                        var canvas = document.createElement('canvas');
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        wrapper.appendChild(canvas);
                        return page.render({
                            canvasContext: canvas.getContext('2d'),
                            viewport: viewport
                        }).promise;
                    });
                };

                // 全ページを順にレンダリング
                var chain = Promise.resolve();
                for (var p = 1; p <= pdfDoc.numPages; p++) {
                    chain = chain.then(renderPage.bind(null, p));
                }
                chain.then(function() {
                    wrapper.classList.add('visible');
                    wrapper.closest('.pdf-container').classList.add('pdf-loaded');
                });

            }).catch(function(err) {
                document.getElementById('pdf-status-loading').classList.add('hidden');
                document.getElementById('pdf-status-error').classList.remove('hidden');
                console.error('PDF レンダリングエラー:', err);
            });
        })
        .catch(function(err) {
            document.getElementById('pdf-status-loading').classList.add('hidden');
            document.getElementById('pdf-status-error').classList.remove('hidden');
            console.error('PDF 生成エラー:', err);
        });
}
