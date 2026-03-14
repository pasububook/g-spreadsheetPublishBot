
import { state, dom } from './state.js';
import { getCategory, TAG_CATEGORIES, getSubject } from './constants.js';
import { showSuggestions, closeSuggestions, renderSuggestions } from './suggestions.js';
import { showInlineSuggestion, acceptInlineSuggestion, removeInlineSuggestion, getQueryAtCursor } from './inlineSuggestion.js';
import { updateEditorEmptyState, updateEmptyState } from './ui.js';
import { addNewRow } from './row.js';

export function handleEditorInput(e) {
  if (!state.activeEditor) return;

  // プレースホルダーの表示を更新
  updateEditorEmptyState(state.activeEditor);

  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  
  const text = state.activeEditor.innerText;
  const range = sel.getRangeAt(0);
  const startOffset = range.startOffset;
  const rangeContainer = range.startContainer;
  
  if (rangeContainer.nodeType === Node.TEXT_NODE) {
    const textContent = rangeContainer.textContent;
    const charBefore = textContent[startOffset - 1];
    
    if (["<", "＜", "`", "@"].includes(charBefore)) {
      removeInlineSuggestion();
      state.suggestionMode = true;
      state.suggestionTrigger = charBefore; 
      state.queryStartRange = range.cloneRange();
      state.queryStartRange.setStart(rangeContainer, startOffset - 1);
      showSuggestions("");
      return;
    }

    if (state.suggestionMode && state.suggestionTrigger !== "@" && [">", "＞", "`"].includes(charBefore)) {
       // 自動確定ロジック
    }
  }

  if (state.suggestionMode && state.queryStartRange) {
    const currentRange = sel.getRangeAt(0);
    if (currentRange.startContainer === state.queryStartRange.startContainer) {
      const queryText = currentRange.startContainer.textContent.substring(
        state.queryStartRange.startOffset + 1,
        currentRange.startOffset
      );
      
      if (state.suggestionTrigger !== "@") {
        const lastChar = queryText.slice(-1);
        if ([">", "＞", "`"].includes(lastChar)) {
          const finalQuery = queryText.slice(0, -1);
          insertTag(finalQuery, true);
          return;
        }
      }
      
      showSuggestions(queryText);
    } else {
      closeSuggestions();
    }
    return;
  }

  // ドロップダウンサジェストが非アクティブのとき、インラインサジェストを試みる
  if (!state.suggestionMode) {
    const queryInfo = getQueryAtCursor(sel);
    if (queryInfo && /^[a-zA-Z0-9]+$/.test(queryInfo.query)) {
      showInlineSuggestion(state.activeEditor, queryInfo);
    } else {
      removeInlineSuggestion();
    }
  }
}

export function handleEditorKeydown(e) {
  if (e.isComposing) return;

  // ショートカットキー対応: Ctrl+Enter / Cmd+Enter で保存
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    removeInlineSuggestion();
    document.getElementById('save-btn').click();
    return;
  }

  // インラインサジェスト確定: Tab または右矢印キー（ドロップダウン非アクティブ時）
  if (!state.suggestionMode && state.inlineSuggestion && (e.key === 'Tab' || e.key === 'ArrowRight')) {
    e.preventDefault();
    acceptInlineSuggestion();
    return;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    removeInlineSuggestion();
    if (state.suggestionMode && state.filteredSuggestions.length > 0) {
      const selected = state.filteredSuggestions[state.suggestionIndex];
      insertTag(selected.name);
    } else {
      const currentRow = state.activeEditor.closest('.row');
      const newRow = addNewRow();
      currentRow.after(newRow);
      newRow.querySelector('.editor').focus();
    }
    return;
  }

  if (e.key === 'Backspace') {
    const sel = window.getSelection();
    if (sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      
      if (range.startOffset === 0 && range.startContainer === state.activeEditor || 
         (range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0 && range.startContainer.previousSibling === null)) {
        
        if (state.activeEditor.innerText.trim() === "") {
          const currentRow = state.activeEditor.closest('.row');
          const prevRow = currentRow.previousElementSibling;
          if (prevRow) {
            // 前の行がある場合は削除して移動
            e.preventDefault();
            currentRow.remove();
            updateEmptyState();
            const prevEditor = prevRow.querySelector('.editor');
            const newRange = document.createRange();
            newRange.selectNodeContents(prevEditor);
            newRange.collapse(false);
            sel.removeAllRanges();
            sel.addRange(newRange);
            prevEditor.focus();
          } else if (dom.container.children.length === 1) {
            // 最後の1行かつ空なら、Backspaceで削除するか？
            // ユーザー体験的には「クリア」で留まることが多いが
            // 明示的に削除したい場合はボタンを押してもらう。
            // ここでは空行削除は「前の行がある時」のみとする（既存仕様維持）
          }
          return;
        }
      }
    }
  }

  if (state.suggestionMode) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.suggestionIndex = (state.suggestionIndex > 0) ? state.suggestionIndex - 1 : state.filteredSuggestions.length - 1;
      renderSuggestions();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.suggestionIndex = (state.suggestionIndex < state.filteredSuggestions.length - 1) ? state.suggestionIndex + 1 : 0;
      renderSuggestions();
    } else if (e.key === 'Escape') {
      closeSuggestions();
      removeInlineSuggestion();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (state.filteredSuggestions.length > 0) {
        insertTag(state.filteredSuggestions[state.suggestionIndex].name);
      }
    }
  } else {
    // ドロップダウン非表示時: 通常の文字入力でインラインサジェストを消す
    if (state.inlineSuggestion && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      removeInlineSuggestion();
    } else if (e.key === 'Escape' && state.inlineSuggestion) {
      e.preventDefault();
      removeInlineSuggestion();
    }
  }
}

function getSelectionTextIncludingTags(editor) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return "";

  const range = sel.getRangeAt(0);
  const ancestor = range.commonAncestorContainer;
  const ancestorElement = ancestor.nodeType === Node.TEXT_NODE ? ancestor.parentNode : ancestor;
  if (!ancestorElement || !editor.contains(ancestorElement)) return "";

  const fragment = range.cloneContents();
  fragment.querySelectorAll('.inline-ghost').forEach(el => el.remove());
  fragment.querySelectorAll('.tag').forEach(tagEl => {
    const textNode = document.createTextNode(tagEl.textContent || "");
    tagEl.parentNode.replaceChild(textNode, tagEl);
  });

  const temp = document.createElement('div');
  temp.appendChild(fragment);
  return (temp.innerText || temp.textContent || "").replace(/\u00A0/g, ' ');
}

function copySelectionToClipboard(e, editor) {
  const text = getSelectionTextIncludingTags(editor);
  if (text === "") return false;
  if (!e.clipboardData) return false;

  e.preventDefault();
  e.clipboardData.setData('text/plain', text);
  return true;
}

export function handleEditorCopy(e) {
  copySelectionToClipboard(e, e.currentTarget);
}

export function handleEditorCut(e) {
  const editor = e.currentTarget;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

  const range = sel.getRangeAt(0);
  const copied = copySelectionToClipboard(e, editor);
  if (!copied) return;

  range.deleteContents();
  updateEditorEmptyState(editor);
  closeSuggestions();
  removeInlineSuggestion();
}

/**
 * タグ挿入 & 教科自動入力
 *
 * @param {string} text - ユーザー入力テキスト。"name;type" 形式でタイプを指定可能。
 *   name 中に ";" が含まれる場合は全角セミコロン "；" へサニタイズされる。
 * @param {boolean} [isAutoConfirm=false] - 自動確定フラグ
 */
export function insertTag(text, isAutoConfirm = false) {
  if (!state.queryStartRange) return;

  // --- name;type パース ---
  // 最初の ";" をデリミタとして name と type を分離する
  let tagName = text;
  let explicitType = null;
  const separatorIdx = text.indexOf(';');
  if (separatorIdx !== -1) {
    tagName = text.substring(0, separatorIdx);
    explicitType = text.substring(separatorIdx + 1).trim() || null;
  }

  // name 中に残存する ";" を全角セミコロンへサニタイズ
  tagName = tagName.replace(/;/g, '；');

  const sel = window.getSelection();
  const currentRange = sel.getRangeAt(0);
  
  const rangeToReplace = document.createRange();
  rangeToReplace.setStart(state.queryStartRange.startContainer, state.queryStartRange.startOffset);
  rangeToReplace.setEnd(currentRange.endContainer, currentRange.endOffset);
  rangeToReplace.deleteContents();

  const category = getCategory(tagName, explicitType);
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.dataset.type = category;
  tag.contentEditable = false;
  // 1字ずつ .char span に分解して挿入
  [...tagName].forEach(char => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;
    tag.appendChild(span);
  });
  
  rangeToReplace.insertNode(tag);
  
  // 変更点: IMEの不安定な挙動を防ぐため、NBSP(\u00A0)を使用し、
  // カーソルをテキストノードの「中（末尾）」に明示的に配置する
  const space = document.createTextNode('\u00A0');
  tag.after(space);
  
  const newRange = document.createRange();
  // setStartAfter(space) ではなく、テキストノードの1文字目(直後)を指定
  newRange.setStart(space, 1);
  newRange.setEnd(space, 1);
  
  sel.removeAllRanges();
  sel.addRange(newRange);
  
  // 念のためフォーカスを戻す
  if (state.activeEditor) state.activeEditor.focus();

  const subject = getSubject(tagName);
  if (subject && state.activeEditor) {
    const row = state.activeEditor.closest('.row');
    const select = row.querySelector('.subject-select');
    if (select && select.value === "") {
      select.value = subject;
    }
  }

  // エディタのプレースホルダー状態を更新
  if (state.activeEditor) updateEditorEmptyState(state.activeEditor);

  closeSuggestions();
}

