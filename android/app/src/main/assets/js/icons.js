// 集合 LiveHub — 图标系统 v1
// 设计语言：深色克制 · 科技风
// 统一规范：24×24 视图网格 / 1.8 描边 / round 端点 / currentColor 着色
// 用法：import { icon } from './icons.js';
//       el.innerHTML = icon('home', { size: 24, className: 'nav-ico' });

const P = {
  // —— 底部导航 ——
  home: '<path d="M3 10.2 12 3l9 7.2"/><path d="M5.2 9.3V20a1 1 0 0 0 1 1h11.6a1 1 0 0 0 1-1V9.3"/><path d="M9.3 21v-6.2a1 1 0 0 1 1-1h3.4a1 1 0 0 1 1 1V21"/>',
  life: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  sport: '<path d="M4 9.2v5.6"/><path d="M6.4 7.2v9.6"/><path d="M17.6 7.2v9.6"/><path d="M20 9.2v5.6"/><path d="M6.4 12h11.2"/>',
  learn: '<path d="M12 5.5C9.8 4.3 6.8 4 4 4.4v13.4c2.8-.4 5.8-.1 8 1.1"/><path d="M12 5.5c2.2-1.2 5.2-1.5 8-1.1v13.4c-2.8-.4-5.8-.1-8 1.1"/><line x1="12" y1="5.5" x2="12" y2="18.9"/>',

  // —— 操作 ——
  add: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  search: '<circle cx="11" cy="11" r="6.2"/><line x1="15.2" y1="15.2" x2="20" y2="20"/>',
  settings: '<line x1="4" y1="7" x2="13" y2="7"/><circle cx="16" cy="7" r="2.3"/><line x1="4" y1="12" x2="9" y2="12"/><circle cx="13" cy="12" r="2.3"/><line x1="4" y1="17" x2="13" y2="17"/><circle cx="16" cy="17" r="2.3"/>',
  list: '<line x1="8" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="18" x2="20" y2="18"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  upload: '<path d="M12 15V4"/><path d="M8 8l4-4 4 4"/><path d="M5 20h14"/>',
  download: '<path d="M12 4v11"/><path d="M8 12l4 4 4-4"/><path d="M5 20h14"/>',
  edit: '<path d="M4 20h3.5L18 9.5l-3.5-3.5L4 16.5z"/><line x1="13.5" y1="6.5" x2="17" y2="10"/>',
  trash: '<path d="M5 7h14"/><path d="M9.5 7V5h5v2"/><path d="M7 7l1 13h8l1-13"/><line x1="10" y1="10.5" x2="10" y2="16.5"/><line x1="14" y1="10.5" x2="14" y2="16.5"/>',
  close: '<line x1="6.5" y1="6.5" x2="17.5" y2="17.5"/><line x1="17.5" y1="6.5" x2="6.5" y2="17.5"/>',

  // —— 内容 / 状态 ——
  check: '<path d="M5 12.5 10 17 19 6.8"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><line x1="3.5" y1="9.5" x2="20.5" y2="9.5"/><line x1="8" y1="3" x2="8" y2="6.5"/><line x1="16" y1="3" x2="16" y2="6.5"/>',
  camera: '<rect x="3.5" y="7" width="17" height="12" rx="3"/><circle cx="12" cy="13" r="3.4"/><path d="M8.5 7 10 4.5h4L15.5 7"/>',
  book: '<path d="M5 4.5h11a2 2 0 0 1 2 2v12.5H7a2 2 0 0 0-2 2V4.5z"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="11.5" x2="15" y2="11.5"/>',
  star: '<path d="M12 4.2l2.3 4.7 5.1.7-3.7 3.6.9 5.1L12 16.9l-4.6 2.4.9-5.1L4.6 9.6l5.1-.7z"/>',
  tag: '<path d="M3.5 11.5 11 4h7v7l-7.5 7.5a1.6 1.6 0 0 1-2.3 0l-4.7-4.7a1.6 1.6 0 0 1 0-2.3z"/><circle cx="14.5" cy="9.5" r="1.4"/>',
  fire: '<path d="M13 3c.5 3-2 4-2 6 0 1 1 1.6 1.4 1.1C13.6 9 14.5 7.5 14.5 7.5c1.8 1.8 2.8 4.2 2.8 6.5a5.2 5.2 0 1 1-10.4 0c0-2 1-3.6 2.2-4.8.3 1.4 1.4 2 1.4 2 .4-2-1.2-3.8 1.5-7.7.4-.4 1-1 1.6-1.2z"/>',
  chart: '<line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="11" width="3" height="9" rx="1"/><rect x="11" y="6" width="3" height="14" rx="1"/><rect x="16" y="14" width="3" height="6" rx="1"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7.8V12l3.2 1.9"/>',
  heart: '<path d="M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 7.5a4 4 0 0 1 7 3.2C19 15.6 12 20 12 20z"/>',
  chevron: '<path d="M9 5.5 16 12l-7 6.5"/>',
  more: '<circle cx="5.5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18.5" cy="12" r="1.5"/>',
};

const NAV = [
  { name: 'home', cn: '首页', en: 'Home' },
  { name: 'life', cn: '生活', en: 'Life' },
  { name: 'sport', cn: '运动', en: 'Sport' },
  { name: 'learn', cn: '学习', en: 'Learn' },
];

export function icon(name, { size = 24, className = '' } = {}) {
  const inner = P[name] || '';
  return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

export { P, NAV };
export default P;
