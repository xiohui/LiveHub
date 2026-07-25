import { Store, todayStr } from '../store.js';

let $el = null;
let exerciseTypes = [];

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
  exerciseTypes = await Store.seedExerciseTypes();
  const html = `
    <div class="page" id="page-sport">
      <div class="page-inner">
        <div class="bg-deco"><div class="orb orb-1"></div><div class="orb orb-2"></div></div>
        <div class="page-scroll" id="sport-scroll">
          <div class="page-header">
            <h1>运动</h1>
            <button class="avatar-btn" id="sport-manage-types" style="font-size:14px;">⚙️</button>
          </div>
          <div id="sport-today-card"></div>
          <div class="section-title"><h3>📊 本周打卡</h3></div>
          <div class="glass" id="sport-heatmap-wrap" style="margin-bottom:16px;"></div>
          <div class="section-title"><h3>📈 运动统计</h3></div>
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
  const container = $el.querySelector('#sport-today-card');
  if (todays.length === 0) {
    container.innerHTML = `
      <div class="workout-today glass">
        <div class="emoji">🏃</div>
        <div class="status-text">今日尚未运动</div>
        <div class="sub-text">开始今天的运动打卡吧！</div>
      </div>
    `;
  } else {
    const lines = todays.map(w => {
      let detail = '';
      if (w.category === 'cardio') detail = `${w.distance}km · ${w.duration}分钟`;
      else if (w.category === 'strength') detail = `${w.sets}组×${w.reps}个`;
      else if (w.category === 'core') detail = `${w.duration}秒`;
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
  const container = $el.querySelector('#sport-heatmap-wrap');
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const labels = ['一','二','三','四','五','六','日'];
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const count = workouts.filter(w => w.date === ds).length;
    const level = count === 0 ? '' : count <= 1 ? 'l1' : count <= 2 ? 'l2' : count <= 3 ? 'l3' : 'l4';
    days.push({ ds, level, isToday: ds === todayStr });
  }

  container.innerHTML = `
    <div class="heatmap">
      ${days.map(d => `<div class="heatmap-day ${d.level} ${d.isToday ? 'today' : ''}" title="${d.ds}"></div>`).join('')}
    </div>
    <div class="heatmap-labels">${labels.map(l => `<span>${l}</span>`).join('')}</div>
  `;
}

async function renderStats() {
  const all = await Store.getWorkouts();
  const thisMonth = all.filter(w => {
    const d = new Date(w.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalMinutes = thisMonth.reduce((s, w) => {
    if (w.category === 'cardio') return s + (w.duration || 0);
    return s + 5; // estimate 5 min per strength/core set
  }, 0);
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
    <div class="glass stat-card"><div class="num green">🔥${streak}</div><div class="label">连续天数</div></div>
  `;
}

async function renderTodayList() {
  const todays = await Store.getTodayWorkouts();
  const container = $el.querySelector('#sport-today-list');
  if (todays.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">🏃</div><div class="text">今天还没有运动记录</div></div>';
  } else {
    container.innerHTML = `
      <div class="workout-list">
        ${todays.sort((a,b) => (b.createdAt||0) - (a.createdAt||0)).map(w => {
          let detail = '';
          if (w.category === 'cardio') detail = `${w.distance}km · ${w.duration}分钟`;
          else if (w.category === 'strength') detail = `${w.sets}组×${w.reps}个`;
          else if (w.category === 'core') detail = `${w.duration}秒`;
          const time = w.createdAt ? new Date(w.createdAt).toTimeString().slice(0,5) : '';
          return `
            <div class="workout-record glass-sm" data-id="${w.id}">
              <span class="w-emoji">${w.emoji || '🏃'}</span>
              <div class="w-info">
                <div class="w-name">${escHtml(w.exerciseName)}</div>
                <div class="w-detail">${detail}${w.notes ? ' · ' + escHtml(w.notes) : ''}</div>
              </div>
              <span class="w-time">${time}</span>
              <button class="w-delete" data-action="delete-workout">✕</button>
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
          <input class="form-input" id="f-ex-dur" type="number" min="0" placeholder="例如 25">
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
          <input class="form-input" id="f-ex-dur" type="number" min="0" placeholder="例如 60">
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
      w.distance = Number(body.querySelector('#f-ex-dist')?.value) || 0;
      w.duration = Number(body.querySelector('#f-ex-dur')?.value) || 0;
      if (!w.distance && !w.duration) return;
    } else if (selectedCat === 'strength') {
      w.sets = Number(body.querySelector('#f-ex-sets')?.value) || 0;
      w.reps = Number(body.querySelector('#f-ex-reps')?.value) || 0;
      if (!w.sets || !w.reps) return;
    } else if (selectedCat === 'core') {
      w.duration = Number(body.querySelector('#f-ex-dur')?.value) || 0;
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
              <span>${t.emoji||''} ${t.name}</span>
              ${t.isCustom ? `<button class="type-del" data-id="${t.id}" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:12px;margin-left:4px;">✕</button>` : ''}
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
