import { Store } from '../store.js';
import { DB } from '../db.js';
import { manualData } from '../manual/opencode-content.js';

let $el = null;
let currentTab = 'reading';

function modalHTML() {
  return `
    <div class="modal-overlay" id="modal-learn">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div id="modal-learn-body"></div>
      </div>
    </div>
  `;
}

function bookFormHTML() {
  return `
    <h3 style="font-size:18px;font-weight:600;margin-bottom:16px;">添加书籍</h3>
    <div class="form-group">
      <label class="form-label">书名</label>
      <input class="form-input" id="f-book-name" placeholder="输入书名" autofocus>
    </div>
    <div class="form-group">
      <label class="form-label">作者</label>
      <input class="form-input" id="f-book-author" placeholder="输入作者">
    </div>
    <div class="form-group">
      <label class="form-label">总页数</label>
      <input class="form-input" id="f-book-pages" type="number" min="1" placeholder="例如 350">
    </div>
    <div class="btn-group">
      <button class="btn btn-glass" id="f-book-cancel">取消</button>
      <button class="btn btn-gradient" id="f-book-save">添加</button>
    </div>
  `;
}

function progressFormHTML(reading) {
  return `
    <h3 style="font-size:18px;font-weight:600;margin-bottom:16px;">更新阅读进度</h3>
    <div style="margin-bottom:16px;">
      <div style="font-size:16px;font-weight:600;">${escHtml(reading.bookName)}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${escHtml(reading.author||'')} · 共 ${reading.totalPages} 页</div>
    </div>
    <div class="form-group">
      <label class="form-label">当前读到 (页)</label>
      <div style="display:flex;align-items:center;gap:12px;">
        <input class="form-input" id="f-prog-page" type="number" min="0" max="${reading.totalPages}" value="${reading.currentPage||0}" style="flex:1;">
        <span style="font-size:13px;color:var(--text-secondary);">/ ${reading.totalPages}</span>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">阅读笔记</label>
      <textarea class="form-input" id="f-prog-notes" rows="3" placeholder="记录今天的阅读心得">${escHtml(reading.notes||'')}</textarea>
    </div>
    <div class="btn-group">
      <button class="btn btn-glass" id="f-prog-cancel">取消</button>
      <button class="btn btn-gradient" id="f-prog-save">更新</button>
    </div>
  `;
}

function materialFormHTML() {
  return `
    <h3 style="font-size:18px;font-weight:600;margin-bottom:16px;">收藏资料</h3>
    <div class="form-group">
      <label class="form-label">标题</label>
      <input class="form-input" id="f-mat-title" placeholder="输入标题" autofocus>
    </div>
    <div class="form-group">
      <label class="form-label">描述</label>
      <input class="form-input" id="f-mat-desc" placeholder="简短描述">
    </div>
    <div class="form-group">
      <label class="form-label">分类</label>
      <div class="option-group" id="f-mat-cat">
        <button class="option-btn selected" data-v="OPENCODE">OPENCODE</button>
        <button class="option-btn" data-v="前端">前端</button>
        <button class="option-btn" data-v="设计">设计</button>
        <button class="option-btn" data-v="AI">AI</button>
        <button class="option-btn" data-v="其他">其他</button>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">链接 (可选)</label>
      <input class="form-input" id="f-mat-url" placeholder="https://...">
    </div>
    <div class="btn-group">
      <button class="btn btn-glass" id="f-mat-cancel">取消</button>
      <button class="btn btn-gradient" id="f-mat-save">收藏</button>
    </div>
  `;
}

async function render() {
  const html = `
    <div class="page" id="page-learn">
      <div class="page-inner">
        <div class="bg-deco"><div class="orb orb-1"></div><div class="orb orb-2"></div></div>
        <div class="page-scroll">
          <div class="page-header"><h1>学习</h1></div>
          <div class="segmented">
            <button class="seg-item ${currentTab === 'reading' ? 'active' : ''}" data-tab="reading">📖 读书</button>
            <button class="seg-item ${currentTab === 'materials' ? 'active' : ''}" data-tab="materials">📚 资料</button>
          </div>
          <div id="learn-reading-content" style="display:${currentTab === 'reading' ? 'block' : 'none'}"></div>
          <div id="learn-materials-content" style="display:${currentTab === 'materials' ? 'block' : 'none'}"></div>
        </div>
      </div>
    </div>
    ${modalHTML()}
  `;

  const app = document.getElementById('app');
  app.innerHTML = html;
  $el = app.querySelector('#page-learn');
  $el.classList.add('active');

  if (currentTab === 'reading') renderReading();
  else renderMaterials();

  // Segmented control
  $el.querySelectorAll('.seg-item').forEach(btn => {
    btn.addEventListener('click', () => {
      $el.querySelectorAll('.seg-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      document.getElementById('learn-reading-content').style.display = currentTab === 'reading' ? 'block' : 'none';
      document.getElementById('learn-materials-content').style.display = currentTab === 'materials' ? 'block' : 'none';
      if (currentTab === 'reading') renderReading();
      else renderMaterials();
    });
  });

  document.getElementById('modal-learn').addEventListener('click', e => {
    if (e.target === e.currentTarget) e.target.classList.remove('show');
  });
}

async function renderReading() {
  const readings = await Store.getReadings();
  const container = $el.querySelector('#learn-reading-content');

  if (readings.length === 0) {
    container.innerHTML = `
      <div class="empty-state"><div class="icon">📖</div><div class="text">还没有书籍，添加一本开始阅读吧</div></div>
      <button class="add-btn" id="learn-add-book">＋ 添加书籍</button>
    `;
  } else {
    const inProgress = readings.filter(r => (r.currentPage||0) < (r.totalPages||1));
    const finished = readings.filter(r => (r.currentPage||0) >= (r.totalPages||1));

    let html = '';
    if (inProgress.length > 0) {
      html += `<div class="section-title"><h3>正在阅读</h3></div><div class="book-scroll">`;
      html += inProgress.map(r => bookCardHTML(r)).join('');
      html += `</div>`;
    }
    if (finished.length > 0) {
      html += `<div class="section-title" style="margin-top:12px;"><h3>已完成 ✅</h3></div><div class="book-scroll">`;
      html += finished.map(r => bookCardHTML(r, true)).join('');
      html += `</div>`;
    }

    html += `<button class="add-btn" id="learn-add-book">＋ 添加书籍</button>`;
    container.innerHTML = html;

    // Book card click - update progress
    container.querySelectorAll('.book-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = Number(card.dataset.id);
        const reading = readings.find(r => r.id === id);
        if (reading) showProgressForm(reading);
      });
    });
  }

  const addBtn = container.querySelector('#learn-add-book');
  if (addBtn) addBtn.addEventListener('click', showBookForm);
}

function bookCardHTML(r, done) {
  const pct = r.totalPages ? Math.min(100, Math.round((r.currentPage||0) / r.totalPages * 100)) : 0;
  const emoji = done ? '✅' : '📖';
  const colors = [
    'linear-gradient(135deg,#00d4ff,#7c3aed)',
    'linear-gradient(135deg,#7c3aed,#a78bfa)',
    'linear-gradient(135deg,#10b981,#34d399)',
    'linear-gradient(135deg,#f59e0b,#f97316)',
    'linear-gradient(135deg,#ef4444,#f87171)',
  ];
  const bg = colors[(r.id || 0) % colors.length];
  return `
    <div class="book-card glass-sm" data-id="${r.id}" style="cursor:pointer;">
      <div class="cover" style="background:${bg}">${emoji}</div>
      <div class="b-title">${escHtml(r.bookName)}</div>
      <div class="b-author">${escHtml(r.author||'')}</div>
      <div class="progress-bar"><div class="fill" style="width:${pct}%"></div></div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px;text-align:right;">${r.currentPage||0}/${r.totalPages||0}</div>
    </div>
  `;
}

async function renderMaterials() {
  await Store.seedMaterials();
  const materials = await Store.getMaterials();
  const container = $el.querySelector('#learn-materials-content');

  // Collect categories
  const cats = ['全部', ...new Set(materials.map(m => m.category).filter(Boolean))];

  container.innerHTML = `
    <div class="chip-row" id="mat-chips">
      ${cats.map((c, i) => `<span class="chip ${i === 0 ? 'active' : ''}" data-cat="${c}">${escHtml(c)}</span>`).join('')}
    </div>
    <div id="mat-list"></div>
    <button class="add-btn" id="learn-add-mat">＋ 收藏资料</button>
  `;

  renderMaterialList('全部');

  container.querySelectorAll('#mat-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('#mat-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderMaterialList(chip.dataset.cat);
    });
  });

  container.querySelector('#learn-add-mat').addEventListener('click', showMaterialForm);
}

async function renderMaterialList(category) {
  const all = await Store.getMaterials();
  const filtered = category === '全部' ? all : all.filter(m => m.category === category);
  const list = $el.querySelector('#mat-list');

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="icon">📚</div><div class="text">该分类暂无资料</div></div>';
    return;
  }

  const iconMap = {
    'OPENCODE': '🤖',
    '前端': '⚛️',
    '设计': '🎨',
    'AI': '🧠',
    '其他': '📄',
  };

  list.innerHTML = filtered.map(m => `
    <div class="material-item glass-sm ${m.isManual ? 'mat-pinned' : ''}" data-id="${m.id}">
      <div class="icon-box" style="background:${getColor(m.category)};">${iconMap[m.category] || '📄'}</div>
      <div class="info">
        <div class="m-title">${escHtml(m.title)} ${m.isManual ? '<span style="font-size:11px;color:var(--accent);font-weight:400;">📌</span>' : ''}</div>
        <div class="m-desc">${escHtml(m.description||'')}</div>
      </div>
      ${m.url ? `<a href="${escHtml(m.url)}" target="_blank" class="arrow" style="text-decoration:none;">→</a>` : '<span class="arrow" style="cursor:pointer;">📖</span>'}
      ${m.isManual ? '' : '<button class="w-delete" data-action="delete-mat" style="opacity:0.3;">✕</button>'}
    </div>
  `).join('');

  list.querySelectorAll('[data-action="delete-mat"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.closest('.material-item').dataset.id);
      await Store.deleteMaterial(id);
      renderMaterialList(category);
    });
  });

  list.querySelectorAll('.material-item').forEach(item => {
    const mat = all.find(m => m.id === Number(item.dataset.id));
    if (mat && mat.isManual) {
      item.style.cursor = 'pointer';
      if (mat.manualType === 'opencode') {
        item.addEventListener('click', () => showOpenCodeManual());
      } else if (mat.url) {
        item.addEventListener('click', () => window.open(mat.url, '_blank'));
      } else {
        item.addEventListener('click', () => showManualModal());
      }
    }
  });
}

function getColor(cat) {
  const map = {
    'OPENCODE': 'rgba(0,212,255,0.12)',
    '前端': 'rgba(16,185,129,0.12)',
    '设计': 'rgba(124,58,237,0.12)',
    'AI': 'rgba(245,158,11,0.12)',
  };
  return map[cat] || 'rgba(255,255,255,0.06)';
}

function showBookForm() {
  const overlay = document.getElementById('modal-learn');
  const body = document.getElementById('modal-learn-body');
  body.innerHTML = bookFormHTML();
  overlay.classList.add('show');

  body.querySelector('#f-book-cancel').addEventListener('click', () => overlay.classList.remove('show'));
  body.querySelector('#f-book-save').addEventListener('click', async () => {
    const bookName = body.querySelector('#f-book-name').value.trim();
    const author = body.querySelector('#f-book-author').value.trim();
    const totalPages = Number(body.querySelector('#f-book-pages').value) || 0;
    if (!bookName || !totalPages) return;
    await Store.addReading({ bookName, author, totalPages, currentPage: 0, notes: '' });
    overlay.classList.remove('show');
    renderReading();
  });
}

function showProgressForm(reading) {
  const overlay = document.getElementById('modal-learn');
  const body = document.getElementById('modal-learn-body');
  body.innerHTML = progressFormHTML(reading);
  overlay.classList.add('show');

  body.querySelector('#f-prog-cancel').addEventListener('click', () => overlay.classList.remove('show'));
  body.querySelector('#f-prog-save').addEventListener('click', async () => {
    const page = Number(body.querySelector('#f-prog-page').value) || 0;
    const notes = body.querySelector('#f-prog-notes').value.trim();
    await Store.updateReadingProgress(reading.id, page);
    if (notes) {
      const updated = await DB.get('readings', reading.id);
      if (updated) {
        updated.notes = notes;
        await DB.put('readings', updated);
      }
    }
    overlay.classList.remove('show');
    renderReading();
  });
}

function showMaterialForm() {
  const overlay = document.getElementById('modal-learn');
  const body = document.getElementById('modal-learn-body');
  body.innerHTML = materialFormHTML();
  overlay.classList.add('show');

  let selectedCat = 'OPENCODE';
  body.querySelectorAll('#f-mat-cat .option-btn').forEach(b => {
    b.addEventListener('click', () => {
      body.querySelectorAll('#f-mat-cat .option-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      selectedCat = b.dataset.v;
    });
  });

  body.querySelector('#f-mat-cancel').addEventListener('click', () => overlay.classList.remove('show'));
  body.querySelector('#f-mat-save').addEventListener('click', async () => {
    const title = body.querySelector('#f-mat-title').value.trim();
    const description = body.querySelector('#f-mat-desc').value.trim();
    const url = body.querySelector('#f-mat-url').value.trim();
    if (!title) return;
    await Store.addMaterial({ title, description, category: selectedCat, url });
    overlay.classList.remove('show');
    renderMaterials();
  });
}

function showManualModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay manual-overlay';
  overlay.innerHTML = `
    <div class="modal-sheet manual-sheet">
      <div class="modal-handle"></div>
      <div style="max-height:70vh;overflow-y:auto;padding-right:4px;">
        <h2 style="font-size:22px;font-weight:700;margin-bottom:18px;">📖 LiveHub 使用手册</h2>

        <section style="margin-bottom:20px;">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--accent);">🏠 首页概览</h3>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">顶部三组统计卡片：待办事项数、今日运动次数、阅读总进度百分比。<br>四枚快捷入口按钮直接跳转新建待办 / 运动打卡 / 记录阅读 / 写 Vlog。<br>下方"最近动态"时间线展示最新完成的任务、运动和阅读记录。<br>点击每条可快速跳转到对应页面。</p>
        </section>

        <section style="margin-bottom:20px;">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--accent);">✅ 待办管理</h3>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">在「生活」页的待办标签下管理。添加待办时可设置：<br>
          · <strong>分类</strong>：工作 / 学习 / 生活 / 运动<br>
          · <strong>优先级</strong>：🔴 高 / 🟡 中 / 🟢 低<br>
          · <strong>截止日期</strong>：选择日期（默认当天）<br>
          点击左侧圆圈勾选完成（划掉表示已完成），点击右侧 ✕ 删除。列表按优先级从高到低排列，未完成的排在前面。</p>
        </section>

        <section style="margin-bottom:20px;">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--accent);">📝 Vlog 日记</h3>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">在「生活」页的 Vlog 标签下。选择日期、心情表情（😊😌🔥😢😤🥳）、填写文字内容。记录按发布时间倒序排列，最新的在最上面。</p>
        </section>

        <section style="margin-bottom:20px;">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--accent);">🏃 运动打卡</h3>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">在「运动」页打卡。三种运动大类：<br>
          · <strong>🏃 有氧</strong>：输入距离(km) + 用时(分钟)<br>
          · <strong>💪 力量</strong>：输入组数 × 每组次数，自动计算总量<br>
          · <strong>🧘 核心</strong>：输入时长(秒)<br>
          可选择强度星级（1-5 星）、填写备注。右侧 ⚙️ 管理项目，可添加或删除自定义运动项目。<br>
          打卡后顶部卡片自动更新今日状态，下方生成周热力图和统计。</p>
        </section>

        <section style="margin-bottom:20px;">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--accent);">📊 运动统计</h3>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">在「运动」页中部查看：<br>
          · <strong>周热力图</strong>：7 个方块代表本周每天，颜色越亮运动次数越多<br>
          · <strong>本月次数</strong>：当月运动总次数<br>
          · <strong>总时长</strong>：当月运动累积时长（有氧按实际 / 力量核心每次估算 5 分钟）<br>
          · <strong>连续天数</strong>：从今天往前连续运动的最高天数 🔥</p>
        </section>

        <section style="margin-bottom:20px;">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--accent);">📖 读书进度</h3>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">在「学习」页的读书标签下。添加书籍（书名 / 作者 / 总页数），点击卡片弹出窗口更新当前读到第几页，可同步写阅读笔记。自动计算进度百分比和进度条。读完后显示 ✅ 已完成标记。</p>
        </section>

        <section style="margin-bottom:20px;">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--accent);">📚 资料收藏</h3>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">在「学习」页的资料标签下。可收藏任意链接资料，支持分类标签：OPENCODE / 前端 / 设计 / AI / 其他。按分类筛选快速查找。收藏的资料可以随时删除。</p>
        </section>

        <section style="margin-bottom:20px;border-top:1px solid var(--border-glass);padding-top:16px;">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--accent);">💾 数据存储</h3>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">全部数据保存在你手机的浏览器本地（IndexedDB），不上传任何服务器，数据安全由你自己掌控。<br>清除浏览器数据将会丢失所有记录，建议定期手动备份。</p>
        </section>

        <section style="margin-bottom:20px;">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--accent);">📲 安装到桌面（PWA）</h3>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">LiveHub 支持 PWA，可像原生 App 一样添加到手机桌面：<br>
          · <strong>华为 / Android</strong>：Chrome 浏览器打开后，点击菜单 →「添加到主屏幕」<br>
          · <strong>iPhone</strong>：Safari 打开后，点击分享按钮 →「添加到主屏幕」<br>
          添加到桌面后可离线查看已打开过的页面。</p>
        </section>

        <section style="margin-bottom:20px;">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--accent);">🔄 折叠屏适配</h3>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">已针对华为 Pura X Max 折叠屏优化：<br>
          · 外屏（折叠态）：标准手机布局，最大宽度 430px<br>
          · 内屏（展开竖屏）：全宽显示 + 字体放大，适合双手操作<br>
          · 内屏（展开横屏）：最大宽度 860px，合理利用宽屏空间</p>
        </section>
      </div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-glass btn-block" id="manual-close">关闭</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
  overlay.addEventListener('click', e => {
    if (e.target === e.currentTarget) overlay.remove();
  });
  overlay.querySelector('#manual-close').addEventListener('click', () => overlay.remove());
}

function showOpenCodeManual() {
  const d = manualData;
  let body = `<h2 style="font-size:22px;font-weight:700;margin-bottom:4px;">${escHtml(d.title)}</h2>`;
  if (d.subtitle) body += `<p style="font-size:13px;color:var(--text-muted);margin-bottom:18px;">${escHtml(d.subtitle)}</p>`;
  (d.parts || []).forEach(part => {
    body += `<section style="margin:18px 0;padding-top:16px;border-top:1px solid var(--border-glass, rgba(255,255,255,0.08));">`;
    body += `<h3 style="font-size:16px;font-weight:600;margin-bottom:10px;color:var(--accent);">${escHtml(part.name)}</h3>`;
    (part.chapters || []).forEach(ch => {
      body += `<div style="margin-bottom:14px;">`;
      body += `<h4 style="font-size:14px;font-weight:600;margin:0 0 6px;color:var(--text-secondary);">${escHtml(ch.title)}</h4>`;
      body += `<div class="manual-content">${ch.content}</div>`;
      body += `</div>`;
    });
    body += `</section>`;
  });

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay manual-overlay';
  overlay.innerHTML = `
    <div class="modal-sheet manual-sheet">
      <div class="modal-handle"></div>
      <div style="max-height:70vh;overflow-y:auto;padding-right:4px;">
        ${body}
      </div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-glass btn-block" id="opencode-manual-close">关闭</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
  overlay.addEventListener('click', e => {
    if (e.target === e.currentTarget) overlay.remove();
  });
  overlay.querySelector('#opencode-manual-close').addEventListener('click', () => overlay.remove());
}

function escHtml(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function destroy() {
  $el = null;
}

export default { render, destroy };
