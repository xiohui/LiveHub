# LiveHub 图标重新设计方案

## 概述

基于当前 APP 设计风格（暗色背景 `#0a0e1a`、玻璃拟态、青紫渐变 `#00d4ff → #7c3aed`），设计 3 套完整图标方案。

## 每套包含

- **PWA 应用图标**: SVG (192x192 + 512x512) + PNG 回退
- **底部导航图标**: 首页/生活/运动/学习 (4 个内联 SVG)
- **统一设计语言**: 每套风格统一

---

## Set A: 极光玻璃 (Aurora Glass)

### 设计理念
延续当前 APP 的玻璃拟态风格，与现有界面无缝融合。

### PWA App Icon
- 深色圆角方块 (96px radius) 背景
- 右上 cyan 光晕 + 左下 purple 光晕
- 毛玻璃面板 (rgba white 10%→2%, 1.5px 玻璃边框)
- "集" 字渐变填充 (cyan→indigo→purple) + 发光滤镜
- 底部渐变 accent bar
- 装饰性 tech dots

### 导航图标 (Nav Icons)
基于现有形状，改为**渐变描边**，保留识别度：

| 页面 | 图标 | 设计要点 |
|------|------|----------|
| 首页 | 房子 | 屋顶 + 墙面，渐变描边 #00d4ff→#7c3aed |
| 生活 | 四宫格 | 2×2 grid，渐变描边 |
| 运动 | 时钟 | 圆形 + 指针，渐变描边 |
| 学习 | 书本 | 翻开的书，渐变描边 |

Active 态：现有 `filter: drop-shadow(0 0 8px var(--accent-glow))` 自动适配

### SVG 文件
- `icons/set-a-glass-icon.svg` (512x512)
- `icons/set-a-glass-icon-192.svg` (192x192)
- 导航图标直接嵌入 `index.html` 的 `<svg>` 标签

---

## Set B: 极简光痕 (Minimal Trace)

### 设计理念
Apple 式极简主义，纯渐变线条，无背景底板。

### PWA App Icon
- 深色背景 + 微妙径向渐变
- 两个交错圆环（代表"集合"的汇聚意涵）
  - 左环: cyan (#00d4ff)
  - 右环: purple (#7c3aed)
  - 交集处产生高亮渐变
- 无文字，纯几何符号
- 圆环 2.5px 描边，端点圆角

### 导航图标 (Nav Icons)
纯 2px 描边，青→紫渐变，无背景：

| 页面 | 图标 | 形状 |
|------|------|------|
| 首页 | 房子 | 简化屋顶，去掉烟囱等细节 |
| 生活 | 网格 | 2×2 或菱形排列的 4 个点 |
| 运动 | 心跳线 | 简洁的山形 pulse 波形 |
| 学习 | 书签 | 旗帜 + 书页 |

### SVG 文件
- `icons/set-b-minimal-icon.svg` (512x512)
- `icons/set-b-minimal-icon-192.svg` (192x192)

---

## Set C: 汉字符号 (Sinograph)

### 设计理念
汉字本身就是最好的图标。用 "首/生/动/学" 作为导航，用 "集合" 作为品牌标志。

### PWA App Icon
- 深色背景 + 底部渐变光晕
- "集合" 二字上下排列
- 粗体 700 weight，渐变填充 (cyan→purple)
- 左侧竖线装饰（仿书法落款的红线或 cyan 科技线）
- 极简干净，视觉焦点全在汉字上

### 导航图标 (Nav Icons)
单汉字在玻璃胶囊中：

| 页面 | 汉字 | 说明 |
|------|------|------|
| 首页 | 家 | 家 = home |
| 生活 | 生 | 生 = life |
| 运动 | 动 | 动 = sport/active |
| 学习 | 学 | 学 = learn |

每个汉字置于圆角矩形 glass 胶囊中，渐变填充，字体 600 weight。

### SVG 文件
- `icons/set-c-sinograph-icon.svg` (512x512)
- `icons/set-c-sinograph-icon-192.svg` (192x192)

---

## 技术实现

### PWA 图标 SVG
- 使用 `<text>` 标签 + `font-family` 系统字体栈渲染汉字
- 或使用 `opentype.js` 提取字体路径生成 path（更兼容）
- SVG 滤镜：feGaussianBlur + feMerge 实现发光效果

### PNG 生成
使用现有 `sharp` 库将 SVG 渲染为 PNG：
- `icons/set-a-glass-icon-192.png` / `icons/set-a-glass-icon-512.png`
- `icons/set-b-minimal-icon-192.png` / `icons/set-b-minimal-icon-512.png`
- `icons/set-c-sinograph-icon-192.png` / `icons/set-c-sinograph-icon-512.png`

### manifest.json 更新
```json
"icons": [
  { "src": "icons/set-a-glass-icon.svg", "sizes": "192x192", "type": "image/svg+xml" },
  { "src": "icons/set-a-glass-icon.svg", "sizes": "512x512", "type": "image/svg+xml" },
  { "src": "icons/set-a-glass-icon-192.png", "sizes": "192x192", "type": "image/png" },
  { "src": "icons/set-a-glass-icon-512.png", "sizes": "512x512", "type": "image/png" }
]
```
（默认使用 Set A；切换 Set 只需改路径）

### index.html 更新
- `<link rel="apple-touch-icon" href="icons/set-a-glass-icon.svg">`
- 替换底部 4 个导航 `<svg>` 内联代码

---

## 实施步骤

1. 创建 `icons/` 目录下 6 个 SVG 文件（3 套 × 2 尺寸）
2. 运行 sharp 脚本生成 6 个 PNG 回退文件
3. 更新 `manifest.json` 引用 Set A
4. 更新 `index.html` apple-touch-icon + 导航图标（默认 Set A）
5. 在 `index.html` 中用注释提供其他两套导航图标代码备选

---

## 对比总览

| 维度 | 🅰 极光玻璃 | 🅱 极简光痕 | 🅲 汉字符号 |
|------|------------|------------|------------|
| 风格 | 玻璃拟态·科技感 | 苹果极简·干净 | 东方美学·独特 |
| 与现有风格匹配度 | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| 识别度 | ★★★★☆ | ★★★☆☆ | ★★★★★ |
| 独特性 | ★★★☆☆ | ★★★★☆ | ★★★★★ |
| App Icon 视觉 | "集"字玻璃卡 | 交错圆环 | "集合"书法字 |
| 导航图标 | 渐变描边图形 | 纯线渐变图形 | 汉字胶囊 |
