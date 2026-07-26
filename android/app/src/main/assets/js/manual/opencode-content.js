export const manualData = {
  title: 'OpenCode使用手册',
  subtitle: '终端 AI 编程助手从入门到精通',
  parts: [
    {
      name: '第一部分：入门篇',
      chapters: [
        {
          title: '第1章 走进 opencode',
          content: `<h2>1.1 什么是 opencode</h2>
<p>opencode 是一款运行在终端里的 AI 编程助手，在终端里提供 AI 辅助编程能力。核心使用场景是围绕文件系统（终端、项目代码、Git）展开的工程任务。</p>
<p>核心特征：<br>
· <strong>终端原生</strong>——直接在终端里运行，不依赖 IDE<br>
· <strong>Provider-agnostic</strong>——可接入 Anthropic、OpenAI、Google、Ollama 等多种模型<br>
· <strong>Agentic</strong>——AI 可阅读文件、规划方案、修改代码、执行命令<br>
· <strong>多形态</strong>——TUI、CLI、Web、IDE 插件、Server/SDK<br>
· <strong>开源</strong>——MIT 协议，可审计、可扩展</p>
<h2>1.2 适用场景</h2>
<p>· 日常开发：写代码、重构、Debug<br>
· 团队协作：统一 AI 工作流、沉淀工程规范<br>
· 脚本与自动化：编写 shell 脚本、CI/CD 配置<br>
· 学习与探索：解释代码、生成文档、技术调研</p>
<h2>1.3 全书概览</h2>
<p>全书共 14 章 + 5 个附录：<br>
· 入门篇：安装配置、TUI 操作<br>
· 核心功能篇：Plan/Build 模式、AGENTS.md、多形态使用<br>
· 配置定制篇：配置文件、Rules/Permissions、Models/Providers<br>
· 进阶能力篇：Agents、Commands/Skills、MCP/ACP<br>
· 开发扩展篇：Plugins/SDK、团队协作、Cheatsheet</p>`
        },
        {
          title: '第2章 安装与首次配置',
          content: `<h2>2.1 安装 opencode</h2>
<p><strong>一行命令安装（推荐）</strong></p>
<pre><code>curl -fsSL https://opencode.ai/install.sh | sh</code></pre>
<p>安装脚本会自动检测操作系统架构并下载对应二进制。</p>
<p><strong>macOS Homebrew</strong></p>
<pre><code>brew install opencode</code></pre>
<p><strong>Windows Scoop</strong></p>
<pre><code>scoop bucket add opencode https://github.com/opencode-ai/scoop-bucket.git
scoop install opencode</code></pre>
<p>验证安装：</p>
<pre><code>opencode --version</code></pre>
<p>如果找不到命令，添加 PATH：</p>
<pre><code>export PATH="$HOME/.opencode/bin:$PATH"</code></pre>
<h2>2.2 获取 API Key</h2>
<p><strong>OpenCode Zen（新手推荐）</strong>：在 TUI 中运行 /connect，按照提示登录并粘贴 key。</p>
<p><strong>Anthropic Claude</strong></p>
<pre><code>export ANTHROPIC_API_KEY=sk-ant-xxxxx
opencode</code></pre>
<p><strong>OpenAI</strong></p>
<pre><code>export OPENAI_API_KEY=sk-xxxxx
opencode</code></pre>
<p><strong>Google Gemini</strong></p>
<pre><code>export GOOGLE_GENERATIVE_AI_API_KEY=xxxxx
opencode</code></pre>
<p><strong>Ollama（本地模型）</strong></p>
<pre><code>brew install ollama
ollama pull qwen2.5-coder:14b
opencode</code></pre>
<h2>2.3 验证配置</h2>
<pre><code>opencode auth list
opencode models
opencode run "请只回复 OK"</code></pre>`
        },
        {
          title: '第3章 TUI 基础操作',
          content: `<h2>3.1 启动 TUI</h2>
<pre><code>cd your-project
opencode</code></pre>
<h2>3.2 界面布局</h2>
<p>TUI 主界面从上到下：<br>
· <strong>标题栏</strong>——显示当前会话状态、模型、模式<br>
· <strong>对话区</strong>——显示 AI 的回复、代码 diff<br>
· <strong>输入框</strong>——底部 prompt 输入区域</p>
<h2>3.3 核心操作</h2>
<p><strong>发送消息</strong>：在输入框输入问题，Enter 发送。</p>
<p><strong>换行</strong>：Alt+Enter 或 Esc 后 Enter。</p>
<p><strong>常用快捷键</strong></p>
<pre><code>Ctrl+C    取消当前请求
Ctrl+D    退出 TUI
Ctrl+L    清屏
Ctrl+Z    挂起
Tab       补全/切换焦点
↑↓        翻阅历史
/help     查看帮助</code></pre>
<h2>3.4 斜杠命令</h2>
<p>在输入框以 / 开头输入命令：</p>
<pre><code>/plan      切换到 Plan 模式
/build     切换到 Build 模式
/connect   配置 Provider
/compact   压缩上下文
/clear     清空会话
/undo      撤销上次改动
/models    查看可用模型
/help      查看帮助</code></pre>
<h2>3.5 提示词技巧</h2>
<p>· 明确目标：'给 src/utils.ts 添加单元测试'<br>
· 指定范围：'只修改 server/routes.ts 中的 login 函数'<br>
· 分步描述：'先分析当前架构，输出计划，确认后再执行'<br>
· 使用 @ 引用文件：'请优化 @src/utils.ts 中的性能'</p>`
        }
      ]
    },
    {
      name: '第二部分：核心功能篇',
      chapters: [
        {
          title: '第4章 Plan 模式与 Build 模式',
          content: `<h2>4.1 Plan 模式</h2>
<p>Plan 模式下 AI 只分析和规划，不修改任何文件。</p>
<pre><code>/plan  或者按 p 键切换到 Plan 模式</code></pre>
<p>适合场景：<br>
· 架构评审<br>
· 重构方案设计<br>
· 技术调研<br>
· 排查问题原因</p>
<p>Plan 输出的内容会以只读方式展示，AI 不会执行命令也不会修改文件。</p>
<h2>4.2 Build 模式</h2>
<p>Build 模式下 AI 可以修改文件、运行命令、完成任务。</p>
<pre><code>/build  或者按 b 键切换到 Build 模式</code></pre>
<p>适合场景：<br>
· 实现新功能<br>
· 修复 bug<br>
· 代码重构<br>
· 运行测试</p>
<h2>4.3 混合使用</h2>
<p>常见工作流：<br>
1. 先用 Plan 模式讨论方案<br>
2. 确认方案后用 Build 模式执行<br>
3. 在执行过程中随时切回 Plan 模式讨论</p>
<h2>4.4 /undo 撤销</h2>
<p>Build 模式下 opencode 会在修改前创建 Git 快照。使用 /undo 可以撤销当前会话的改动。</p>`
        },
        {
          title: '第5章 上下文管理与 AGENTS.md',
          content: `<h2>5.1 上下文的概念</h2>
<p>上下文是 AI 当前能看到的信息总和，包括：<br>
· 你输入的 prompt<br>
· 引用的文件内容<br>
· 命令执行日志<br>
· 对话历史</p>
<p>上下文窗口有限，合理管理上下文是高效使用的关键。</p>
<h2>5.2 使用 @ 引用</h2>
<p>在 prompt 中使用 @ 引用文件：</p>
<pre><code>请优化 @src/utils.ts 中的性能
请解释 @package.json 中每个依赖的作用</code></pre>
<p>引用后 AI 能看到该文件的完整内容。</p>
<h2>5.3 AGENTS.md</h2>
<p>在项目根目录创建 AGENTS.md 文件，告诉 AI 项目背景和规则：</p>
<pre><code># 项目概述
这是一个电商后台管理系统。

# 技术栈
- 前端：React 18 + TypeScript + Vite
- 后端：Node.js + Express + Prisma
- 数据库：PostgreSQL

# 代码规范
- 使用 2 空格缩进
- 组件文件使用 PascalCase
- 工具函数使用 camelCase

# 注意事项
- 不要修改 src/db/ 下的文件
- 添加新依赖前先确认必要性</code></pre>
<p>AI 会自动读取 AGENTS.md 中的规则，不需要手动引用。</p>
<h2>5.4 压缩上下文</h2>
<pre><code>/compact</code></pre>
<p>压缩历史对话但不丢失关键信息，释放上下文空间。</p>`
        },
        {
          title: '第6章 多种使用形态',
          content: `<h2>6.1 TUI（终端界面）</h2>
<p>最常用、功能最完整的形态。</p>
<pre><code>opencode</code></pre>
<h2>6.2 CLI（命令行模式）</h2>
<pre><code>opencode run "解释 src/main.ts 的功能"
opencode run -f prompts/refactor.md "按照 prompt 文件中的要求重构"</code></pre>
<p>适合脚本化和 CI/CD 集成。</p>
<h2>6.3 Web 模式</h2>
<pre><code>opencode web</code></pre>
<p>在浏览器中提供类似 TUI 的界面，适合不习惯终端的用户。</p>
<h2>6.4 IDE 插件</h2>
<p>opencode 提供 VS Code 插件，可在编辑器内直接使用，支持文件右键菜单、快捷键集成。</p>
<h2>6.5 Server 模式</h2>
<pre><code>opencode server</code></pre>
<p>启动 HTTP 服务，提供 REST API，适合集成到自定义工具和平台。</p>
<h2>6.6 SDK</h2>
<p>通过 SDK 在 Node.js 应用中调用 opencode：</p>
<pre><code>npm install opencode</code></pre>
<pre><code>import { opencode } from 'opencode';
const result = await opencode.run("优化这段代码", { files: ["src/foo.ts"] });</code></pre>`
        }
      ]
    },
    {
      name: '第三部分：配置与定制篇',
      chapters: [
        {
          title: '第7章 配置文件深入',
          content: `<h2>7.1 opencode.json</h2>
<p>项目级配置文件，放在项目根目录：</p>
<pre><code>{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",
  "tab_autocomplete": true,
  "allow_browser": true,
  "allow_commands": true
}</code></pre>
<h2>7.2 用户级配置</h2>
<p>全局配置文件位于 ~/.opencode/config.json，影响所有项目。</p>
<h2>7.3 配置优先级</h2>
<p>项目配置 > 用户配置 > 默认配置。优先级从高到低：<br>
1. 当前项目的 opencode.json<br>
2. ~/.opencode/config.json<br>
3. 内置默认值</p>
<h2>7.4 核心配置项</h2>
<p><strong>model</strong>：主模型，处理复杂任务<br>
<strong>small_model</strong>：轻量模型，处理简单任务（压缩、补全等）<br>
<strong>tab_autocomplete</strong>：是否启用 Tab 补全<br>
<strong>allow_browser</strong>：是否允许 AI 访问网页<br>
<strong>allow_commands</strong>：是否允许 AI 执行 shell 命令<br>
<strong>max_tokens</strong>：每次生成的最大 token 数</p>`
        },
        {
          title: '第8章 Rules、Permissions 与 Policies',
          content: `<h2>8.1 Rules（规则）</h2>
<p>Rules 是全局或项目级别的约束条件，告诉 AI 什么可以做、什么不可以做。</p>
<p>在 opencode.json 中定义：</p>
<pre><code>{
  "rules": [
    "不要修改 tests/ 目录下的文件",
    "添加新依赖前必须询问用户",
    "代码中使用 2 空格缩进"
  ]
}</code></pre>
<h2>8.2 Permissions（权限）</h2>
<p>Permission 控制 AI 对系统资源的访问：</p>
<pre><code>{
  "permissions": {
    "allow_commands": true,
    "allow_browser": false,
    "allow_scripts": ["*.sh", "*.py"],
    "deny_paths": ["node_modules", ".git"]
  }
}</code></pre>
<p><strong>allow_commands</strong>：是否允许执行 Shell 命令<br>
<strong>allow_browser</strong>：是否允许访问网络<br>
<strong>allow_scripts</strong>：允许执行的脚本类型<br>
<strong>deny_paths</strong>：AI 不可读写的路径</p>
<h2>8.3 Policies（策略）</h2>
<p>Policy 是更高层级的控制，适用于企业级部署：</p>
<pre><code>{
  "policies": {
    "require_human_approval": ["delete", "install"],
    "audit_log": true,
    "max_cost_per_session": 0.5
  }
}</code></pre>`
        },
        {
          title: '第9章 Models 与 Providers',
          content: `<h2>9.1 Provider 是什么</h2>
<p>Provider 是模型服务提供方，常见的 Provider：<br>
· <strong>OpenCode Zen</strong>——opencode 官方托管的服务<br>
· <strong>Anthropic</strong>——Claude 系列模型<br>
· <strong>OpenAI</strong>——GPT 系列模型<br>
· <strong>Google</strong>——Gemini 系列模型<br>
· <strong>Ollama</strong>——本地运行的开源模型</p>
<h2>9.2 配置 Provider</h2>
<p>TUI 中通过 /connect 交互式配置。</p>
<p>环境变量方式：</p>
<pre><code>export ANTHROPIC_API_KEY=sk-ant-xxxxx
export OPENAI_API_KEY=sk-xxxxx
export GOOGLE_GENERATIVE_AI_API_KEY=xxxxx</code></pre>
<p>登录命令方式：</p>
<pre><code>opencode auth login --provider anthropic</code></pre>
<h2>9.3 查看可用模型</h2>
<pre><code>opencode models [provider]</code></pre>
<p>例如：</p>
<pre><code>opencode models anthropic
opencode models openai
opencode models google</code></pre>
<h2>9.4 指定模型</h2>
<p>在 opencode.json 中：</p>
<pre><code>{
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5"
}</code></pre>
<p>临时切换：在输入框顶部点击模型名。</p>
<h2>9.5 代理配置</h2>
<pre><code>export HTTPS_PROXY=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
export NO_PROXY=localhost,127.0.0.1</code></pre>`
        }
      ]
    },
    {
      name: '第四部分：进阶能力篇',
      chapters: [
        {
          title: '第10章 Agents 与 Subagents',
          content: `<h2>10.1 Agent 的概念</h2>
<p>Agent 是一个独立 AI 工作单元，可自主阅读、规划、修改代码、执行命令。opencode 会话本身就是一个 Agent。</p>
<h2>10.2 多 Agent 协作</h2>
<p>opencode 支持一个主 Agent 调用子 Agent（Subagent）分工协作：<br>
· 主 Agent 负责任务分解和协调<br>
· 子 Agent 负责具体子任务<br>
· 各 Agent 有独立上下文，互不干扰</p>
<h2>10.3 Agent 配置</h2>
<pre><code>{
  "agents": {
    "frontend": {
      "model": "anthropic/claude-sonnet-4-5",
      "instructions": "你负责前端开发"
    },
    "backend": {
      "model": "anthropic/claude-haiku-4-5",
      "instructions": "你负责后端 API"
    }
  }
}</code></pre>
<h2>10.4 自定义 Agent</h2>
<p>在项目根目录创建 .opencode/agents/ 目录，每个 Agent 一个 JSON 文件：</p>
<pre><code>// .opencode/agents/security-review.json
{
  "name": "security-review",
  "model": "anthropic/claude-sonnet-4-5",
  "instructions": "你是一名安全专家，负责代码安全审查。"
}</code></pre>`
        },
        {
          title: '第11章 Commands、Skills 与 Custom Tools',
          content: `<h2>11.1 Commands（命令）</h2>
<p>自定义斜杠命令，在 opencode.json 中定义：</p>
<pre><code>{
  "commands": {
    "test": {
      "description": "运行测试",
      "command": "npm test"
    },
    "lint": {
      "description": "运行 lint",
      "command": "npm run lint"
    }
  }
}</code></pre>
<p>在 TUI 中使用：/test、/lint</p>
<h2>11.2 Skills（技能）</h2>
<p>Skill 是可复用的能力模块，包含 instructions、prompts 和工具配置。可在 opencode.json 中引用：</p>
<pre><code>{
  "skills": [
    "github.com/opencode-ai/skills/typescript",
    "./skills/deploy.md"
  ]
}</code></pre>
<h2>11.3 Custom Tools（自定义工具）</h2>
<p>通过 MCP 协议接入自定义工具，让 AI 具备额外能力：<br>
· 数据库查询<br>
· 调用第三方 API<br>
· 发送通知<br>
· 访问内部系统</p>
<h2>11.4 Skill 的内部结构</h2>
<p>一个 Skill 文件包含三个部分：<br>
<strong>context</strong>：Skill 需要的工作目录上下文<br>
<strong>instructions</strong>：Skill 工作流程说明<br>
<strong>actions</strong>：Skill 的具体执行步骤</p>`
        },
        {
          title: '第12章 MCP 与 ACP 生态集成',
          content: `<h2>12.1 MCP（Model Context Protocol）</h2>
<p>MCP 是 AI 连接外部工具和数据源的开放协议。类似"AI 界的 USB-C"。</p>
<p>通过 MCP 可让 opencode 接入：<br>
· 文件系统（读/写/搜索）<br>
· Git 仓库<br>
· 数据库<br>
· Web API<br>
· 浏览器</p>
<h2>12.2 配置 MCP 服务器</h2>
<pre><code>{
  "mcp_servers": {
    "postgres": {
      "url": "http://localhost:3001/mcp",
      "description": "PostgreSQL 数据库查询接口"
    },
    "jira": {
      "url": "http://localhost:3002/mcp",
      "description": "Jira 任务管理系统"
    }
  }
}</code></pre>
<h2>12.3 ACP（Agent Communication Protocol）</h2>
<p>ACP 是 Agent 间通信协议，基于 MCP 扩展，让不同 Agent 可以互相通信协作。</p>
<p>使用场景：<br>
· 一个 Agent 负责分析需求，另一个负责编码<br>
· 一个 Agent 负责写测试，另一个负责实现功能<br>
· Agent 间通过 ACP 传递中间产物</p>
<h2>12.4 生态工具推荐</h2>
<p><strong>Playwright MCP</strong>：浏览器自动化<br>
<strong>Filesystem MCP</strong>：增强文件操作<br>
<strong>Git MCP</strong>：Git 操作集成<br>
<strong>SQLite MCP</strong>：数据库查询</p>`
        }
      ]
    },
    {
      name: '第五部分：开发与扩展篇',
      chapters: [
        {
          title: '第13章 Plugins 与 SDK',
          content: `<h2>13.1 Plugins 系统</h2>
<p>Plugin 是扩展 opencode 功能的模块，可添加自定义行为：<br>
· 自定义渲染器<br>
· 自定义文件类型处理<br>
· 事件监听与 Hook</p>
<pre><code>// my-plugin.js
module.exports = {
  name: 'my-plugin',
  hooks: {
    'beforePrompt': (prompt) => { /* ... */ },
    'afterResponse': (response) => { /* ... */ }
  }
};</code></pre>
<h2>13.2 Plugin 配置</h2>
<pre><code>{
  "plugins": [
    "./plugins/my-plugin.js",
    "@opencode/plugin-eslint"
  ]
}</code></pre>
<h2>13.3 SDK 使用</h2>
<pre><code>npm install opencode</code></pre>
<pre><code>import { opencode } from 'opencode';

// 运行任务
const result = await opencode.run("优化这段代码", {
  files: ["src/foo.ts"],
  model: "anthropic/claude-sonnet-4-5"
});

// 创建自定义 Agent
const agent = opencode.createAgent({
  name: "my-agent",
  instructions: "你是代码审查专家"
});

// 流式响应
const stream = opencode.runStream("解释这段代码", {
  files: ["src/bar.ts"]
});
for await (const chunk of stream) {
  process.stdout.write(chunk);
}</code></pre>
<h2>13.4 SDK 核心 API</h2>
<p><strong>run</strong>：运行任务，返回完整结果<br>
<strong>runStream</strong>：流式运行，逐块返回<br>
<strong>createAgent</strong>：创建自定义 Agent<br>
<strong>readFile</strong>：读取文件内容<br>
<strong>writeFile</strong>：写入文件内容<br>
<strong>executeCommand</strong>：执行 Shell 命令</p>`
        },
        {
          title: '第14章 团队协作与最佳实践',
          content: `<h2>14.1 团队 AI 工作流</h2>
<p>· 统一 AGENTS.md 模板，包含团队规范<br>
· 共享 opencode.json 配置，确保行为一致<br>
· 使用 Policies 控制权限，防止误操作<br>
· 将 AI 工作流纳入 Code Review 流程</p>
<h2>14.2 工程化沉淀</h2>
<p>将常用工作模式保存为 Skills：</p>
<pre><code>// .opencode/skills/review.md
你将以 Code Reviewer 视角审查代码变更。
关注：性能、安全、可维护性、测试覆盖。
输出格式：问题列表 + 严重程度 + 修复建议。</code></pre>
<h2>14.3 成本控制</h2>
<p>· 简单任务使用 small_model<br>
· 使用 /compact 压缩上下文<br>
· 查看 opencode stats 了解使用量<br>
· 设置 max_cost_per_session</p>
<h2>14.4 安全实践</h2>
<p>· API key 不要提交到 Git<br>
· AGENTS.md 中不写敏感信息<br>
· 使用 deny_paths 保护关键目录<br>
· require_human_approval 控制危险操作</p>
<h2>14.5 高效提示词</h2>
<p>· 一次只做一件事<br>
· 明确指定文件和作用范围<br>
· 先 Plan 再 Build<br>
· 保持 Git 工作区干净便于 /undo<br>
· 定期 /compact 避免上下文溢出</p>`
        }
      ]
    },
    {
      name: '附录',
      chapters: [
        {
          title: '附录A — Cheatsheet',
          content: `<h2>A.1 TUI 快捷键</h2>
<pre><code>Ctrl+C    取消请求
Ctrl+D    退出 TUI
Ctrl+L    清屏
Alt+Enter 换行
Tab       补全/切换焦点
↑↓        翻阅历史
p         切换到 Plan 模式
b         切换到 Build 模式</code></pre>
<h2>A.2 斜杠命令</h2>
<pre><code>/plan         Plan 模式
/build        Build 模式
/connect      配置 Provider
/compact      压缩上下文
/clear        清空会话
/undo         撤销改动
/models       查看模型
/help         帮助
/opencode set 设置配置项</code></pre>
<h2>A.3 CLI 命令</h2>
<pre><code>opencode run       运行 prompt
opencode web       启动 Web 模式
opencode server    启动 Server 模式
opencode auth      管理认证
opencode models    查看模型
opencode --help    查看帮助</code></pre>
<h2>A.4 AGENTS.md 模板</h2>
<pre><code># 项目概述
# 技术栈
# 代码规范
# 目录结构
# 注意事项</code></pre>`
        },
        {
          title: '附录B — 配置项速查',
          content: `<h2>B.1 通用配置</h2>
<pre><code>model             主模型
small_model       轻量模型
tab_autocomplete  Tab 补全
allow_browser     网络访问
allow_commands    命令执行
max_tokens        最大生成 token</code></pre>
<h2>B.2 上下文配置</h2>
<pre><code>context_window    上下文窗口大小
compact_threshold 触发压缩的阈值
auto_compact      自动压缩</code></pre>
<h2>B.3 权限配置</h2>
<pre><code>permissions       权限控制
  allow_commands  是否允许执行命令
  allow_browser   是否允许访问网络
  allow_scripts   允许的脚本类型
  deny_paths      禁用路径</code></pre>
<h2>B.4 策略配置</h2>
<pre><code>policies                  策略
  require_human_approval  需要人工确认的操作
  audit_log               审计日志
  max_cost_per_session    单次会话最大费用</code></pre>
<h2>B.5 扩展配置</h2>
<pre><code>agents         自定义 Agent
commands       自定义命令
skills         引用 Skill
plugins        引用 Plugin
mcp_servers    MCP 服务器配置
rules          规则列表</code></pre>`
        },
        {
          title: '附录C — Provider 接入模板',
          content: `<h2>C.1 先理解三件事</h2>
<table><tr><th>名称</th><th>含义</th><th>示例</th></tr>
<tr><td>Provider</td><td>模型服务提供方</td><td>OpenCode Zen、Anthropic、OpenAI</td></tr>
<tr><td>Model</td><td>具体模型</td><td>Claude、GPT、Gemini</td></tr>
<tr><td>API key</td><td>访问密钥</td><td>sk-xxxxx</td></tr></table>
<h2>C.2 OpenCode Zen</h2>
<p>在 TUI 输入 /connect，选择 OpenCode Zen，按提示操作。</p>
<h2>C.3 Anthropic</h2>
<pre><code>export ANTHROPIC_API_KEY=sk-ant-xxxxx
opencode</code></pre>
<pre><code>opencode auth login --provider anthropic</code></pre>
<pre><code>{
  "model": "anthropic/claude-sonnet-4-5"
}</code></pre>
<h2>C.4 OpenAI</h2>
<pre><code>export OPENAI_API_KEY=sk-xxxxx
export OPENAI_BASE_URL=https://your-proxy.example.com/v1
opencode</code></pre>
<h2>C.5 Google Gemini</h2>
<pre><code>export GOOGLE_GENERATIVE_AI_API_KEY=xxxxx
opencode models google</code></pre>
<h2>C.6 Ollama</h2>
<pre><code>brew install ollama
ollama pull qwen2.5-coder:14b</code></pre>
<h2>C.7 代理配置</h2>
<pre><code>export HTTPS_PROXY=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890</code></pre>
<h2>C.8 确认配置成功</h2>
<pre><code>opencode auth list
opencode models
opencode run "请只回复 OK"</code></pre>`
        },
        {
          title: '附录D — 故障排查与 FAQ',
          content: `<h2>D.1 术语速查</h2>
<table><tr><th>术语</th><th>含义</th></tr>
<tr><td>LLM</td><td>大语言模型</td></tr>
<tr><td>Provider</td><td>模型服务提供方</td></tr>
<tr><td>Model</td><td>具体模型</td></tr>
<tr><td>TUI</td><td>终端用户界面</td></tr>
<tr><td>CLI</td><td>命令行接口</td></tr>
<tr><td>Agent</td><td>AI 工作单元</td></tr>
<tr><td>MCP</td><td>Model Context Protocol</td></tr>
<tr><td>LSP</td><td>Language Server Protocol</td></tr></table>
<h2>D.2 command not found</h2>
<pre><code>export PATH="$HOME/.opencode/bin:$PATH"</code></pre>
<h2>D.3 TUI 乱码</h2>
<p>检查终端 UTF-8、字体支持 Unicode、终端宽度、使用现代终端。</p>
<h2>D.4 Provider 请求失败</h2>
<p>排查顺序：API key → 余额 → 模型名 → 代理 → Provider 限制。</p>
<h2>D.5 AI 找错文件</h2>
<p>使用 @ 明确引用、更新 AGENTS.md、先 Plan 后 Build、拆小任务。</p>
<h2>D.6 AI 改动太多</h2>
<pre><code>请只修改 <文件>，不要改动其他文件。先输出计划，确认后再执行。</code></pre>
<h2>D.7 /undo 无效</h2>
<p>确保是 Git 仓库、opencode 会话产生的改动。可改用 git restore。</p>
<h2>D.8 成本高</h2>
<p>缩短 prompt、减少引用文件、用 small_model、/compact、用便宜模型。</p>
<h2>D.9 新手先学哪些章</h2>
<p>完全新手：第 1-3 章；提升日常效率：第 4-6 章；安全工作：第 5、7、8、14 章；扩展集成：第 10-13 章。</p>`
        },
        {
          title: '附录E — 与其他工具对比',
          content: `<h2>E.1 总览</h2>
<table><tr><th>工具</th><th>主形态</th><th>开源</th><th>模型</th></tr>
<tr><td>opencode</td><td>TUI/CLI/Web/IDE/SDK</td><td>是</td><td>多 Provider</td></tr>
<tr><td>Cursor</td><td>IDE</td><td>否</td><td>多模型</td></tr>
<tr><td>Claude Code</td><td>终端/IDE</td><td>否</td><td>Claude</td></tr>
<tr><td>Aider</td><td>终端</td><td>是</td><td>多模型</td></tr>
<tr><td>GitHub Copilot</td><td>IDE 插件</td><td>否</td><td>GitHub</td></tr></table>
<h2>E.2 opencode 的优势</h2>
<p>· 开源可审计<br>
· 终端体验强<br>
· Provider-agnostic<br>
· 多形态（TUI/CLI/Web/IDE/SDK）<br>
· Agents/Skills/Plugins/MCP 扩展体系完整<br>
· 适合团队工程化沉淀</p>
<h2>E.3 opencode 的局限</h2>
<p>· 中文资料较少<br>
· 配置细节可能变化<br>
· TUI 对终端有要求<br>
· 高阶扩展学习曲线较高</p>
<h2>E.4 选型建议</h2>
<p>VS Code 用户 → Cursor 或 opencode IDE 插件<br>
终端/SSH 用户 → opencode 或 Claude Code<br>
开源需求 → opencode / Aider<br>
团队统一 AI 工作流 → opencode<br>
只需要补全 → GitHub Copilot<br>
平台集成 → opencode Server/SDK</p>
<h2>E.5 组合使用</h2>
<p>Copilot 负责补全 + opencode 负责任务<br>
Cursor IDE 开发 + opencode 终端/服务器<br>
Aider Git 流程 + opencode Agent/MCP 集成</p>`
        }
      ]
    }
  ]
};
