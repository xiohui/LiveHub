export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentPage = null;
    this.currentHash = '';

    window.addEventListener('hashchange', () => this.handle());
    window.addEventListener('load', () => this.handle());
  }

  handle() {
    const hash = location.hash.slice(1) || 'home';
    if (hash === this.currentHash) return;
    this.currentHash = hash;

    if (this.currentPage && this.currentPage.destroy) {
      this.currentPage.destroy();
    }

    const page = this.routes[hash];
    if (page) {
      this.currentPage = page;
      Promise.resolve(page.render()).catch(err => {
        console.error('LiveHub page render error:', err);
        const app = document.getElementById('app');
        if (app) app.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--danger);font-size:14px;text-align:center;padding:40px;">页面加载失败<br><span style="font-size:11px;color:var(--text-muted);margin-top:8px;">${err.message}</span></div>`;
      });
    }

    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === hash);
    });
  }

  navigate(hash) {
    location.hash = hash;
  }
}
