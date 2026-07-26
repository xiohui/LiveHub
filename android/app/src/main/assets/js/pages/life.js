import { Store, todayStr } from '../store.js';
import { icon } from '../icons.js';
import { escHtml } from '../utils.js';

let $el = null;
let currentTab = 'todo';

function modalHTML() {
  return `
    <div class="modal-overlay" id="modal-life">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div id="modal-life-body"></div>
      </div>
    </div>
  `;
}

function todoFormHTML() {
  return `
    <h3 style="font-size:18px;font-weight:600;margin-bottom:16px;">新建待办</h3>
    <div class="form-group">
      <label class="form-label">标题</label>
      <input class="form-input" id="f-todo-title" placeholder="输入待办内容" autofocus>
    </div>
    <div class="form-group">
      <label class="form-label">分类</label>
      <div class="option-group" id="f-todo-cat">
        <button class="option-btn" data-v="工作">工作</button>
        <button class="option-btn selected" data-v="学习">学习</button>
        <button class="option-btn" data-v="生活">生活</button>
        <button class="option-btn" data-v="运动">运动</button>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">优先级</label>
      <div class="option-group" id="f-todo-pri">
        <button class="option-btn" data-v="high"><span class="pri-dot high"></span>高</button>
        <button class="option-btn selected" data-v="medium"><span class="pri-dot medium"></span>中</button>
        <button class="option-btn" data-v="low"><span class="pri-dot low"></span>低</button>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">截止日期</label>
      <input class="form-input" id="f-todo-date" type="date" value="${todayStr()}">
    </div>
    <div class="btn-group">
      <button class="btn btn-glass" id="f-todo-cancel">取消</button>
      <button class="btn btn-gradient" id="f-todo-save">创建</button>
    </div>
  `;
}

function vlogFormHTML() {
  return `
    <h3 style="font-size:18px;font-weight:600;margin-bottom:16px;">记录今天</h3>
    <div class="form-group">
      <label class="form-label">日期</label>
      <input class="form-input" id="f-vlog-date" type="date" value="${todayStr()}">
    </div>
    <div class="form-group">
      <label class="form-label">心情</label>
      <div class="option-group" id="f-vlog-mood">
        ${['😊','😌','🔥','😢','😤','🥳'].map(m => `<button class="option-btn" data-v="${m}">${m}</button>`).join('')}
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">内容</label>
      <textarea class="form-input" id="f-vlog-text" rows="4" placeholder="今天发生了什么？"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">照片</label>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;" id="f-vlog-photo-previews"></div>
      <button class="btn btn-glass btn-sm" id="f-vlog-add-photo" type="button">📷 添加照片</button>
      <input type="file" id="f-vlog-photo-input" accept="image/*" multiple style="display:none;">
    </div>
    <div class="btn-group">
      <button class="btn btn-glass" id="f-vlog-cancel">取消</button>
      <button class="btn btn-gradient" id="f-vlog-save">保存</button>
    </div>
  `;
}

async function renderTodoList() {
  const todos = await Store.getTodos();
  const container = $el.querySelector('#life-todo-content');
  if (todos.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">${icon('list')}</div><div class="text">还没有待办，添加一条吧</div></div>`;
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.id = 'life-add-todo';
    addBtn.textContent = '＋ 添加待办';
    container.appendChild(addBtn);
    addBtn.addEventListener('click', showTodoForm);
  } else {
    container.innerHTML = `
      <div class="todo-list">
        ${todos.sort((a,b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          const pri = {high:0, medium:1, low:2};
          return (pri[a.priority]||1) - (pri[b.priority]||1);
        }).map(t => `
          <div class="todo-item glass-sm" data-id="${t.id}">
            <div class="todo-check ${t.completed ? 'done' : ''}"></div>
            <div class="todo-info">
              <div class="title ${t.completed ? 'done-text' : ''}">${escHtml(t.title)}</div>
              <div class="meta">
                <span class="todo-priority priority-${t.priority}">${t.priority === 'high' ? '高' : t.priority === 'medium' ? '中' : '低'}</span>
                <span class="todo-category">${escHtml(t.category||'')}</span>
                ${t.dueDate ? `<span>📅 ${t.dueDate}</span>` : ''}
              </div>
            </div>
            <button class="todo-delete" data-action="delete-todo">${icon('close')}</button>
          </div>
        `).join('')}
      </div>
      <button class="add-btn" id="life-add-todo">＋ 添加待办</button>
    `;
    bindTodoEvents(container);
  }
}

async function renderVlogList() {
  const vlogs = await Store.getVlogs();
  const container = $el.querySelector('#life-vlog-content');
  if (vlogs.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">${icon('edit')}</div><div class="text">还没有 Vlog 记录</div></div>`;
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.id = 'life-add-vlog';
    addBtn.textContent = '＋ 记录今天';
    container.appendChild(addBtn);
    addBtn.addEventListener('click', showVlogForm);
  } else {
    container.innerHTML = `
      ${vlogs.map(v => `
        <div class="vlog-item glass">
          <div class="v-date">
            <span class="mood">${v.mood || '😊'}</span>
            <span>${v.date || '---'}</span>
            <button class="vlog-delete" data-id="${v.id}" style="margin-left:auto;background:none;border:none;color:var(--text-muted);font-size:12px;cursor:pointer;opacity:0.3;">${icon('close')}</button>
          </div>
          <div class="v-text">${escHtml(v.text||v.content||'')}</div>
          ${v.photos && v.photos.length > 0 ? `
          <div class="vlog-photos">
            ${v.photos.map((p, i) => `<img class="vlog-photo" src="${escHtml(p)}" data-index="${i}" loading="lazy">`).join('')}
          </div>` : ''}
        </div>
      `).join('')}
      <button class="add-btn" id="life-add-vlog">＋ 记录今天</button>
    `;
    container.querySelector('#life-add-vlog').addEventListener('click', showVlogForm);
    container.addEventListener('click', async e => {
      if (e.target.classList.contains('vlog-photo')) {
        showLightbox(e.target.src);
      } else if (e.target.classList.contains('vlog-delete')) {
        const id = Number(e.target.dataset.id);
        await Store.deleteVlog(id);
        renderVlogList();
      }
    });
  }
}

function showLightbox(src) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `<img src="${escHtml(src)}">`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
  overlay.addEventListener('click', () => overlay.remove());
}

function showTodoForm() {
  const overlay = document.getElementById('modal-life');
  const body = document.getElementById('modal-life-body');
  body.innerHTML = todoFormHTML();
  overlay.classList.add('show');

  let selectedCat = '学习';
  let selectedPri = 'medium';
  body.querySelectorAll('#f-todo-cat .option-btn').forEach(b => {
    b.addEventListener('click', () => {
      body.querySelectorAll('#f-todo-cat .option-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      selectedCat = b.dataset.v;
    });
  });
  body.querySelectorAll('#f-todo-pri .option-btn').forEach(b => {
    b.addEventListener('click', () => {
      body.querySelectorAll('#f-todo-pri .option-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      selectedPri = b.dataset.v;
    });
  });
  body.querySelector('#f-todo-cancel').addEventListener('click', () => overlay.classList.remove('show'));
  body.querySelector('#f-todo-save').addEventListener('click', async () => {
    const title = body.querySelector('#f-todo-title').value.trim();
    if (!title) return;
    const dueDate = body.querySelector('#f-todo-date').value;
    await Store.addTodo({ title, category: selectedCat, priority: selectedPri, dueDate });
    overlay.classList.remove('show');
    renderTodoList();
  });
}

function showVlogForm() {
  const overlay = document.getElementById('modal-life');
  const body = document.getElementById('modal-life-body');
  body.innerHTML = vlogFormHTML();
  overlay.classList.add('show');

  let selectedMood = '';
  const photoData = [];

  body.querySelectorAll('#f-vlog-mood .option-btn').forEach(b => {
    b.addEventListener('click', () => {
      body.querySelectorAll('#f-vlog-mood .option-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      selectedMood = b.dataset.v;
    });
  });

  body.querySelector('#f-vlog-add-photo').addEventListener('click', () => {
    document.getElementById('f-vlog-photo-input').click();
  });

  document.getElementById('f-vlog-photo-input').addEventListener('change', async e => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const dataUrl = await fileToDataUrl(file);
      photoData.push(dataUrl);
      const previews = document.getElementById('f-vlog-photo-previews');
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.cssText = 'width:72px;height:72px;object-fit:cover;border-radius:8px;';
      previews.appendChild(img);
    }
    e.target.value = '';
  });

  body.querySelector('#f-vlog-cancel').addEventListener('click', () => overlay.classList.remove('show'));
  body.querySelector('#f-vlog-save').addEventListener('click', async () => {
    const text = body.querySelector('#f-vlog-text').value.trim();
    if (!text) return;
    const date = body.querySelector('#f-vlog-date').value;
    await Store.addVlog({ text, date, mood: selectedMood || '😊', photos: photoData });
    overlay.classList.remove('show');
    renderVlogList();
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function bindTodoEvents(container) {
  container.querySelectorAll('.todo-check').forEach(el => {
    el.addEventListener('click', async () => {
      const id = Number(el.closest('.todo-item').dataset.id);
      await Store.toggleTodo(id);
      renderTodoList();
    });
  });
  container.querySelectorAll('[data-action="delete-todo"]').forEach(el => {
    el.addEventListener('click', async e => {
      e.stopPropagation();
      const id = Number(el.closest('.todo-item').dataset.id);
      await Store.deleteTodo(id);
      renderTodoList();
    });
  });
  const addBtn = container.querySelector('#life-add-todo');
  if (addBtn) addBtn.addEventListener('click', showTodoForm);
}

async function render() {
  const pending = Store.consumeLifeTab();
  if (pending) currentTab = pending;
  const html = `
    <div class="page" id="page-life">
      <div class="page-inner">
        <div class="bg-deco"><div class="orb orb-1"></div><div class="orb orb-2"></div></div>
        <div class="page-scroll">
          <div class="page-header"><h1>生活</h1></div>
          <div class="segmented">
            <button class="seg-item ${currentTab === 'todo' ? 'active' : ''}" data-tab="todo">${icon('check')} 待办</button>
            <button class="seg-item ${currentTab === 'vlog' ? 'active' : ''}" data-tab="vlog">${icon('edit')} Vlog</button>
          </div>
          <div id="life-todo-content"></div>
          <div id="life-vlog-content" style="display:${currentTab === 'vlog' ? 'block' : 'none'}"></div>
        </div>
      </div>
    </div>
    ${modalHTML()}
  `;

  const app = document.getElementById('app');
  app.innerHTML = html;
  $el = app.querySelector('#page-life');
  $el.classList.add('active');

  if (currentTab === 'todo') renderTodoList();
  else renderVlogList();

  // Segmented control
  $el.querySelectorAll('.seg-item').forEach(btn => {
    btn.addEventListener('click', () => {
      $el.querySelectorAll('.seg-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      document.getElementById('life-todo-content').style.display = currentTab === 'todo' ? '' : 'none';
      document.getElementById('life-vlog-content').style.display = currentTab === 'vlog' ? '' : 'none';
      if (currentTab === 'todo') renderTodoList();
      else renderVlogList();
    });
  });

  // Modal overlay close
  document.getElementById('modal-life').addEventListener('click', e => {
    if (e.target === e.currentTarget) e.target.classList.remove('show');
  });

}

function destroy() {
  $el = null;
}

export default { render, destroy };
