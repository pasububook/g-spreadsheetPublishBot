
import { dom } from './state.js';
export function updateEmptyState() {
  if (dom.container.children.length === 0) {
    dom.container.style.display = 'none';
    dom.emptyState.style.display = 'flex';
  } else {
    dom.container.style.display = 'block';
    dom.emptyState.style.display = 'none';
  }
}

// エディタのプレースホルダー表示制御
export function updateEditorEmptyState(editor) {
  const hasTag = editor.querySelector('.tag') !== null;
  const text = editor.innerText.replace(/\u00A0/g, ' ').trim();
  editor.classList.toggle('is-empty', !hasTag && text === '');
}

