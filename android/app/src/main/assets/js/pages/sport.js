import { Store, todayStr } from '../store.js';
import { icon } from '../icons.js';
import { escHtml, fmt1 } from '../utils.js';

let $el = null;
let exerciseTypes = [];
let _dataMigrated = false;

function modalHTML() {
  return `
    <div class="modal-overlay" id="modal-sport">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div id="modal-sport-body"></div>
      </div>
    </div>
  `;
}

function categoryLabel(cat) {
  return { cardio: '🏃 有氧', strength: '💪 力量', core: '🧘 核心' }[cat] || cat;
}

async function render() {
  if (!_dataMigrated) {
    await Store.migrateExerciseData();
    _dataMigrated = true;
  }
  exerciseTypes = await Store.seedExerciseTypes();
  const html = `
    <div class="page" id="page-sport">
      <div class="page-inner">
        <div class="bg-deco"><div class="orb orb-1"></div><div class="orb orb-2"></div></div>
        <div class="page-scroll" id="sport-scroll">
          <div class="page-header">
            <h1>运动</h1>
            <button class="avatar-btn" id="sport-manage-types" style="font-size:14px;">${icon('settings')}</button>
          </div>
          <div id="sport-today-card"></div>
          <div class="section-title"><h3>${icon('calendar')} 本周打卡</h3></div>
          <div class="glass" id="sport-heatmap-wrap" style="margin-bottom:16px;"></div>
          <div class="section-title"><h3>${icon('chart')} 运动统计</h3></div>
          <div class="stats-row" id="sport-stats"></div>
          <div class="section-title"><h3>今日记录</h3></div>
          <div id="sport-today-list"></div>
          <button class="add-btn" id="sport-add-workout">＋ 记录运动</button>
        </div>
      </div>
    </div>
    ${modalHTML()}
  `;

  const app = document.getElementById('app');
  app.innerHTML = html;
  $el = app.querySelector('#page-sport');
  $el.classList.add('active');

  await renderTodayCard();
  await renderHeatmap();
  await renderStats();
  await renderTodayList();

  $el.querySelector('#sport-add-workout').addEventListener('click', showWorkoutForm);
  $el.querySelector('#sport-manage-types').addEventListener('click', showManageTypes);
  document.getElementById('modal-sport').addEventListener('click', e => {
    if (e.target === e.currentTarget) e.target.classList.remove('show');
  });
}

async function renderTodayCard() {
  const todays = await Store.getTodayWorkouts();
  if (!$el) return;
  const container = $el.querySelector('#sport-today-card');
  if (todays.length === 0) {
    container.innerHTML = `
      <div class="workout-today glass">
        <div class="emoji">${icon('sport')}</div>
        <div class="status-text">今日尚未运动</div>
        <div class="sub-text">开始今天的运动打卡吧！</div>
      </div>
    `;
  } else {
    const lines = todays.map(w => {
      let detail = '';
      if (w.category === 'cardio') detail = `${fmt1(w.distance)}km · ${Math.round(w.duration || 0)}分钟`;
      else if (w.category === 'strength') detail = `${w.sets}组×${w.reps}个`;
      else if (w.category === 'core') detail = `${Math.round(w.duration || 0)}秒`;
      return `${w.emoji || '🏃'} ${escHtml(w.exerciseName)} ${detail}`;
    }).join('<br>');
    container.innerHTML = `
      <div class="workout-today glass">
        <div class="emoji">🔥</div>
        <div class="status-text">今日已运动 ✅</div>
        <div class="sub-text">${lines}</div>
      </div>
    `;
  }
}

async function renderHeatmap() {
  const workouts = await Store.getWorkoutsThisWeek();
  if (!$el) return;
  const container = $el.querySelector('#sport-heatmap-wrap');
  if (!container) return;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const labels = ['一','二','三','四','五','六','日'];
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const items = workouts.filter(w => w.date === ds).map(w => w.category || 'cardio');
    days.push({ ds, items, isToday: ds === todayKey });
  }

  // 每条同心环对应一个运动类别，环上着色弧长度 = 当天该类别打卡数 / 满环阈值
  const rings = [
    { cat:'cardio',   color:'#22d3ee', r:42 }, // 外环 有氧
    { cat:'strength', color:'#fb7185', r:30 }, // 中环 力量
    { cat:'core',     color:'#a78bfa', r:18 }, // 内环 核心
  ];
  const RING_CAP = 3;            // 单日满环次数
  const RC = 50, RSTROKE = 7;    // SVG 中心坐标与线宽
  const nameMap = { cardio:'有氧', strength:'力量', core:'核心' };

  const ringSVG = (day) => {
    const detail = day.items.length ? day.items.map(x => nameMap[x]).join('、') : '休息';
    let s = `<svg viewBox="0 0 100 100" class="hm-ring" title="${day.ds}${day.isToday?'（今天）':''}：${detail}">`;
    rings.forEach(rg => {
      const C = 2 * Math.PI * rg.r;
      s += `<circle cx="${RC}" cy="${RC}" r="${rg.r}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="${RSTROKE}"/>`;
      const cnt = day.items.filter(x => x === rg.cat).length;
      const frac = Math.min(cnt / RING_CAP, 1);
      if (frac > 0) {
        const dash = C * frac;
        s += `<circle cx="${RC}" cy="${RC}" r="${rg.r}" fill="none" stroke="${rg.color}" stroke-width="${RSTROKE}" stroke-linecap="round" stroke-dasharray="${dash.toFixed(2)} ${(C - dash).toFixed(2)}" transform="rotate(-90 ${RC} ${RC})"/>`;
      }
    });
    if (day.isToday) {
      s += `<circle cx="${RC}" cy="${RC}" r="47" fill="none" stroke="var(--accent)" stroke-width="2"/>`;
    }
    if (day.items.length) {
      s += `<text x="${RC}" y="55" text-anchor="middle" font-size="17" font-weight="600" fill="#e8eef7">${day.items.length}</text>`;
    }
    s += `</svg>`;
    return s;
  };

  container.innerHTML = `
    <div class="hm-rings">
      ${days.map((d, i) => `
        <div class="hm-cell">
          ${ringSVG(d)}
          <span class="hm-lab${d.isToday ? ' today' : ''}">${labels[i]}</span>
        </div>`).join('')}
    </div>
    <div class="hm-legend">
      <span class="legend-item"><i class="cat-dot cat-cardio"></i>有氧</span>
      <span class="legend-item"><i class="cat-dot cat-strength"></i>力量</span>
      <span class="legend-item"><i class="cat-dot cat-core"></i>核心</span>
    </div>
  `;
}

async function renderStats() {
  const all = await Store.getWorkouts();
  if (!$el) return;
  const thisMonth = all.filter(w => {
    const d = new Date(w.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalMinutes = Math.round(thisMonth.reduce((s, w) => {
    if (w.category === 'cardio') return s + (Number(w.duration) || 0);          // 有氧：分钟
    if (w.category === 'core') return s + (Number(w.duration) || 0) / 60;        // 核心：秒 → 分钟（用真实时长）
    return s + 5; // 力量：每组估算 5 分钟
  }, 0));
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  // streak
  let streak = 0;
  const d = new Date();
  while (true) {
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (all.some(w => w.date === ds)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }

  const container = $el.querySelector('#sport-stats');
  container.innerHTML = `
    <div class="glass stat-card"><div class="num green">${thisMonth.length}</div><div class="label">本月次数</div></div>
    <div class="glass stat-card"><div class="num green">${hours}h${mins}m</div><div class="label">总时长</div></div>
    <div class="glass stat-card"><div class="num green"><span class="streak-ico">${icon('fire')}${streak}</span></div><div class="label">连续天数</div></div>
  `;
}

async function renderTodayList() {
  const todays = await Store.getTodayWorkouts();
  if (!$el) return;
  const container = $el.querySelector('#sport-today-list');
  if (todays.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">${icon('sport')}</div><div class="text">今天还没有运动记录</div></div>`;
  } else {
    container.innerHTML = `
      <div class="workout-list">
        ${todays.sort((a,b) => (b.createdAt||0) - (a.createdAt||0)).map(w => {
          let detail = '';
          if (w.category === 'cardio') detail = `${fmt1(w.distance)}km · ${Math.round(w.duration || 0)}分钟`;
          else if (w.category === 'strength') detail = `${w.sets}组×${w.reps}个`;
          else if (w.category === 'core') detail = `${Math.round(w.duration || 0)}秒`;
          const time = w.createdAt ? new Date(w.createdAt).toTimeString().slice(0,5) : '';
          return `
            <div class="workout-record glass-sm" data-id="${w.id}">
              <span class="w-emoji">${w.emoji || '🏃'}</span>
              <div class="w-info">
                <div class="w-name">${escHtml(w.exerciseName)}</div>
                <div class="w-detail">${detail}${w.notes ? ' · ' + escHtml(w.notes) : ''}</div>
              </div>
              <span class="w-time">${time}</span>
              <button class="w-delete" data-action="delete-workout">${icon('close')}</button>
            </div>
          `;
        }).join('')}
      </div>
    `;
    container.querySelectorAll('[data-action="delete-workout"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.closest('.workout-record').dataset.id);
        await Store.deleteWorkout(id);
        await renderTodayCard();
        await renderHeatmap();
        await renderStats();
        await renderTodayList();
      });
    });
  }
}

function showWorkoutForm() {
  const overlay = document.getElementById('modal-sport');
  const body = document.getElementById('modal-sport-body');

  const cats = ['cardio', 'strength', 'core'];
  const catsHtml = cats.map(c => `<button class="option-btn" data-cat="${c}">${categoryLabel(c)}</button>`).join('');

  body.innerHTML = `
    <h3 style="font-size:18px;font-weight:600;margin-bottom:16px;">记录运动</h3>
    <div class="form-group">
      <label class="form-label">运动大类</label>
      <div class="option-group" id="f-ex-cat">${catsHtml}</div>
    </div>
    <div class="form-group">
      <label class="form-label">具体项目</label>
      <div class="option-group" id="f-ex-type"></div>
    </div>
    <div id="f-ex-details"></div>
    <div class="form-group">
      <label class="form-label">备注</label>
      <input class="form-input" id="f-ex-notes" placeholder="选填">
    </div>
    <div class="btn-group">
      <button class="btn btn-glass" id="f-ex-cancel">取消</button>
      <button class="btn btn-gradient" id="f-ex-save">保存</button>
    </div>
  `;

  overlay.classList.add('show');

  let selectedCat = 'cardio';
  let selectedType = null;

  function renderTypes(cat) {
    const types = exerciseTypes.filter(t => t.category === cat);
    const container = body.querySelector('#f-ex-type');
    if (types.length === 0) {
      container.innerHTML = '<div style="color:var(--text-muted);font-size:12px;">该类暂无项目，请先添加</div>';
      return;
    }
    container.innerHTML = types.map(t =>
      `<button class="option-btn" data-id="${t.id}" data-name="${escHtml(t.name)}" data-emoji="${escHtml(t.emoji||'')}">${t.emoji||''} ${escHtml(t.name)}</button>`
    ).join('');
    container.querySelectorAll('.option-btn').forEach(b => {
      b.addEventListener('click', () => {
        container.querySelectorAll('.option-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        selectedType = { id: Number(b.dataset.id), name: b.dataset.name, emoji: b.dataset.emoji || '🏃' };
        renderDetails(cat);
      });
    });
  }

  function renderDetails(cat) {
    const container = body.querySelector('#f-ex-details');
    if (!selectedType) {
      container.innerHTML = '<div style="color:var(--text-muted);font-size:12px;padding:12px 0;">请先选择具体项目</div>';
      return;
    }
    if (cat === 'cardio') {
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">距离 (km)</label>
          <input class="form-input" id="f-ex-dist" type="number" step="0.1" min="0" placeholder="例如 3.5">
        </div>
        <div class="form-group">
          <label class="form-label">用时 (分钟)</label>
          <input class="form-input" id="f-ex-dur" type="number" step="1" min="0" placeholder="例如 25">
        </div>
      `;
    } else if (cat === 'strength') {
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">组数</label>
          <input class="form-input" id="f-ex-sets" type="number" min="1" placeholder="例如 3">
        </div>
        <div class="form-group">
          <label class="form-label">每组次数</label>
          <input class="form-input" id="f-ex-reps" type="number" min="1" placeholder="例如 15">
        </div>
        <div id="f-ex-total" style="font-size:13px;color:var(--text-secondary);padding:4px 0;">总计：<span id="f-ex-total-num">0</span> 个</div>
      `;
      // Auto-calculate total
      setTimeout(() => {
        const setsInput = body.querySelector('#f-ex-sets');
        const repsInput = body.querySelector('#f-ex-reps');
        const totalSpan = body.querySelector('#f-ex-total-num');
        function calc() {
          const sets = Number(setsInput.value) || 0;
          const reps = Number(repsInput.value) || 0;
          totalSpan.textContent = sets * reps;
        }
        setsInput.addEventListener('input', calc);
        repsInput.addEventListener('input', calc);
      }, 50);
    } else if (cat === 'core') {
      container.innerHTML = `
      <div class="form-group">
        <label class="form-label">时长 (秒)</label>
        <input class="form-input" id="f-ex-dur" type="number" step="1" min="0" placeholder="例如 60">
      </div>
      `;
    }
  }

  // Category selection
  body.querySelectorAll('#f-ex-cat .option-btn').forEach(b => {
    b.addEventListener('click', () => {
      body.querySelectorAll('#f-ex-cat .option-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      selectedCat = b.dataset.cat;
      selectedType = null;
      renderTypes(selectedCat);
      body.querySelector('#f-ex-details').innerHTML = '';
    });
  });
  body.querySelector('#f-ex-cat .option-btn').click();

  body.querySelector('#f-ex-cancel').addEventListener('click', () => overlay.classList.remove('show'));
  body.querySelector('#f-ex-save').addEventListener('click', async () => {
    if (!selectedType) return;
    const w = {
      exerciseName: selectedType.name,
      emoji: selectedType.emoji || '🏃',
      category: selectedCat,
      notes: body.querySelector('#f-ex-notes')?.value || '',
    };
    if (selectedCat === 'cardio') {
      w.distance = Math.round((Number(body.querySelector('#f-ex-dist')?.value) || 0) * 10) / 10;
      w.duration = Math.round(Number(body.querySelector('#f-ex-dur')?.value) || 0);
      if (!w.distance && !w.duration) return;
    } else if (selectedCat === 'strength') {
      w.sets = Math.round(Number(body.querySelector('#f-ex-sets')?.value) || 0);
      w.reps = Math.round(Number(body.querySelector('#f-ex-reps')?.value) || 0);
      if (!w.sets || !w.reps) return;
    } else if (selectedCat === 'core') {
      w.duration = Math.round(Number(body.querySelector('#f-ex-dur')?.value) || 0);
      if (!w.duration) return;
    }
    await Store.addWorkout(w);
    overlay.classList.remove('show');
    await renderTodayCard();
    await renderHeatmap();
    await renderStats();
    await renderTodayList();
  });
}

function showManageTypes() {
  const overlay = document.getElementById('modal-sport');
  const body = document.getElementById('modal-sport-body');

  body.innerHTML = `
    <h3 style="font-size:18px;font-weight:600;margin-bottom:16px;">管理运动项目</h3>
    <div id="sport-type-list"></div>
    <div style="margin-top:12px;">
      <div style="display:flex;gap:8px;">
        <input class="form-input" id="f-new-type-name" placeholder="项目名称" style="flex:1;">
        <select class="form-input" id="f-new-type-cat" style="width:auto;">
          <option value="cardio">🏃 有氧</option>
          <option value="strength">💪 力量</option>
          <option value="core">🧘 核心</option>
        </select>
        <button class="btn btn-gradient btn-sm" id="f-new-type-save">添加</button>
      </div>
    </div>
    <div class="btn-group">
      <button class="btn btn-glass btn-sm" id="f-type-restore">恢复默认项目</button>
      <button class="btn btn-glass" id="f-type-close">关闭</button>
    </div>
  `;

  overlay.classList.add('show');

  function renderTypeList() {
    const list = body.querySelector('#sport-type-list');
    const byCat = { cardio: [], strength: [], core: [] };
    exerciseTypes.forEach(t => { if (byCat[t.category]) byCat[t.category].push(t); });

    list.innerHTML = Object.entries(byCat).map(([cat, types]) => `
      <div style="margin-bottom:12px;">
        <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">${categoryLabel(cat)}</div>
        <div class="option-group">
          ${types.map(t => `
            <div style="display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:var(--radius-xs);border:1px solid var(--border-glass);background:var(--bg-glass);font-size:13px;">
              <span style="flex:1;">${t.emoji||''} ${t.name}</span>
              <button class="type-edit" data-id="${t.id}" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:13px;" title="编辑">✎</button>
              <button class="type-del" data-id="${t.id}" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:12px;" title="删除">✕</button>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.type-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.id);
        await Store.deleteExerciseType(id);
        exerciseTypes = await Store.getExerciseTypes();
        renderTypeList();
      });
    });

    list.querySelectorAll('.type-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const t = exerciseTypes.find(x => x.id === id);
        if (t) editType(t);
      });
    });
  }

  async function editType(t) {
    const list = body.querySelector('#sport-type-list');
    const emojiMap = { cardio: '🏃', strength: '💪', core: '🧘' };
    const esc = s => String(s).replace(/"/g, '&quot;');
    const hasHistory = (await Store.getWorkouts()).some(w => w.exerciseName === t.name);
    list.innerHTML = `
      <div style="padding:12px;border:1px solid var(--border-glass);border-radius:var(--radius-xs);background:var(--bg-glass);">
        <div style="font-size:13px;font-weight:600;margin-bottom:10px;">编辑运动项目</div>
        <div class="form-group">
          <label class="form-label">名称</label>
          <input class="form-input" id="f-edit-type-name" value="${esc(t.name)}" style="flex:1;">
        </div>
        <div class="form-group">
          <label class="form-label">分类</label>
          <select class="form-input" id="f-edit-type-cat">
            <option value="cardio" ${t.category==='cardio'?'selected':''}>🏃 有氧</option>
            <option value="strength" ${t.category==='strength'?'selected':''}>💪 力量</option>
            <option value="core" ${t.category==='core'?'selected':''}>🧘 核心</option>
          </select>
        </div>
        ${hasHistory ? `
        <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary);margin-top:8px;cursor:pointer;">
          <input type="checkbox" id="f-edit-type-cascade"> 同时更新历史打卡（名称/分类）
        </label>` : ''}
        <div class="btn-group" style="margin-top:12px;">
          <button class="btn btn-gradient btn-sm" id="f-edit-type-save">保存</button>
          <button class="btn btn-glass btn-sm" id="f-edit-type-cancel">取消</button>
        </div>
      </div>
    `;
    body.querySelector('#f-edit-type-cancel').addEventListener('click', renderTypeList);
    body.querySelector('#f-edit-type-save').addEventListener('click', async () => {
      const name = body.querySelector('#f-edit-type-name').value.trim();
      if (!name) return;
      const cat = body.querySelector('#f-edit-type-cat').value;
      const cascade = body.querySelector('#f-edit-type-cascade');
      await Store.updateExerciseType({ ...t, name, category: cat, emoji: emojiMap[cat] || '🏃' });
      if (cascade && cascade.checked) {
        await Store.updateWorkoutsByExerciseName(t.name, { exerciseName: name, category: cat, emoji: emojiMap[cat] || '🏃' });
      }
      exerciseTypes = await Store.getExerciseTypes();
      renderTypeList();
    });
  }

  renderTypeList();

  body.querySelector('#f-new-type-save').addEventListener('click', async () => {
    const name = body.querySelector('#f-new-type-name').value.trim();
    if (!name) return;
    const cat = body.querySelector('#f-new-type-cat').value;
    const emojiMap = { cardio: '🏃', strength: '💪', core: '🧘' };
    const added = await Store.addExerciseType({ name, category: cat, emoji: emojiMap[cat] || '🏃' });
    exerciseTypes.push(added);
    renderTypeList();
    body.querySelector('#f-new-type-name').value = '';
  });

  body.querySelector('#f-type-close').addEventListener('click', () => overlay.classList.remove('show'));
  body.querySelector('#f-type-restore').addEventListener('click', async () => {
    await Store.restoreDefaultTypes();
    exerciseTypes = await Store.getExerciseTypes();
    renderTypeList();
  });
}

function destroy() {
  $el = null;
}

export default { render, destroy };
