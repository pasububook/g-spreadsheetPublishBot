
import { state, dom } from './state.js';
import { SUGGEST_DB, getCategory, KNOWN_TYPES } from './config.js';
import { insertTag } from './editor.js';

export function showSuggestions(query) {
  const lowerQ = query.toLowerCase();
  
  if (query === "") {
    state.filteredSuggestions = SUGGEST_DB;
  } else {
    state.filteredSuggestions = SUGGEST_DB.filter(item => {
      if (item.name.toLowerCase().includes(lowerQ)) return true;
      return item.keywords.some(k => k.toLowerCase().startsWith(lowerQ));
    });
  }
  
  if (query !== "" && state.suggestionTrigger !== "@") {
    const exists = state.filteredSuggestions.some(i => i.name === query);
    if (!exists) {
      // name;type 形式のクエリからタイプをプレビュー
      let previewType = "その他";
      const sepIdx = query.indexOf(';');
      if (sepIdx !== -1) {
        const parsedType = query.substring(sepIdx + 1).trim();
        if (parsedType && KNOWN_TYPES.includes(parsedType)) previewType = parsedType;
      }
      state.filteredSuggestions.push({ name: query, type: previewType, isNew: true });
    }
  }

  state.suggestionIndex = 0;
  if (state.filteredSuggestions.length === 0) {
    dom.suggestionBox.style.display = 'none';
  } else {
    renderSuggestions();
    positionSuggestionBox();
  }
}

export function renderSuggestions() {
  dom.suggestionBox.innerHTML = '';
  state.filteredSuggestions.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'suggestion-item' + (idx === state.suggestionIndex ? ' selected' : '');
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
    if (!item.isNew) typeSpan.dataset.type = item.type;
    typeSpan.textContent = item.isNew ? "新規" : item.type;

    metaDiv.appendChild(typeSpan);
    
    div.appendChild(nameSpan);
    div.appendChild(metaDiv);
    dom.suggestionBox.appendChild(div);
  });
  dom.suggestionBox.style.display = 'block';
  
  const selectedEl = dom.suggestionBox.children[state.suggestionIndex];
  if (selectedEl) {
    if (selectedEl.offsetTop < dom.suggestionBox.scrollTop) {
      dom.suggestionBox.scrollTop = selectedEl.offsetTop;
    } else if (selectedEl.offsetTop + selectedEl.offsetHeight > dom.suggestionBox.scrollTop + dom.suggestionBox.offsetHeight) {
      dom.suggestionBox.scrollTop = selectedEl.offsetTop + selectedEl.offsetHeight - dom.suggestionBox.offsetHeight;
    }
  }
}

export function closeSuggestions() {
  state.suggestionMode = false;
  state.suggestionTrigger = null; 
  dom.suggestionBox.style.display = 'none';
  state.queryStartRange = null;
}

export function positionSuggestionBox() {
  const sel = window.getSelection();
  if (sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0).cloneRange();
  const rect = range.getBoundingClientRect();
  
  let top = rect.bottom + 5;
  if (top + 200 > window.innerHeight) {
    top = rect.top - 205;
  }
  
  dom.suggestionBox.style.top = top + 'px';
  dom.suggestionBox.style.left = Math.min(rect.left, window.innerWidth - 300) + 'px';
}


