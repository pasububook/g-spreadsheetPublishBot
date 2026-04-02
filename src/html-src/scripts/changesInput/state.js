
export const state = {
  draggedRow: null,
  dragPlaceholder: null,
  activeEditor: null,
  suggestionMode: false,
  suggestionTrigger: null,
  suggestionIndex: 0,
  filteredSuggestions: [],
  queryStartRange: null,
  inlineSuggestion: null
};
export const dom = {
  get container() { return document.getElementById('list-container'); },
  get emptyState() { return document.getElementById('empty-state'); },
  get suggestionBox() { return document.getElementById('suggestion-box'); }
};
