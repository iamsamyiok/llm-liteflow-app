import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/nodelabel', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { type: 'input', label: '输入节点', color: 'bg-blue-500', description: '工作流的起始点' },
    { type: 'llm', label: 'LLM 节点', color: 'bg-purple-500', description: '调用大语言模型' },
    { type: 'code', label: '代码节点', color: 'bg-green-500', description: '执行JavaScript代码' },
    { type: 'condition', label: '条件节点', color: 'bg-yellow-500', description: '条件判断逻辑' },
    { type: 'merge', label: '合并节点', color: 'bg-indigo-500', description: '合并多个输入' },
    { type: 'output', label: '输出节点', color: 'bg-red-500', description: '显示最终结果' },
  ];

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-200 rounded-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">节点库</h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-200 rounded-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="p-3 bg-white rounded-lg border border-gray-200 cursor-move hover:shadow-md transition-shadow"
            draggable
            onDragStart={(event) => onDragStart(event, node.type, node.label)}
          >
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 ${node.color} rounded-full mr-2`}></div>
              <span className="font-medium text-sm">{node.label}</span>
            </div>
            <p className="text-xs text-gray-600">{node.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-sm text-blue-800 mb-2">使用说明</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 拖拽节点到画布</li>
          <li>• 连接节点创建工作流</li>
          <li>• 配置LLM设置</li>
          <li>• 点击运行执行工作流</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

