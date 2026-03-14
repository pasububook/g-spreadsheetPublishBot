document.addEventListener('DOMContentLoaded', function() {
// ---- 変更内容の非同期取得 ----
loadChangesList();

// ---- パネル切り替え ----
var btns = document.querySelectorAll('.view-btn');
var panelLeft = document.getElementById('panel-left');
var panelRight = document.getElementById('panel-right');

btns.forEach(function(btn) {
btn.addEventListener('click', function() {
btns.forEach(function(b) { b.classList.remove('active'); });
btn.classList.add('active');
var viewMode = btn.dataset.view;
if (viewMode === 'split') {
    panelLeft.style.width = '50%';
    panelRight.style.width = '50%';
    panelLeft.style.borderRight = '1px solid var(--border-color)';
} else if (viewMode === 'left') {
    panelLeft.style.width = '100%';
    panelRight.style.width = '0%';
    panelLeft.style.borderRight = 'none';
} else if (viewMode === 'right') {
    panelLeft.style.width = '0%';
    panelRight.style.width = '100%';
    panelLeft.style.borderRight = 'none';
}
});
});

// ---- スクロールインジケーター ----
function setupScrollFade(scrollElId, fadeElId) {
var scrollEl = document.getElementById(scrollElId);
var fadeEl = document.getElementById(fadeElId);
function update() {
var atBottom = scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 4;
if (atBottom) {
    fadeEl.classList.add('hidden');
} else {
    fadeEl.classList.remove('hidden');
}
}
scrollEl.addEventListener('scroll', update);
// コンテンツ変化時にも再チェック
new MutationObserver(update).observe(scrollEl, { childList: true, subtree: true });
update();
}
setupScrollFade('panel-left-scroll', 'scroll-fade-left');
setupScrollFade('panel-right-scroll', 'scroll-fade-right');

// PDF ロード後は背景が暗くなるのでフェード色を切り替え
var rightFade = document.getElementById('scroll-fade-right');
var observer = new MutationObserver(function() {
var container = document.querySelector('.pdf-container');
if (container && container.classList.contains('pdf-loaded')) {
rightFade.classList.remove('scroll-fade-right-white');
rightFade.classList.add('scroll-fade-right');
}
});
var pdfContainer = document.querySelector('.pdf-container');
if (pdfContainer) observer.observe(pdfContainer, { attributes: true, attributeFilter: ['class'] });


// ---- キャンセルボタン ----
document.getElementById('btn-cancel').addEventListener('click', function() {
google.script.host.close();
});

// ---- 送信処理 ----
function submitToChat() {
var btnSubmit = document.getElementById('btn-submit');
btnSubmit.disabled = true;
google.script.run.mergeMain();
google.script.host.close();
}

document.getElementById('btn-submit').addEventListener('click', submitToChat);

document.addEventListener('keydown', function(e) {
if (e.ctrlKey && e.key === 'Enter') {
e.preventDefault();
submitToChat();
}
});

// ---- PDF 遅延読み込み ----
loadPreviewPdf();

document.getElementById('btn-retry').addEventListener('click', function() {
document.getElementById('pdf-status-error').classList.add('hidden');
document.getElementById('pdf-status-loading').classList.remove('hidden');
document.getElementById('pdf-canvas-wrapper').classList.remove('visible');
document.getElementById('pdf-canvas-wrapper').innerHTML = '';
loadPreviewPdf();
});
});

/**
* GAS の getUnmergedChangelogsForPreview を非同期呼び出しし、変更内容リストを描画する。
*/
function loadChangesList() {
google.script.run
.withSuccessHandler(function(changes) {
document.getElementById('changes-loading').classList.add('hidden');
renderChangesList(changes);
})
.withFailureHandler(function(err) {
document.getElementById('changes-loading').classList.add('hidden');
document.getElementById('changes-error').classList.remove('hidden');
console.error('変更内容取得エラー:', err);
})
.getUnmergedChangelogsForPreview();
}

/** タグカテゴリのカラー定義 (notice.gs / changesInput.html と同一) */
var TAG_CATEGORIES_PREVIEW = {
'教科書': { color: '#2E86C1' },
'資料集': { color: '#27AE60' },
'ワーク':  { color: '#E67E22' },
'プリント': { color: '#884EA0' },
'その他':  { color: '#7F8C8D' }
};

/** 教科の表示順 (notice.gs と同一) */
var SUBJECT_SORT_ORDER_PREVIEW = ['国語', '数学', '理科', '社会', '英語'];

/**
* <name;type> 形式のタグを <span style="color:...">name</span> に変換する。
* @param {string} text
* @return {string}
*/
function renderTagsForPreview(text) {
return text.replace(/<([^;>]+);([^>]*)>/g, function(match, name, type) {
var trimmedType = type.trim();
var cat = TAG_CATEGORIES_PREVIEW[trimmedType] || TAG_CATEGORIES_PREVIEW['その他'];
return '「<span style="color:' + cat.color + ';font-weight:500">' + name + '</span>」';
});
}

/**
* 変更内容リストを DOM に描画する。
* 教科ごとにグループ化・定義順に並び替えて表示する。
* @param {Array<{subject: string, message: string}>} changes
*/
function renderChangesList(changes) {
var list = document.getElementById('changes-list');
list.innerHTML = '';
list.classList.remove('hidden');

if (!changes || changes.length === 0) {
var empty = document.createElement('li');
empty.className = 'changes-empty';
empty.textContent = '未送信の変更内容がありません。';
list.appendChild(empty);
return;
}

// 教科ごとにグループ化
var subjectMap = {};
changes.forEach(function(item) {
var rawSubject = (item.subject || '').trim();
var majorSubject = rawSubject.split('/')[0].trim() || 'その他';
var subject = rawSubject || 'その他';
if (!subjectMap[subject]) {
subjectMap[subject] = { major: majorSubject, messages: [] };
}
subjectMap[subject].messages.push(item.message || '');
});

// 定義順で並び替え
var sortedSubjects = Object.keys(subjectMap).sort(function(a, b) {
var ia = SUBJECT_SORT_ORDER_PREVIEW.indexOf(subjectMap[a].major);
var ib = SUBJECT_SORT_ORDER_PREVIEW.indexOf(subjectMap[b].major);
var ra = ia === -1 ? SUBJECT_SORT_ORDER_PREVIEW.length : ia;
var rb = ib === -1 ? SUBJECT_SORT_ORDER_PREVIEW.length : ib;
if (ra !== rb) return ra - rb;
return a < b ? -1 : a > b ? 1 : 0;
});

sortedSubjects.forEach(function(subject) {
var li = document.createElement('li');
li.className = 'change-group';

var subjectEl = document.createElement('span');
subjectEl.className = 'change-group-subject';
subjectEl.textContent = subject;
li.appendChild(subjectEl);

var ul = document.createElement('ul');
ul.className = 'change-group-items';
subjectMap[subject].messages.forEach(function(msg) {
var item = document.createElement('li');
item.className = 'change-group-item';
item.innerHTML = '• ' + renderTagsForPreview(msg);
ul.appendChild(item);
});
li.appendChild(ul);

list.appendChild(li);
});
}

/**
* GAS の createPreviewPdf を非同期呼び出しし、PDF.js でキャンバスに描画する。
*/
function loadPreviewPdf() {
// PDF.js worker を CDN から指定
pdfjsLib.GlobalWorkerOptions.workerSrc =
'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

google.script.run
.withSuccessHandler(function(base64Data) {
// base64 → Uint8Array
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
.withFailureHandler(function(err) {
document.getElementById('pdf-status-loading').classList.add('hidden');
document.getElementById('pdf-status-error').classList.remove('hidden');
console.error('PDF 生成エラー:', err);
})
.createPreviewPdf();
}