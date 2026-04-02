
import { state } from './state.js';
import { SUGGEST_DB } from './config.js';
import { insertTag } from './editor.js';

export function getQueryAtCursor(sel) {
  if (!sel.rangeCount) return null;
  const range = sel.getRangeAt(0);
  if (!range.collapsed) return null;
  if (range.startContainer.nodeType !== Node.TEXT_NODE) return null;

  const text = range.startContainer.textContent;
  const offset = range.startOffset;

  let start = offset;
  while (start > 0 && /[a-zA-Z0-9]/.test(text[start - 1])) {
    start--;
  }
  if (start === offset) return null;

  return {
    query: text.substring(start, offset),
    node: range.startContainer,
    startOffset: start,
    endOffset: offset
  };
}

export function showInlineSuggestion(editor, queryInfo) {
  removeInlineSuggestion();
  if (!queryInfo || !queryInfo.query) return;

  const { query, node, startOffset, endOffset } = queryInfo;
  const lowerQ = query.toLowerCase();

  // 名前前方一致 → 優先
  let bestMatch = SUGGEST_DB.find(item => item.name.toLowerCase().startsWith(lowerQ));
  // キーワード前方一致
  if (!bestMatch) {
    bestMatch = SUGGEST_DB.find(item =>
      item.keywords.some(k => k.toLowerCase().startsWith(lowerQ))
    );
  }
  if (!bestMatch) return;

  // ゴーストspan生成
  const ghost = document.createElement('span');
  ghost.className = 'inline-ghost';
  ghost.contentEditable = 'false';
  ghost.textContent = bestMatch.name;

  // カーソル位置 (queryの末尾) に挿入
  const insertRange = document.createRange();
  insertRange.setStart(node, endOffset);
  insertRange.collapse(true);
  insertRange.insertNode(ghost);

  // カーソルをゴーストの直前 (= queryの末尾) に戻す
  const sel = window.getSelection();
  const newRange = document.createRange();
  newRange.setStart(node, endOffset);
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange);

  state.inlineSuggestion = {
    ghostEl: ghost,
    fullName: bestMatch.name,
    queryNode: node,
    queryStartOffset: startOffset,
    queryEndOffset: endOffset
  };
}

export function removeInlineSuggestion() {
  if (state.inlineSuggestion && state.inlineSuggestion.ghostEl.parentNode) {
    state.inlineSuggestion.ghostEl.remove();
  }
  state.inlineSuggestion = null;
}

export function acceptInlineSuggestion() {
  if (!state.inlineSuggestion) return;

  const { ghostEl, fullName, queryNode, queryStartOffset, queryEndOffset } = state.inlineSuggestion;

  // ゴーストを先に削除
  if (ghostEl.parentNode) ghostEl.remove();
  state.inlineSuggestion = null;

  // state.queryStartRange を設定して insertTag に委譲
  const sel = window.getSelection();

  // カーソルを queryEnd に移動
  const endRange = document.createRange();
  endRange.setStart(queryNode, queryEndOffset);
  endRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(endRange);

  // state.queryStartRange = クエリ開始位置
  state.queryStartRange = document.createRange();
  state.queryStartRange.setStart(queryNode, queryStartOffset);
  state.queryStartRange.collapse(true);

  insertTag(fullName);
}

