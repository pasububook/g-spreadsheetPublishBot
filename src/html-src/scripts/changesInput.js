/**
 * 定義済みデータ
 */
const TAG_CATEGORIES = {
  "教科書": { color: "#2E86C1", bg: "#D6EAF8" },
  "資料集": { color: "#27AE60", bg: "#D5F5E3" },
  "ワーク": { color: "#E67E22", bg: "#FAE5D3" },
  "プリント": { color: "#884EA0", bg: "#E8DAEF" },
  "その他": { color: "#7F8C8D", bg: "#F2F4F4" }
};

/**
 * SUBJECT_LIST
 * 利用可能な教科の正式名称リスト (テスト用)
 */
const SUBJECT_LIST = [
  "国語/現代文α",
  "国語/古文漢文β",
  "数学/数学III演習",
  "理科/生物基礎",
  "社会/世界史探求",
  "英語/リーディングIII",
  "英語/ライティング入門"
];

/**
 * SUGGEST_DB
 * タグ入力時のサジェスト候補、および教科情報の自動入力用データベース (テスト用)
 */
const SUGGEST_DB = [
  // ==========================================
  // 国語/現代文α
  // ==========================================
  {
    name: "1",
    type: "教科書",
    subject: "国語/現代文α",
    keywords: [
      "seisen", "gendai", "kaiteiban",
      "s", "g",
      "せいせん", "げんだい", "かいていばん", "いちもじ"
    ]
  },
  {
    name: "ステップアップ現代文",
    type: "ワーク",
    subject: "国語/現代文α",
    keywords: [
      "stepup", "step", "gendai",
      "s", "g",
      "すてっぷ", "げんだい"
    ]
  },
  {
    name: "読解力養成プリント",
    type: "プリント",
    subject: "国語/現代文α",
    keywords: [
      "dokkai", "yousei", "print",
      "d", "y", "p",
      "どっかい", "ようせい", "ぷりんと"
    ]
  },

  // ==========================================
  // 国語/古文漢文β
  // ==========================================
  {
    name: "新訂 古典文学選",
    type: "教科書",
    subject: "国語/古文漢文β",
    keywords: [
      "shintei", "koten", "bungaku",
      "s", "k", "b",
      "しんてい", "こてん", "ぶんがく"
    ]
  },
  {
    name: "漢文句法ドリル",
    type: "ワーク",
    subject: "国語/古文漢文β",
    keywords: [
      "kanbun", "kubou", "drill",
      "k", "d",
      "かんぶん", "くほう", "どりる"
    ]
  },

  // ==========================================
  // 数学/数学III演習
  // ==========================================
  {
    name: "体系数学 解析編",
    type: "教科書",
    subject: "数学/数学III演習",
    keywords: [
      "taikei", "kaiseki", "math",
      "t", "k", "m",
      "たいけい", "かいせき", "すうがく"
    ]
  },
  {
    name: "NEW ACTION LEGEND 数III",
    type: "ワーク",
    subject: "数学/数学III演習",
    keywords: [
      "new", "action", "legend", "nal",
      "n", "a", "l",
      "にゅーあくしょん", "れじぇんど"
    ]
  },
  {
    name: "微積分特訓プリント",
    type: "プリント",
    subject: "数学/数学III演習",
    keywords: [
      "biseki", "tokkun", "print",
      "b", "t", "p",
      "びせきぶん", "とっくん", "ぷりんと"
    ]
  },

  // ==========================================
  // 理科/生物基礎
  // ==========================================
  {
    name: "改訂版 生物基礎",
    type: "教科書",
    subject: "理科/生物基礎",
    keywords: [
      "seibutsu", "kiso", "biology",
      "s", "k", "b",
      "せいぶつ", "きそ", "ばいおろじー"
    ]
  },
  {
    name: "生物基礎図説ニューステージ",
    type: "資料集",
    subject: "理科/生物基礎",
    keywords: [
      "zusetu", "newstage", "new",
      "z", "n",
      "ずせつ", "にゅーすてーじ"
    ]
  },
  {
    name: "センター対策生物問題集",
    type: "ワーク",
    subject: "理科/生物基礎",
    keywords: [
      "center", "mondai", "biology",
      "c", "m", "b",
      "せんたー", "もんだい", "せいぶつ"
    ]
  },

  // ==========================================
  // 社会/世界史探求
  // ==========================================
  {
    name: "詳説世界史 B",
    type: "教科書",
    subject: "社会/世界史探求",
    keywords: [
      "shousetu", "sekaishi", "b",
      "s", "b",
      "しょうせつ", "せかいし"
    ]
  },
  {
    name: "世界史図録ヴィジュアルワイド",
    type: "資料集",
    subject: "社会/世界史探求",
    keywords: [
      "zuroku", "visual", "wide",
      "z", "v", "w",
      "ずろく", "びじゅある", "わいど"
    ]
  },
  {
    name: "一問一答 世界史ターゲット",
    type: "ワーク",
    subject: "社会/世界史探求",
    keywords: [
      "ichimon", "ichitou", "target",
      "i", "t",
      "いちもん", "いちとう", "たーげっと"
    ]
  },

  // ==========================================
  // 英語/リーディングIII
  // ==========================================
  {
    name: "CROWN English Reading III",
    type: "教科書",
    subject: "英語/リーディングIII",
    keywords: [
      "crown", "english", "reading",
      "c", "e", "r",
      "くらうん", "りーでぃんぐ"
    ]
  },
  {
    name: "速読英熟語",
    type: "ワーク",
    subject: "英語/リーディングIII",
    keywords: [
      "sokudoku", "jukugo", "reading",
      "s", "j",
      "そくどく", "えいじゅくご"
    ]
  },

  // ==========================================
  // 英語/ライティング入門
  // ==========================================
  {
    name: "POLESTAR Writing",
    type: "教科書",
    subject: "英語/ライティング入門",
    keywords: [
      "polestar", "writing", "pole",
      "p", "w",
      "ぽーるすたー", "らいてぃんぐ"
    ]
  },
  {
    name: "英作文トレーニング Basic",
    type: "ワーク",
    subject: "英語/ライティング入門",
    keywords: [
      "eisakubun", "training", "basic",
      "e", "t", "b",
      "えいさくぶん", "とれーにんぐ", "べーしっく"
    ]
  },
  {
    name: "英語表現 補助プリント集 すごくすごくすごくすごく長い",
    type: "プリント",
    subject: "英語/ライティング入門",
    keywords: [
      "hojo", "print", "hyogen",
      "h", "p",
      "ほじょ", "えいごひょうげん", "ぷりんと"
    ]
  }
];

function getCategory(name, explicitType) {
  if (explicitType && TAG_CATEGORIES[explicitType]) return explicitType;
  const hit = SUGGEST_DB.find(d => d.name === name);
  if (hit && TAG_CATEGORIES[hit.type]) return hit.type;
  return "その他";
}

function getSubject(name) {
  const hit = SUGGEST_DB.find(d => d.name === name);
  return hit ? hit.subject : null;
}

/**
 * アプリケーション状態管理
 */
let draggedRow = null;
let dragPlaceholder = null;
let activeEditor = null;
let suggestionMode = false;
let suggestionTrigger = null; 
let suggestionIndex = 0;
let filteredSuggestions = [];
let queryStartRange = null;
let inlineSuggestion = null; // { ghostEl, fullName, queryNode, queryStartOffset, queryEndOffset }

const container = document.getElementById('list-container');
const emptyState = document.getElementById('empty-state');
const suggestionBox = document.getElementById('suggestion-box');

// 初期化
window.onload = () => {
  addNewRow();
};

// リストの表示状態更新（Empty State制御）
function updateEmptyState() {
  if (container.children.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'flex';
  } else {
    container.style.display = 'block';
    emptyState.style.display = 'none';
  }
}

// エディタのプレースホルダー表示制御
function updateEditorEmptyState(editor) {
  const hasTag = editor.querySelector('.tag') !== null;
  const text = editor.innerText.replace(/\u00A0/g, ' ').trim();
  editor.classList.toggle('is-empty', !hasTag && text === '');
}

/**
 * インラインサジェスト処理
 */
function getQueryAtCursor(sel) {
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

function showInlineSuggestion(editor, queryInfo) {
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

  inlineSuggestion = {
    ghostEl: ghost,
    fullName: bestMatch.name,
    queryNode: node,
    queryStartOffset: startOffset,
    queryEndOffset: endOffset
  };
}

function removeInlineSuggestion() {
  if (inlineSuggestion && inlineSuggestion.ghostEl.parentNode) {
    inlineSuggestion.ghostEl.remove();
  }
  inlineSuggestion = null;
}

function acceptInlineSuggestion() {
  if (!inlineSuggestion) return;

  const { ghostEl, fullName, queryNode, queryStartOffset, queryEndOffset } = inlineSuggestion;

  // ゴーストを先に削除
  if (ghostEl.parentNode) ghostEl.remove();
  inlineSuggestion = null;

  // queryStartRange を設定して insertTag に委譲
  const sel = window.getSelection();

  // カーソルを queryEnd に移動
  const endRange = document.createRange();
  endRange.setStart(queryNode, queryEndOffset);
  endRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(endRange);

  // queryStartRange = クエリ開始位置
  queryStartRange = document.createRange();
  queryStartRange.setStart(queryNode, queryStartOffset);
  queryStartRange.collapse(true);

  insertTag(fullName);
}

/**
 * リスト操作: 行の作成
 */
function addNewRow(initialHtml = "", initialSubject = "") {
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
  editor.addEventListener('focus', () => { activeEditor = editor; });
  editor.addEventListener('keydown', handleEditorKeydown);
  editor.addEventListener('input', handleEditorInput);
  editor.addEventListener('blur', () => {
    setTimeout(() => {
      if (!suggestionBox.matches(':hover')) closeSuggestions();
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

  container.appendChild(rowDiv);

  // 初期状態でプレースホルダーを表示
  updateEditorEmptyState(editor);

  updateEmptyState();
  editor.focus();
  return rowDiv;
}

/**
 * テキスト編集とタグ機能
 */
function handleEditorInput(e) {
  if (!activeEditor) return;

  // プレースホルダーの表示を更新
  updateEditorEmptyState(activeEditor);

  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  
  const text = activeEditor.innerText;
  const range = sel.getRangeAt(0);
  const startOffset = range.startOffset;
  const rangeContainer = range.startContainer;
  
  if (rangeContainer.nodeType === Node.TEXT_NODE) {
    const textContent = rangeContainer.textContent;
    const charBefore = textContent[startOffset - 1];
    
    if (["<", "＜", "`", "@"].includes(charBefore)) {
      removeInlineSuggestion();
      suggestionMode = true;
      suggestionTrigger = charBefore; 
      queryStartRange = range.cloneRange();
      queryStartRange.setStart(rangeContainer, startOffset - 1);
      showSuggestions("");
      return;
    }

    if (suggestionMode && suggestionTrigger !== "@" && [">", "＞", "`"].includes(charBefore)) {
       // 自動確定ロジック
    }
  }

  if (suggestionMode && queryStartRange) {
    const currentRange = sel.getRangeAt(0);
    if (currentRange.startContainer === queryStartRange.startContainer) {
      const queryText = currentRange.startContainer.textContent.substring(
        queryStartRange.startOffset + 1,
        currentRange.startOffset
      );
      
      if (suggestionTrigger !== "@") {
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
  if (!suggestionMode) {
    const queryInfo = getQueryAtCursor(sel);
    if (queryInfo && /^[a-zA-Z0-9]+$/.test(queryInfo.query)) {
      showInlineSuggestion(activeEditor, queryInfo);
    } else {
      removeInlineSuggestion();
    }
  }
}

function handleEditorKeydown(e) {
  if (e.isComposing) return;

  // ショートカットキー対応: Ctrl+Enter / Cmd+Enter で保存
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    removeInlineSuggestion();
    document.getElementById('save-btn').click();
    return;
  }

  // インラインサジェスト確定: Tab または右矢印キー（ドロップダウン非アクティブ時）
  if (!suggestionMode && inlineSuggestion && (e.key === 'Tab' || e.key === 'ArrowRight')) {
    e.preventDefault();
    acceptInlineSuggestion();
    return;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    removeInlineSuggestion();
    if (suggestionMode && filteredSuggestions.length > 0) {
      const selected = filteredSuggestions[suggestionIndex];
      insertTag(selected.name);
    } else {
      const currentRow = activeEditor.closest('.row');
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
      
      if (range.startOffset === 0 && range.startContainer === activeEditor || 
         (range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0 && range.startContainer.previousSibling === null)) {
        
        if (activeEditor.innerText.trim() === "") {
          const currentRow = activeEditor.closest('.row');
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
          } else if (container.children.length === 1) {
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

  if (suggestionMode) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      suggestionIndex = (suggestionIndex > 0) ? suggestionIndex - 1 : filteredSuggestions.length - 1;
      renderSuggestions();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      suggestionIndex = (suggestionIndex < filteredSuggestions.length - 1) ? suggestionIndex + 1 : 0;
      renderSuggestions();
    } else if (e.key === 'Escape') {
      closeSuggestions();
      removeInlineSuggestion();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        insertTag(filteredSuggestions[suggestionIndex].name);
      }
    }
  } else {
    // ドロップダウン非表示時: 通常の文字入力でインラインサジェストを消す
    if (inlineSuggestion && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      removeInlineSuggestion();
    } else if (e.key === 'Escape' && inlineSuggestion) {
      e.preventDefault();
      removeInlineSuggestion();
    }
  }
}

/**
 * タグ挿入 & 教科自動入力
 *
 * @param {string} text - ユーザー入力テキスト。"name;type" 形式でタイプを指定可能。
 *   name 中に ";" が含まれる場合は全角セミコロン "；" へサニタイズされる。
 * @param {boolean} [isAutoConfirm=false] - 自動確定フラグ
 */
function insertTag(text, isAutoConfirm = false) {
  if (!queryStartRange) return;

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
  rangeToReplace.setStart(queryStartRange.startContainer, queryStartRange.startOffset);
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
  if (activeEditor) activeEditor.focus();

  const subject = getSubject(tagName);
  if (subject && activeEditor) {
    const row = activeEditor.closest('.row');
    const select = row.querySelector('.subject-select');
    if (select && select.value === "") {
      select.value = subject;
    }
  }

  // エディタのプレースホルダー状態を更新
  if (activeEditor) updateEditorEmptyState(activeEditor);

  closeSuggestions();
}

/**
 * サジェスト処理
 */
function showSuggestions(query) {
  const lowerQ = query.toLowerCase();
  
  if (query === "") {
    filteredSuggestions = SUGGEST_DB;
  } else {
    filteredSuggestions = SUGGEST_DB.filter(item => {
      if (item.name.toLowerCase().includes(lowerQ)) return true;
      return item.keywords.some(k => k.toLowerCase().startsWith(lowerQ));
    });
  }
  
  if (query !== "" && suggestionTrigger !== "@") {
    const exists = filteredSuggestions.some(i => i.name === query);
    if (!exists) {
      // name;type 形式のクエリからタイプをプレビュー
      let previewType = "その他";
      const sepIdx = query.indexOf(';');
      if (sepIdx !== -1) {
        const parsedType = query.substring(sepIdx + 1).trim();
        if (parsedType && TAG_CATEGORIES[parsedType]) previewType = parsedType;
      }
      filteredSuggestions.push({ name: query, type: previewType, isNew: true });
    }
  }

  suggestionIndex = 0;
  if (filteredSuggestions.length === 0) {
    suggestionBox.style.display = 'none';
  } else {
    renderSuggestions();
    positionSuggestionBox();
  }
}

function renderSuggestions() {
  suggestionBox.innerHTML = '';
  filteredSuggestions.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'suggestion-item' + (idx === suggestionIndex ? ' selected' : '');
    div.onmousedown = (e) => {
      e.preventDefault();
      insertTag(item.name);
    };
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = item.name;
    
    const metaDiv = document.createElement('div');
    metaDiv.style.display = 'flex';
    metaDiv.style.gap = '4px';

    if (item.subject) {
       const subSpan = document.createElement('span');
       subSpan.className = 's-cat';
       subSpan.style.backgroundColor = '#e8f0fe';
       subSpan.style.color = '#1967d2';
       subSpan.textContent = item.subject;
       metaDiv.appendChild(subSpan);
    }

    const typeSpan = document.createElement('span');
    typeSpan.className = 's-cat';
    typeSpan.textContent = item.isNew ? "新規" : item.type;
    
    if (!item.isNew && TAG_CATEGORIES[item.type]) {
      const catStyle = TAG_CATEGORIES[item.type];
      typeSpan.style.backgroundColor = catStyle.bg;
      typeSpan.style.color = catStyle.color;
    }

    metaDiv.appendChild(typeSpan);
    
    div.appendChild(nameSpan);
    div.appendChild(metaDiv);
    suggestionBox.appendChild(div);
  });
  suggestionBox.style.display = 'block';
  
  const selectedEl = suggestionBox.children[suggestionIndex];
  if (selectedEl) {
    if (selectedEl.offsetTop < suggestionBox.scrollTop) {
      suggestionBox.scrollTop = selectedEl.offsetTop;
    } else if (selectedEl.offsetTop + selectedEl.offsetHeight > suggestionBox.scrollTop + suggestionBox.offsetHeight) {
      suggestionBox.scrollTop = selectedEl.offsetTop + selectedEl.offsetHeight - suggestionBox.offsetHeight;
    }
  }
}

function closeSuggestions() {
  suggestionMode = false;
  suggestionTrigger = null; 
  suggestionBox.style.display = 'none';
  queryStartRange = null;
}

function positionSuggestionBox() {
  const sel = window.getSelection();
  if (sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0).cloneRange();
  const rect = range.getBoundingClientRect();
  
  let top = rect.bottom + 5;
  if (top + 200 > window.innerHeight) {
    top = rect.top - 205;
  }
  
  suggestionBox.style.top = top + 'px';
  suggestionBox.style.left = Math.min(rect.left, window.innerWidth - 300) + 'px';
}

/**
 * Drag & Drop
 */
function handleDragStart(e) {
  const handle = e.target;
  const row = handle.closest('.row');
  if (!row) return;

  e.preventDefault();
  handle.setPointerCapture(e.pointerId);

  draggedRow = row;
  draggedRow.classList.add('dragging');

  dragPlaceholder = document.createElement('div');
  dragPlaceholder.className = 'row-placeholder';
  row.parentNode.insertBefore(dragPlaceholder, row);

  const startY = e.clientY;
  const rect = row.getBoundingClientRect();
  const offsetY = startY - rect.top;

  const onPointerMove = (moveEvent) => {
    const currentY = moveEvent.clientY;
    draggedRow.style.top = (currentY - container.getBoundingClientRect().top - offsetY) + 'px';
    
    const siblings = [...container.children].filter(c => c !== draggedRow && c !== dragPlaceholder);
    const hit = siblings.find(sib => {
      const r = sib.getBoundingClientRect();
      return currentY >= r.top && currentY <= r.bottom;
    });

    if (hit) {
      const rect = hit.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (currentY < mid) {
        container.insertBefore(dragPlaceholder, hit);
      } else {
        container.insertBefore(dragPlaceholder, hit.nextSibling);
      }
    }
  };

  const onPointerUp = (upEvent) => {
    handle.releasePointerCapture(upEvent.pointerId);
    handle.removeEventListener('pointermove', onPointerMove);
    handle.removeEventListener('pointerup', onPointerUp);

    container.insertBefore(draggedRow, dragPlaceholder);
    dragPlaceholder.remove();
    draggedRow.classList.remove('dragging');
    draggedRow.style.top = '';
    draggedRow.style.position = '';
    
    draggedRow = null;
    dragPlaceholder = null;
  };

  handle.addEventListener('pointermove', onPointerMove);
  handle.addEventListener('pointerup', onPointerUp);
}

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
  const rowElements = container.querySelectorAll('.row');
  
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

  google.script.run
    .withSuccessHandler(() => {
      document.getElementById('status-msg').textContent = '保存しました';
      setTimeout(() => google.script.host.close(), 1000);
    })
    .withFailureHandler((err) => {
      document.getElementById('status-msg').textContent = 'エラー: ' + err.message;
      btn.disabled = false;
      btn.textContent = '保存';
    })
    .saveCommitRevision(changes);
};