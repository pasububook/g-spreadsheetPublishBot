/**
 * UIの操作やDOMイベントの管理
 */
import { submitMergeMain, closeHost } from './api.js';

export function setupUI() {
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
    document.getElementById('btn-cancel').addEventListener('click', closeHost);

    // ---- 送信処理 ----
    function submitToChat() {
        var btnSubmit = document.getElementById('btn-submit');
        btnSubmit.disabled = true;
        submitMergeMain().catch(function(err) {
            btnSubmit.disabled = false;
            var message = '送信処理の開始に失敗しました。時間をおいて再試行してください。';
            if (err && err.message) {
                message += '\n\n詳細: ' + err.message;
            }
            alert(message);
            console.error('mergeMain 呼び出し失敗:', err);
        });

        // RPC キック直後に閉じると取りこぼすことがあるため、短い遅延を入れてから閉じる。
        window.setTimeout(function() {
            closeHost();
        }, 250);
    }

    document.getElementById('btn-submit').addEventListener('click', submitToChat);

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            submitToChat();
        }
    });
}

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
    new MutationObserver(update).observe(scrollEl, { childList: true, subtree: true });
    update();
}

var SUBJECT_SORT_ORDER_PREVIEW = ['国語', '数学', '理科', '社会', '英語'];

function renderTagsForPreview(text) {
    return text.replace(/<([^;>]+);([^>]*)>/g, function(match, name, type) {
        var trimmedType = type.trim();
        if (!['教科書', '資料集', 'ワーク', 'プリント', 'その他'].includes(trimmedType)) {
            trimmedType = 'その他';
        }
        return '「<span class="preview-tag" data-type="' + trimmedType + '">' + name + '</span>」';
    });
}

export function renderChangesList(changes) {
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

export function showChangesLoading() {
    document.getElementById('changes-loading').classList.remove('hidden');
    document.getElementById('changes-error').classList.add('hidden');
    document.getElementById('changes-list').classList.add('hidden');
}

export function hideChangesLoading() {
    document.getElementById('changes-loading').classList.add('hidden');
}

export function showChangesError() {
    hideChangesLoading();
    document.getElementById('changes-error').classList.remove('hidden');
}

export function setupPdfRetryButton(retryCallback) {
    document.getElementById('btn-retry').addEventListener('click', function() {
        document.getElementById('pdf-status-error').classList.add('hidden');
        document.getElementById('pdf-status-loading').classList.remove('hidden');
        document.getElementById('pdf-canvas-wrapper').classList.remove('visible');
        document.getElementById('pdf-canvas-wrapper').innerHTML = '';
        retryCallback();
    });
}
