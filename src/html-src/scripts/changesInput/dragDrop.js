
import { state, dom } from './state.js';

/**
 * Drag & Drop
 */
export function handleDragStart(e) {
  const handle = e.target;
  const row = handle.closest('.row');
  if (!row) return;

  e.preventDefault();
  handle.setPointerCapture(e.pointerId);

  state.draggedRow = row;
  state.draggedRow.classList.add('dragging');

  state.dragPlaceholder = document.createElement('div');
  state.dragPlaceholder.className = 'row-placeholder';
  row.parentNode.insertBefore(state.dragPlaceholder, row);

  const startY = e.clientY;
  const rect = row.getBoundingClientRect();
  const offsetY = startY - rect.top;

  const onPointerMove = (moveEvent) => {
    const currentY = moveEvent.clientY;
    state.draggedRow.style.top = (currentY - dom.container.getBoundingClientRect().top - offsetY) + 'px';
    
    const siblings = [...dom.container.children].filter(c => c !== state.draggedRow && c !== state.dragPlaceholder);
    const hit = siblings.find(sib => {
      const r = sib.getBoundingClientRect();
      return currentY >= r.top && currentY <= r.bottom;
    });

    if (hit) {
      const rect = hit.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (currentY < mid) {
        dom.container.insertBefore(state.dragPlaceholder, hit);
      } else {
        dom.container.insertBefore(state.dragPlaceholder, hit.nextSibling);
      }
    }
  };

  const onPointerUp = (upEvent) => {
    handle.releasePointerCapture(upEvent.pointerId);
    handle.removeEventListener('pointermove', onPointerMove);
    handle.removeEventListener('pointerup', onPointerUp);

    dom.container.insertBefore(state.draggedRow, state.dragPlaceholder);
    state.dragPlaceholder.remove();
    state.draggedRow.classList.remove('dragging');
    state.draggedRow.style.top = '';
    state.draggedRow.style.position = '';
    
    state.draggedRow = null;
    state.dragPlaceholder = null;
  };

  handle.addEventListener('pointermove', onPointerMove);
  handle.addEventListener('pointerup', onPointerUp);
}


