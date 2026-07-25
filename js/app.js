import { Router } from './router.js';
import HomePage from './pages/home.js';
import LifePage from './pages/life.js';
import SportPage from './pages/sport.js';
import LearnPage from './pages/learn.js';

function init() {
  try {
    const router = new Router({
      home: HomePage,
      life: LifePage,
      sport: SportPage,
      learn: LearnPage,
    });

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        router.navigate(page);
      });
    });

    router.handle();
  } catch (err) {
    console.error('LiveHub init error:', err);
    document.getElementById('app').innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--danger);font-size:14px;text-align:center;padding:40px;">加载失败，请刷新重试<br><span style="font-size:11px;color:var(--text-muted);margin-top:8px;">${err.message}</span></div>`;
  }
}

document.addEventListener('DOMContentLoaded', init);

