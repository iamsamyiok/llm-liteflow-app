# LiteFlow - 轻量级 LLM 工作流编排器

一个简单易用的可视化 LLM 工作流编排应用，支持拖拽式节点编排，让您轻松构建和执行 AI 工作流。

## ✨ 特性

- 🎨 **可视化编排**: 拖拽式节点编排，直观易用
- 🔗 **多种节点类型**: 输入、LLM、代码执行、条件判断、合并、输出
- ⚙️ **灵活配置**: 支持多种 LLM 服务提供商
- 🧠 **智能提示词**: LLM节点支持系统提示词和用户提示词配置
- 🔄 **变量引用**: 支持{{}}语法引用节点输出，实现复杂数据流
- 🗑️ **节点管理**: 选中节点后按Delete键删除，支持批量操作
- 💾 **工作流管理**: 保存、加载、导入、导出工作流
- 🚀 **一键部署**: 无需后端，纯前端应用
- 🔒 **隐私安全**: 配置信息仅存储在本地浏览器

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
pnpm run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
# 或
pnpm run build
```

## 📖 使用指南

### 1. 配置 LLM 设置

首次使用需要配置 LLM 服务：

1. 点击右上角的 "LLM设置" 按钮
2. 填入您的 API 配置：
   - **Base URL**: API 服务地址
   - **API Key**: 您的 API 密钥
   - **Model Name**: 要使用的模型名称

#### 常用配置示例

| 服务商 | Base URL | 模型示例 |
|--------|----------|----------|
| OpenAI | `https://api.openai.com/v1` | `gpt-3.5-turbo`, `gpt-4` |
| Groq | `https://api.groq.com/openai/v1` | `llama2-70b-4096` |
| Together AI | `https://api.together.xyz/v1` | `meta-llama/Llama-2-70b-chat-hf` |
| 本地 Ollama | `http://localhost:11434/v1` | `llama2`, `codellama` |

### 2. 构建工作流

#### 可用节点类型

- **🔵 输入节点**: 工作流的起始点，输入初始文本
- **🟣 LLM 节点**: 调用大语言模型处理文本
  - 支持系统提示词配置：设置AI的角色和行为规则
  - 支持用户提示词模板：自定义输入处理方式
  - 支持变量引用：使用{{}}语法引用其他节点输出
- **🟢 代码节点**: 执行 JavaScript 代码进行数据处理
- **🟡 条件节点**: 根据条件判断进行分支处理
- **🔵 合并节点**: 将多个输入合并为一个输出
- **🔴 输出节点**: 显示最终结果

#### 构建步骤

1. 从左侧节点库拖拽节点到画布
2. 连接节点创建数据流
3. 配置各节点的参数：
   - **LLM节点**：点击设置按钮配置系统提示词和用户提示词
   - **其他节点**：根据节点类型进行相应配置
4. 使用变量引用：
   - 在提示词中使用{{input}}引用上游输出
   - 使用{{node_id}}引用指定节点输出
   - 点击"变量"按钮查看所有可用变量
5. 点击 "运行" 执行工作流
6. 删除节点：选中节点后按Delete键删除

### 3. 工作流管理

- **保存工作流**: 将当前工作流保存到本地
- **加载工作流**: 从已保存的工作流中选择加载
- **导出工作流**: 将工作流导出为 JSON 文件
- **导入工作流**: 从 JSON 文件导入工作流

## 🛠️ 技术栈

- **前端框架**: React 18 + Vite
- **UI 组件**: Tailwind CSS + shadcn/ui
- **流程图**: React Flow
- **状态管理**: Zustand
- **图标**: Lucide React

## 📁 项目结构

```
src/
├── components/           # React 组件
│   ├── nodes/           # 自定义节点组件
│   │   ├── InputNode.jsx
│   │   ├── LLMNode.jsx
│   │   ├── CodeNode.jsx
│   │   ├── ConditionNode.jsx
│   │   ├── MergeNode.jsx
│   │   └── OutputNode.jsx
│   ├── FlowCanvas.jsx   # 主画布组件
│   ├── Header.jsx       # 头部组件
│   ├── Sidebar.jsx      # 侧边栏组件
│   ├── SettingsModal.jsx # 设置模态框
│   └── WorkflowModal.jsx # 工作流管理模态框
├── store/               # 状态管理
│   └── useStore.js      # Zustand store
├── utils/               # 工具函数
│   └── executionEngine.js # 工作流执行引擎
├── App.jsx              # 主应用组件
└── main.jsx             # 应用入口
```

## 🔧 自定义开发

### 添加新节点类型

1. 在 `src/components/nodes/` 创建新节点组件
2. 在 `src/components/FlowCanvas.jsx` 注册节点类型
3. 在 `src/components/Sidebar.jsx` 添加到节点库
4. 在 `src/utils/executionEngine.js` 添加执行逻辑

### 扩展执行引擎

在 `executionEngine.js` 中添加新的节点执行器：

```javascript
async executeCustomNode(node) {
  // 自定义节点执行逻辑
}
```

## 🔄 变量引用功能

LiteFlow 支持强大的变量引用系统，让您可以在节点间灵活传递数据。

### 变量语法

- `{{input}}` - 引用上游节点的输出
- `{{node_id}}` - 引用指定节点的输出  
- `{{node_id.field}}` - 引用节点的特定字段

### 使用方法

1. **在LLM节点中使用**：
   - 系统提示词：`你是一个{{role}}，请按照以下规则工作...`
   - 用户提示词：`请分析以下内容：{{input}}`

2. **在代码节点中使用**：
   ```javascript
   const data = "{{input}}";
   const processed = data.toUpperCase();
   result = processed;
   ```

3. **查看可用变量**：
   - 点击任意输入框旁的"变量"按钮
   - 查看所有可用的变量列表
   - 点击变量名复制，双击插入到文本中

### 变量解析规则

- 变量在节点执行时实时解析
- 支持嵌套引用和复杂数据结构
- 自动处理数据类型转换
- 提供详细的错误提示

## 🚀 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

### Netlify 部署

1. 构建项目: `npm run build`
2. 将 `dist` 文件夹上传到 Netlify
3. 配置重定向规则

### 静态文件服务器

```bash
npm run build
npx serve dist
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [React Flow](https://reactflow.dev/) - 强大的流程图库
- [Zustand](https://github.com/pmndrs/zustand) - 轻量级状态管理
- [Tailwind CSS](https://tailwindcss.com/) - 实用的 CSS 框架
- [Lucide](https://lucide.dev/) - 美观的图标库

