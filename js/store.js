import { DB } from './db.js';

const listeners = {};

// 跨页面跳转时携带的待应用标签（如首页"写 Vlog" → 生活页 Vlog 标签）
let pendingLifeTab = null;

function on(ev, fn) {
  (listeners[ev] = listeners[ev] || []).push(fn);
  return () => {
    const idx = (listeners[ev] || []).indexOf(fn);
    if (idx >= 0) listeners[ev].splice(idx, 1);
  };
}
function emit(ev, data) {
  (listeners[ev] || []).forEach(fn => fn(data));
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export const Store = {
  on, emit,

  setLifeTab(tab) { pendingLifeTab = tab; },
  consumeLifeTab() { const t = pendingLifeTab; pendingLifeTab = null; return t; },

  // ====== TODOS ======
  async getTodos() {
    return DB.getAll('todos');
  },
  async addTodo(data) {
    const todo = { ...data, completed: false, createdAt: Date.now() };
    const id = await DB.add('todos', todo);
    emit('todo-change');
    return id;
  },
  async toggleTodo(id) {
    const todo = await DB.get('todos', id);
    if (todo) {
      todo.completed = !todo.completed;
      await DB.put('todos', todo);
      emit('todo-change');
    }
  },
  async deleteTodo(id) {
    await DB.delete('todos', id);
    emit('todo-change');
  },

  // ====== VLOGS ======
  async getVlogs() {
    const list = await DB.getAll('vlogs');
    return list.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
  },
  async addVlog(data) {
    const vlog = { ...data, createdAt: Date.now() };
    const id = await DB.add('vlogs', vlog);
    emit('vlog-change');
    return id;
  },
  async deleteVlog(id) {
    await DB.delete('vlogs', id);
    emit('vlog-change');
  },

  // ====== EXERCISE TYPES ======
  async getExerciseTypes() {
    return DB.getAll('exerciseTypes');
  },
  async seedExerciseTypes() {
    const existing = await DB.getAll('exerciseTypes');
    if (existing.length > 0) return existing;
    const defaults = [
      { name: '跑步', category: 'cardio', emoji: '🏃', isCustom: false },
      { name: '卷腹', category: 'strength', emoji: '💪', isCustom: false },
      { name: '俯卧撑', category: 'strength', emoji: '💪', isCustom: false },
      { name: '死虫式', category: 'strength', emoji: '🤸', isCustom: false },
      { name: '平板支撑', category: 'core', emoji: '🧘', isCustom: false },
    ];
    const ids = await Promise.all(defaults.map(d => DB.add('exerciseTypes', d)));
    return defaults.map((d,i) => ({ ...d, id: ids[i] }));
  },
  async addExerciseType(data) {
    const et = { ...data, isCustom: true };
    const id = await DB.add('exerciseTypes', et);
    emit('exercise-type-change');
    return { ...et, id };
  },
  async deleteExerciseType(id) {
    await DB.delete('exerciseTypes', id);
    emit('exercise-type-change');
  },

  // ====== WORKOUTS ======
  async getWorkouts() {
    return DB.getAll('workouts');
  },
  async addWorkout(data) {
    const w = { ...data, date: data.date || todayStr(), createdAt: Date.now() };
    const id = await DB.add('workouts', w);
    emit('workout-change');
    return id;
  },
  async deleteWorkout(id) {
    await DB.delete('workouts', id);
    emit('workout-change');
  },
  async getTodayWorkouts() {
    const all = await DB.getAll('workouts');
    return all.filter(w => w.date === todayStr());
  },
  async getWorkoutsThisWeek() {
    const all = await DB.getAll('workouts');
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0,0,0,0);
    const mondayTs = monday.getTime();
    return all.filter(w => {
      const d = new Date(w.date);
      return d.getTime() >= mondayTs;
    });
  },

  // ====== READINGS ======
  async getReadings() {
    return DB.getAll('readings');
  },
  async addReading(data) {
    const r = { ...data, createdAt: Date.now() };
    const id = await DB.add('readings', r);
    emit('reading-change');
    return id;
  },
  async updateReadingProgress(id, currentPage) {
    const r = await DB.get('readings', id);
    if (r) {
      r.currentPage = currentPage;
      await DB.put('readings', r);
      emit('reading-change');
    }
  },
  async deleteReading(id) {
    await DB.delete('readings', id);
    emit('reading-change');
  },

  // ====== MATERIALS ======
  async getMaterials() {
    return DB.getAll('materials');
  },
  async addMaterial(data) {
    const m = { ...data, createdAt: Date.now() };
    const id = await DB.add('materials', m);
    emit('material-change');
    return id;
  },
  async deleteMaterial(id) {
    const m = await DB.get('materials', id);
    if (m && m.isManual) return;
    await DB.delete('materials', id);
    emit('material-change');
  },
  async seedMaterials() {
    // 仅在使用手册缺失时补充，绝不删除用户已收藏的资料
    const existing = await DB.getAll('materials');
    const hasLiveHub = existing.some(m => m.isManual && (m.title.includes('LiveHub') || m.title.includes('集合')));
    const hasOpenCode = existing.some(m => m.isManual && m.title.includes('OpenCode'));
    if (!hasLiveHub) {
      await DB.add('materials', {
        title: '📖 集合 使用手册',
        description: '点击查看完整使用指南 · 涵盖所有功能',
        category: '手册',
        url: '',
        isManual: true,
        createdAt: Date.now(),
      });
    }
    if (!hasOpenCode) {
      await DB.add('materials', {
        title: '🤖 OpenCode使用手册',
        description: '本地离线手册 · 14章 + 5附录 · 点击查看',
        category: 'OPENCODE',
        url: '',
        isManual: true,
        manualType: 'opencode',
        createdAt: Date.now(),
      });
    } else {
      // 迁移：旧版本指向外链，统一改为本地离线手册
      for (const m of existing) {
        if (m.isManual && m.title.includes('OpenCode') && (m.url || m.manualType !== 'opencode')) {
          m.url = '';
          m.manualType = 'opencode';
          m.description = '本地离线手册 · 14章 + 5附录 · 点击查看';
          await DB.put('materials', m);
        }
      }
    }
  },

  // ====== EXPORT / IMPORT ======
  async exportAllData() {
    const stores = ['todos', 'vlogs', 'workouts', 'readings', 'materials', 'exerciseTypes'];
    const data = {};
    for (const name of stores) {
      data[name] = await DB.getAll(name);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `集合-backup-${todayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  async importAllData(file) {
    const text = await file.text();
    const data = JSON.parse(text);
    const stores = ['todos', 'vlogs', 'workouts', 'readings', 'materials', 'exerciseTypes'];
    for (const name of stores) {
      if (!Array.isArray(data[name])) continue;
      const all = await DB.getAll(name);
      for (const item of all) {
        await DB.delete(name, item.id);
      }
      for (const item of data[name]) {
        await DB.add(name, item);
      }
    }
    emit('todo-change');
    emit('vlog-change');
    emit('workout-change');
    emit('reading-change');
    emit('material-change');
    emit('exercise-type-change');
  },

  // ====== DASHBOARD ======
  async getDashboardData() {
    const [todos, vlogs, workouts, readings] = await Promise.all([
      DB.getAll('todos'),
      DB.getAll('vlogs'),
      DB.getAll('workouts'),
      DB.getAll('readings'),
    ]);
    const today = todayStr();
    const todayTodos = todos.filter(t => t.dueDate === today);
    const pendingTodos = todayTodos.filter(t => !t.completed).length;
    const todayWorkouts = workouts.filter(w => w.date === today).length;
    const totalProgress = readings.length
      ? Math.round(readings.reduce((s, r) => s + (r.currentPage || 0), 0) / readings.reduce((s, r) => s + (r.totalPages || 1), 0) * 100)
      : 0;

    const recent = [];
    todos.filter(t => t.completed).sort((a,b) => b.createdAt - a.createdAt).slice(0,2).forEach(t => {
      recent.push({ time: formatTime(t.createdAt), ts: t.createdAt, text: `完成了「${t.title}」`, tag: 'todo' });
    });
    workouts.sort((a,b) => b.createdAt - a.createdAt).slice(0,2).forEach(w => {
      recent.push({ time: formatTime(w.createdAt), ts: w.createdAt, text: formatWorkoutText(w), tag: 'sport' });
    });
    readings.filter(r => r.currentPage > 0).sort((a,b) => b.createdAt - a.createdAt).slice(0,2).forEach(r => {
      recent.push({ time: formatTime(r.createdAt), ts: r.createdAt, text: `《${r.bookName}》P${r.currentPage}`, tag: 'read' });
    });
    recent.sort((a,b) => (b.ts||0) - (a.ts||0)).slice(0,5);

    return { pendingTodos, todayWorkouts, totalProgress, recent, todoCount: todos.length, readings };
  },
};

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatWorkoutText(w) {
  let detail = '';
  if (w.category === 'cardio') detail = `${w.distance}km · ${w.duration}分钟`;
  else if (w.category === 'strength') detail = `${w.sets}组×${w.reps}个`;
  else if (w.category === 'core') detail = `${w.duration}秒`;
  return `${w.exerciseName} ${detail}`;
}
