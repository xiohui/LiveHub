import { Store } from '../store.js';
import { icon } from '../icons.js';
import { escHtml, showLoading, hideLoading } from '../utils.js';

let $el = null;

function dayNames() { return ['日','一','二','三','四','五','六']; }
function greeting() {
  const h = new Date().getHours();
  if (h < 6) return '夜深了';
  if (h < 9) return '早上好';
  if (h < 12) return '上午好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}
function dateStr() {
  const d = new Date();
  const weekdays = ['日','一','二','三','四','五','六'];
  const months = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
  return `${months[d.getMonth()]}月${d.getDate()}日 周${weekdays[d.getDay()]}`;
}

function emojiForWeather() {
  const h = new Date().getHours();
  if (h < 6 || h >= 19) return '🌙';
  return '☀️';
}

async function render() {
  const data = await Store.getDashboardData();
  const html = `
    <div class="page active" id="page-home">
      <div class="page-inner">
        <div class="bg-deco"><div class="orb orb-1"></div><div class="orb orb-2"></div></div>
        <div class="page-scroll">
          <div class="page-header">
            <div>
              <h1>集合</h1>
              <div class="sub">${greeting()} · ${dateStr()} ${emojiForWeather()}</div>
            </div>
            <div class="avatar-btn" id="btn-settings">${icon('settings')}</div>
          </div>

          <div class="stats-row">
            <div class="glass stat-card">
              <div class="num cyan">${data.pendingTodos}</div>
              <div class="label">待办事项</div>
            </div>
            <div class="glass stat-card">
              <div class="num green">${data.todayWorkouts}</div>
              <div class="label">今日运动</div>
            </div>
            <div class="glass stat-card">
              <div class="num purple">${data.totalProgress}%</div>
              <div class="label">阅读进度</div>
            </div>
          </div>

          <div class="quick-actions">
            <button class="qa-item" data-action="todo"><div class="qa-icon">${icon('list')}</div><span>新建待办</span></button>
            <button class="qa-item" data-action="sport"><div class="qa-icon">${icon('sport')}</div><span>运动打卡</span></button>
            <button class="qa-item" data-action="reading"><div class="qa-icon">${icon('book')}</div><span>记录阅读</span></button>
            <button class="qa-item" data-action="vlog"><div class="qa-icon">${icon('edit')}</div><span>写 Vlog</span></button>
          </div>

          <div class="section-title"><h3>${icon('clock')} 最近动态</h3></div>
          ${data.recent.length === 0
            ? '<div class="glass" style="padding:32px 20px;text-align:center;color:var(--text-muted);font-size:14px;">暂无动态，开始你的第一条记录吧 ✨</div>'
            : `<div class="glass timeline" style="padding:16px 16px 4px 20px;">
                ${data.recent.map(r => `
                  <div class="tl-item">
                    <div class="time">${r.time}</div>
                    <div class="text">${escHtml(r.text)}<span class="tag tag-${r.tag}">${r.tag === 'todo' ? '待办' : r.tag === 'sport' ? '运动' : '阅读'}</span></div>
                  </div>
                `).join('')}
              </div>`
          }
        </div>
      </div>
    </div>
  `;

  // Replace app content
  const app = document.getElementById('app');
  app.innerHTML = html;
  $el = app.querySelector('#page-home');

  // Event listeners
  $el.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'todo') location.hash = 'life';
      else if (action === 'sport') location.hash = 'sport';
      else if (action === 'reading') location.hash = 'learn';
      else if (action === 'vlog') { Store.setLifeTab('vlog'); location.hash = 'life'; }
    });
  });

  $el.querySelector('#btn-settings').addEventListener('click', showSettingsModal);
}

function showSettingsModal() {
  const existing = document.getElementById('modal-settings');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-settings';
  overlay.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      <h3 style="font-size:20px;font-weight:700;margin-bottom:20px;">${icon('settings')} 设置</h3>
      <div class="form-group">
        <label class="form-label">数据管理</label>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">导出全部数据为 JSON 文件备份，或从备份文件恢复。</p>
        <div class="btn-group" style="flex-direction:column;gap:8px;">
          <button class="btn btn-gradient btn-block" id="btn-export">${icon('upload')} 导出数据</button>
          <button class="btn btn-glass btn-block" id="btn-import">${icon('download')} 导入数据</button>
        </div>
      </div>
      <input type="file" id="import-file-input" accept=".json" style="display:none;">
      <div id="import-status" style="font-size:12px;color:var(--success);margin-top:8px;display:none;"></div>
      <div class="btn-group" style="margin-top:20px;">
        <button class="btn btn-glass btn-block" id="settings-close">关闭</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  overlay.addEventListener('click', e => {
    if (e.target === e.currentTarget) overlay.remove();
  });
  overlay.querySelector('#settings-close').addEventListener('click', () => overlay.remove());

  overlay.querySelector('#btn-export').addEventListener('click', async () => {
    showLoading(overlay.querySelector('.modal-sheet'));
    try {
      await Store.exportAllData();
      const status = overlay.querySelector('#import-status');
      status.innerHTML = icon('check') + ' 数据已导出';
      status.style.display = 'block';
      status.style.color = 'var(--success)';
    } finally {
      hideLoading();
    }
  });

  overlay.querySelector('#btn-import').addEventListener('click', () => {
    document.getElementById('import-file-input').click();
  });

  document.getElementById('import-file-input').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    showLoading(overlay.querySelector('.modal-sheet'));
    try {
      await Store.importAllData(file);
      const status = overlay.querySelector('#import-status');
      status.innerHTML = icon('check') + ' 数据已恢复，刷新页面查看';
      status.style.display = 'block';
      status.style.color = 'var(--success)';
    } catch (err) {
      const status = overlay.querySelector('#import-status');
      status.innerHTML = icon('close') + ' 导入失败：文件格式不正确';
      status.style.display = 'block';
      status.style.color = 'var(--danger)';
    } finally {
      hideLoading();
    }
    e.target.value = '';
  });
}

function destroy() {
  $el = null;
}

export default { render, destroy };
