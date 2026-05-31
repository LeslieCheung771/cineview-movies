# CineView — 电影片单网站

## 项目概述

单页电影收藏展示网站，Apple 风格暗色主题，672 部电影 + 海报。

- **入口**: `index.html` (349 行，包含 HTML/CSS/JS)
- **数据**: `movies_filtered.json` (每部电影包含 title, year, rating, poster, tags 等)
- **海报**: `posters/` 目录
- **部署**: Vercel (`.vercel/`)

## 设计系统

### 色彩
| Token | 值 | 用途 |
|--------|-----|------|
| `--bg` | `#000` | 页面背景 |
| `--surface` | `rgba(255,255,255,0.04)` | 卡片/控件背景 |
| `--surface-hover` | `rgba(255,255,255,0.08)` | hover 态 |
| `--glass` | `rgba(255,255,255,0.06)` | 玻璃效果面板 |
| `--glass-border` | `rgba(255,255,255,0.1)` | 玻璃边框 |
| `--text` | `#f5f5f7` | 主文字 |
| `--text-secondary` | `#a1a1a6` | 次要文字 |
| `--text-tertiary` | `#6e6e73` | 辅助文字 |
| `--accent` | `#ff9f0a` | 强调色（金黄） |
| `--accent-dim` | `rgba(255,159,10,0.15)` | 强调色弱化 |
| `--star` | `#ff9f0a` | 星级评分 |

### 字体
`-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif`

### 圆角
`--radius: 16px`（卡片、面板通用）

### 玻璃效果
```css
background: rgba(0,0,0,0.6);
backdrop-filter: saturate(180%) blur(20px);
border-bottom: 1px solid rgba(255,255,255,0.08);
```

### 动画
- **卡片入场**: `fadeUp` — opacity 0→1 + translateY(24px→0), 0.6s ease
- **卡片 hover**: translateY(-6px) + box-shadow + poster scale(1.06)
- **控件过渡**: 0.25s-0.3s ease/transition
- **卡片动画延迟**: 通过 JS 动态设置 `animation-delay`

### 断点
- 默认: 1400px max-width, grid `repeat(auto-fill, minmax(220px, 1fr))`
- `≤768px`: nav links 隐藏, grid `minmax(150px, 1fr)`, controls 纵向排列
- `≤480px`: grid `repeat(2, 1fr)`, hero 标题缩小

### HTML 结构
```
nav.nav → .hero#hero → .controls → section#movies (.grid) → footer.footer
```

---

# Skills（自定义斜杠命令）

> 以下所有 skills 必须在修改代码前先阅读 `index.html` 和 `movies_filtered.json` 以理解当前状态。

---

## /design-review

**全面审查当前设计质量。**

审查维度：
1. **视觉一致性** — 色彩、间距、字体是否符合 Apple 风格系统
2. **交互体验** — hover/active/focus 状态是否完整、过渡是否流畅
3. **可访问性 (a11y)** — 对比度、focus 可见性、键盘导航、语义化 HTML
4. **响应式** — 各断点下布局是否正常，有无溢出/错位
5. **性能** — CSS 动画是否使用 GPU 加速属性、图片加载策略
6. **代码质量** — CSS 是否有冗余、选择器是否过于具体

**输出格式**：按严重程度（🔴高 / 🟡中 / 🟢低）列出发现，每条附修复建议。

---

## /add-component

**添加一个新的 UI 组件，匹配 Apple 暗色主题风格。**

调用后，Agent 会询问：
- 组件类型（如：弹窗 modal、抽屉 drawer、Toast 通知、评分组件、标签页 tabs、骨架屏 skeleton、无限滚动加载...）
- 放置位置
- 交互需求

然后生成符合设计系统的 HTML/CSS/JS 代码，使用项目的 CSS 变量和动画规范。

---

## /theme-edit

**修改设计系统（色彩 / 字体 / 圆角 / 间距）。**

支持的操作：
- 更换强调色 `--accent`（如金→蓝→绿→紫）
- 调整明暗模式参数
- 修改字体栈
- 调整全局圆角 `--radius`
- 修改玻璃效果参数

Agent 会：
1. 列出当前值
2. 接受新值
3. 更新所有 `:root` 中的 CSS 变量
4. 检查是否有硬编码颜色需要同步更新

---

## /responsive-check

**检查并修复响应式设计问题。**

Agent 会：
1. 模拟各断点（1920px / 1440px / 1024px / 768px / 480px / 375px）
2. 检查：布局溢出、文字截断、图片变形、触控目标大小（≥44px）、间距失调
3. 列出所有问题并给出修复方案
4. 经确认后批量修复

---

## /add-animation

**添加或优化交互动效。**

支持的动效类型：
- 页面入场动画（stagger children）
- 滚动视差（parallax）
- 滚动触发动画（intersection observer）
- 微交互（按钮点击、卡片 tilt、加载状态）
- 过渡动画优化（cubic-bezier 调优）

约束：
- 使用 `transform` / `opacity`（GPU 加速）
- 避免 `width`/`height`/`top`/`left` 动画
- 优先 CSS，复杂场景用 JS
- 尊重 `prefers-reduced-motion`

---

## /layout-edit

**修改页面布局结构。**

支持的操作：
- 调整网格列数/间距
- 添加/移除/重排 section
- 修改 max-width 容器
- 调整 sticky/fixed 元素行为
- 修改断点规则

Agent 会先画出 ASCII 布局图，确认后修改代码。

---

## 编码规范

### CSS
- 所有新样式使用项目已有的 CSS 变量
- 新颜色必须定义为变量
- 动画遵循 GPU 加速原则
- 响应式样式写在对应 `@media` 内或组件附近

### HTML
- 语义化标签优先
- 图标使用 emoji 或 SVG，不引入图标库
- 所有交互元素需要可访问标签

### JS
- 原生 JS，不引入框架
- 事件委托用于动态元素
- 防抖/节流用于 scroll/resize/input 事件

---

## 数据格式 (movies_filtered.json)

```json
{
  "title": "电影中文名",
  "original_title": "Original Title",
  "year": 2023,
  "rating": 8.5,
  "poster": "posters/xxx.jpg",
  "tags": ["剧情", "科幻"],
  "country": "美国",
  "director": "导演名"
}
```
