export function escHtml(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

export function fmt1(n) {
  const v = Number(n);
  if (!isFinite(v)) return '0';
  return (Math.round(v * 10) / 10).toString();
}

export function showLoading(container) {
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'loading-overlay';
  el.id = '__loading';
  el.innerHTML = '<div class="spinner"></div>';
  const pos = getComputedStyle(container).position;
  if (pos === 'static') container.style.position = 'relative';
  container.appendChild(el);
  return el;
}

export function hideLoading() {
  const el = document.getElementById('__loading');
  if (el) el.remove();
}
