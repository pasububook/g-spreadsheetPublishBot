
import { state, dom } from './state.js';
import { SUBJECT_LIST } from './constants.js';
import { updateEmptyState, updateEditorEmptyState } from './ui.js';
import { handleDragStart } from './dragDrop.js';
import { handleEditorInput, handleEditorKeydown, handleEditorCopy, handleEditorCut } from './editor.js';
import { closeSuggestions } from './suggestions.js';
import { removeInlineSuggestion } from './inlineSuggestion.js';

export function addNewRow(initialHtml = "", initialSubject = "") {
  const id = "row-" + Date.now() + Math.random().toString(36).substr(2, 9);
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row';
  rowDiv.id = id;
  
  // Drag Handle (透明な領域として残す)
  const handle = document.createElement('span');
  handle.className = 'handle'; 
  handle.onpointerdown = handleDragStart;

  // Subject Select
  const select = document.createElement('select');
  select.className = 'subject-select';
  
  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.text = "教科";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.hidden = true;
  select.appendChild(defaultOption);

  SUBJECT_LIST.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.text = sub;
    if (sub === initialSubject) opt.selected = true;
    select.appendChild(opt);
  });
  
  if (initialSubject) select.value = initialSubject;

  // 教科選択時のショートカットキー対応
  select.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      document.getElementById('save-btn').click();
    }
  });

  // Editor
  const editor = document.createElement('div');
  editor.className = 'editor';
  editor.contentEditable = true;
  editor.setAttribute('placeholder', '条件を入力... (<, @ でタグ追加)');
  editor.innerHTML = initialHtml;
  
  // Events
  editor.addEventListener('focus', () => { state.activeEditor = editor; });
  editor.addEventListener('keydown', handleEditorKeydown);
  editor.addEventListener('input', handleEditorInput);
  editor.addEventListener('copy', handleEditorCopy);
  editor.addEventListener('cut', handleEditorCut);
  editor.addEventListener('blur', () => {
    setTimeout(() => {
      if (!dom.suggestionBox.matches(':hover')) closeSuggestions();
      removeInlineSuggestion();
    }, 200);
  });

  // Delete Button
  const delBtn = document.createElement('span');
  delBtn.className = 'icon-btn btn-delete material-symbols-outlined';
  delBtn.textContent = 'close';
  delBtn.onclick = () => {
    // 常に削除可能に変更
    rowDiv.remove();
    updateEmptyState();
  };

  rowDiv.appendChild(handle);
  rowDiv.appendChild(select); 
  rowDiv.appendChild(editor);
  rowDiv.appendChild(delBtn);

  dom.container.appendChild(rowDiv);

  // 初期状態でプレースホルダーを表示
  updateEditorEmptyState(editor);

  updateEmptyState();
  editor.focus();
  return rowDiv;
}

