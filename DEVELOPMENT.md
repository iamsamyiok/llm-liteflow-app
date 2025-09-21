# 开发指南

本文档为 LiteFlow 项目的开发者提供详细的开发指南。

## 🛠️ 开发环境设置

### 系统要求

- Node.js 18+ 
- npm 或 pnpm
- Git

### 克隆项目

```bash
git clone https://github.com/your-username/llm-liteflow-app.git
cd llm-liteflow-app
```

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
# 使用 pnpm
pnpm run dev

# 或使用 npm
npm run dev
```

应用将在 `http://localhost:5173` 启动。

## 📁 项目结构详解

```
src/
├── components/           # React 组件
│   ├── nodes/           # 自定义节点组件
│   │   ├── InputNode.jsx      # 输入节点
│   │   ├── LLMNode.jsx        # LLM 节点
│   │   ├── CodeNode.jsx       # 代码执行节点
│   │   ├── ConditionNode.jsx  # 条件判断节点
│   │   ├── MergeNode.jsx      # 合并节点
│   │   └── OutputNode.jsx     # 输出节点
│   ├── FlowCanvas.jsx   # 主画布组件
│   ├── Header.jsx       # 头部组件
│   ├── Sidebar.jsx      # 侧边栏组件
│   ├── SettingsModal.jsx     # 设置模态框
│   ├── WorkflowModal.jsx     # 工作流管理模态框
│   ├── HelpModal.jsx         # 帮助模态框
│   └── NotificationSystem.jsx # 通知系统
├── hooks/               # 自定义 React Hooks
│   └── useKeyboardShortcuts.js # 快捷键处理
├── store/               # 状态管理
│   └── useStore.js      # Zustand store
├── utils/               # 工具函数
│   └── executionEngine.js # 工作流执行引擎
├── App.jsx              # 主应用组件
└── main.jsx             # 应用入口
```

## 🔧 核心概念

### 1. 节点系统

每个节点都是一个 React 组件，需要实现以下接口：

```jsx
const CustomNode = ({ id, data }) => {
  // id: 节点唯一标识
  // data: 节点数据，包含 label, value, status 等
  
  return (
    <div className="node-container">
      {/* 节点内容 */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
```

### 2. 状态管理

使用 Zustand 进行状态管理，主要状态包括：

- `nodes`: 画布上的所有节点
- `edges`: 节点之间的连接
- `llmConfig`: LLM 配置信息
- `isExecuting`: 工作流执行状态
- `savedWorkflows`: 保存的工作流

### 3. 执行引擎

`ExecutionEngine` 类负责工作流的执行：

```javascript
const engine = new ExecutionEngine(nodes, edges, llmConfig, updateNodeData);
await engine.execute();
```

执行流程：
1. 拓扑排序确定执行顺序
2. 按顺序执行每个节点
3. 传递数据到下游节点
4. 更新节点状态

## 🎨 添加新节点类型

### 1. 创建节点组件

在 `src/components/nodes/` 创建新的节点组件：

```jsx
// src/components/nodes/CustomNode.jsx
import { Handle, Position } from 'reactflow';
import useStore from '../../store/useStore';

const CustomNode = ({ id, data }) => {
  const updateNodeData = useStore(state => state.updateNodeData);
  
  // 节点逻辑
  
  return (
    <div className="custom-node">
      {/* 节点UI */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNode;
```

### 2. 注册节点类型

在 `src/components/FlowCanvas.jsx` 中注册：

```javascript
import CustomNode from './nodes/CustomNode';

const nodeTypes = {
  // 现有节点类型...
  custom: CustomNode,
};
```

### 3. 添加到侧边栏

在 `src/components/Sidebar.jsx` 中添加：

```javascript
const nodeTypes = [
  // 现有节点...
  { 
    type: 'custom', 
    label: '自定义节点', 
    color: 'bg-purple-500', 
    description: '自定义功能节点' 
  },
];
```

### 4. 实现执行逻辑

在 `src/utils/executionEngine.js` 中添加执行器：

```javascript
async executeCustomNode(node) {
  this.updateNodeData(node.id, { status: 'executing' });
  
  try {
    const inputs = this.getNodeInputs(node.id);
    // 自定义处理逻辑
    const output = processInputs(inputs);
    
    this.nodeOutputs.set(node.id, output);
    this.updateNodeData(node.id, { 
      status: 'completed',
      value: output 
    });
    
    return output;
  } catch (error) {
    this.updateNodeData(node.id, { 
      status: 'error',
      error: error.message 
    });
    throw error;
  }
}
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm run test

# 运行测试并监听文件变化
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

### 编写测试

为新组件编写测试：

```javascript
// src/components/__tests__/CustomNode.test.jsx
import { render, screen } from '@testing-library/react';
import CustomNode from '../nodes/CustomNode';

test('renders custom node', () => {
  const props = {
    id: 'test-node',
    data: { label: 'Test Node', value: 'test' }
  };
  
  render(<CustomNode {...props} />);
  expect(screen.getByText('Test Node')).toBeInTheDocument();
});
```

## 🎯 代码规范

### ESLint 配置

项目使用 ESLint 进行代码检查：

```bash
# 检查代码
npm run lint

# 自动修复
npm run lint:fix
```

### 提交规范

使用 Conventional Commits 规范：

```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建工具或依赖更新
```

## 🚀 构建和部署

### 本地构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 部署选项

1. **Vercel** (推荐)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **GitHub Pages**
   - 推送代码到 GitHub
   - GitHub Actions 自动部署

4. **Docker**
   ```bash
   docker build -t liteflow .
   docker run -p 80:80 liteflow
   ```

5. **使用部署脚本**
   ```bash
   ./scripts/deploy.sh
   ```

## 🐛 调试技巧

### 1. React DevTools

安装 React DevTools 浏览器扩展来调试组件状态。

### 2. Zustand DevTools

在开发环境中启用 Zustand DevTools：

```javascript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    // store 配置
  )
);
```

### 3. 控制台调试

在浏览器控制台中访问全局状态：

```javascript
// 获取当前状态
window.__ZUSTAND_STORE__.getState()

// 监听状态变化
window.__ZUSTAND_STORE__.subscribe(console.log)
```

## 📚 相关资源

- [React Flow 文档](https://reactflow.dev/)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Vite 文档](https://vitejs.dev/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

