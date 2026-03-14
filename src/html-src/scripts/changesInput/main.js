
import { state, dom } from './state.js';
import { addNewRow } from './row.js';
import { saveCommitRevision, closeSidebar } from '../changesInputApi.js';

// Setup initialization
window.onload = () => {
  addNewRow();
};

document.getElementById('add-row-btn').onclick = () => {
  addNewRow();
};

/**
 * 保存処理 (GAS連携)
 */
document.getElementById('save-btn').onclick = function() {
  const btn = this;
  btn.disabled = true;
  btn.textContent = '保存中...';
  
  const changes = [];
  const rowElements = dom.container.querySelectorAll('.row');
  
  rowElements.forEach(row => {
    const editor = row.querySelector('.editor');
    const select = row.querySelector('.subject-select');

    // 保存前にゴーストテキストを除去
    editor.querySelectorAll('.inline-ghost').forEach(g => g.remove());
    
    if (editor.innerText.trim() !== "" || editor.querySelector('.tag')) {
      const subject = select ? select.value : "";
      
      // コンテンツの変換処理: タグ(span)を <name;type> 形式に変換
      // name は insertTag 時にサニタイズ済みのため ";" を含まない
      const tempDiv = editor.cloneNode(true);
      const tags = tempDiv.querySelectorAll('.tag');
      tags.forEach(tagEl => {
        const tagName = tagEl.textContent;
        const tagType = tagEl.dataset.type || 'その他';
        const textNode = document.createTextNode(`<${tagName};${tagType}>`);
        tagEl.parentNode.replaceChild(textNode, tagEl);
      });
      
      // テキストとして取得
      let content = tempDiv.innerText;

      // NBSP(\u00A0)を通常のスペースに置換して正規化
      content = content.replace(/\u00A0/g, ' ');

      // 旧フォーム互換: 改行・カンマ区切りを分割して1件ずつ登録
      const parts = content
        .split(/[\n,]/)
        .map(part => part.trim())
        .filter(Boolean);

      parts.forEach(part => {
        changes.push([subject, part]);
      });

      // 区切りで分割されなかった場合（空白のみを除く）も1件として保持
      if (parts.length === 0 && content.trim() !== '') {
        changes.push([subject, content.trim()]);
      }
    }
  });

  if (changes.length === 0) {
    document.getElementById('status-msg').textContent = '保存する条件がありません';
    btn.disabled = false;
    btn.textContent = '保存';
    return;
  }

  saveCommitRevision(changes)
    .then(() => {
      document.getElementById('status-msg').textContent = '保存しました';
      setTimeout(() => closeSidebar(), 1000);
    })
    .catch((err) => {
      document.getElementById('status-msg').textContent = 'エラー: ' + err.message;
      btn.disabled = false;
      btn.textContent = '保存';
    });
};
