# LiveHub 项目记忆

纯前端 PWA（原生 ES Modules + IndexedDB + Service Worker），手机优先。页面：home / life / sport / learn，hash 路由。

## 关键约定
- **OpenCode 手册必须本地化**：内容在 `js/manual/opencode-content.js`（manualData），经 `learn.js` 的 `showOpenCodeManual()` 弹窗渲染。不要重新引入外链。
- **部署**：GitHub Pages + GitHub Actions，push `main` 自动部署（`.github/workflows/deploy.yml`）。项目页路径 `/LiveHub/`，全站使用相对路径。
- **manifest**：`start_url` / `scope` 均为 `"."`（适配子路径部署）。
- **SW 版本**在 3 处保持一致：`index.html` 的 `lh_sw_vN` 与 `sw.js?v=N`、`sw.js` 的 `CACHE = 'livehub-vN'`，改动资源时一起 +1。
- `_headers` 仅 Netlify/Cloudflare 生效，GitHub Pages 忽略；`.nojekyll` 已存在以保留下划线文件。

## 数据流
- 数据存 IndexedDB（todos/vlogs/workouts/readings/materials/exerciseTypes），不上传服务器。
- 资料（materials）中 `isManual` 条目不可被用户删除；`manualType:'opencode'` 走本地弹窗，`url` 非空则新窗口打开外链。
