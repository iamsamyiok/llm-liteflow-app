import { useState } from 'react';
import { X, HelpCircle, Keyboard, Mouse, Zap, Code, GitBranch } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('tutorial');

  if (!isOpen) return null;

  const tutorials = [
    {
      title: '1. 配置 LLM 设置',
      content: '点击右上角的"LLM设置"按钮，输入您的API配置信息。支持OpenAI、Groq、Together AI等服务。',
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: '2. 拖拽节点',
      content: '从左侧节点库拖拽节点到画布上。每种节点都有不同的功能和用途。',
      icon: <Mouse className="w-5 h-5" />
    },
    {
      title: '3. 连接节点',
      content: '拖拽节点边缘的连接点来创建数据流。数据会从上游节点传递到下游节点。',
      icon: <GitBranch className="w-5 h-5" />
    },
    {
      title: '4. 配置节点',
      content: '点击节点可以编辑其内容。输入节点设置初始文本，代码节点编写JavaScript代码。',
      icon: <Code className="w-5 h-5" />
    },
    {
      title: '5. 运行工作流',
      content: '点击"运行"按钮执行工作流。节点会按照连接顺序依次执行，显示实时状态。',
      icon: <Zap className="w-5 h-5" />
    }
  ];

  const shortcuts = [
    { key: 'Ctrl + S', action: '保存当前工作流' },
    { key: 'Ctrl + O', action: '打开工作流管理' },
    { key: 'Ctrl + R', action: '运行工作流' },
    { key: 'Ctrl + Z', action: '撤销操作' },
    { key: 'Delete', action: '删除选中节点' },
    { key: 'Space', action: '拖拽画布' },
    { key: 'Ctrl + +/-', action: '缩放画布' },
    { key: 'F', action: '适应画布' }
  ];

  const nodeTypes = [
    {
      name: '输入节点',
      color: 'bg-blue-500',
      description: '工作流的起始点，用于输入初始文本或数据。'
    },
    {
      name: 'LLM 节点',
      color: 'bg-purple-500',
      description: '调用大语言模型处理文本，支持各种AI服务提供商。'
    },
    {
      name: '代码节点',
      color: 'bg-green-500',
      description: '执行JavaScript代码，可以进行数据处理、计算和逻辑判断。'
    },
    {
      name: '条件节点',
      color: 'bg-yellow-500',
      description: '根据条件判断数据，支持包含、长度、相等等判断。'
    },
    {
      name: '合并节点',
      color: 'bg-indigo-500',
      description: '将多个输入合并为一个输出，可自定义分隔符。'
    },
    {
      name: '输出节点',
      color: 'bg-red-500',
      description: '显示最终结果，通常作为工作流的终点。'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-bold">使用帮助</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex space-x-1 mb-4">
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'tutorial' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            快速教程
          </button>
          <button
            onClick={() => setActiveTab('nodes')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'nodes' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            节点说明
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'shortcuts' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            快捷键
          </button>
        </div>

        <div className="overflow-y-auto max-h-96">
          {activeTab === 'tutorial' && (
            <div className="space-y-4">
              {tutorials.map((tutorial, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="text-blue-600 mt-1">
                    {tutorial.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{tutorial.title}</h4>
                    <p className="text-sm text-gray-600">{tutorial.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'nodes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodeTypes.map((node, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 ${node.color} rounded-full mr-2`}></div>
                    <h4 className="font-medium">{node.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{node.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{shortcut.action}</span>
                  <div className="flex items-center space-x-1">
                    {shortcut.key.split(' + ').map((key, keyIndex) => (
                      <span key={keyIndex} className="flex items-center">
                        <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                          {key}
                        </kbd>
                        {keyIndex < shortcut.key.split(' + ').length - 1 && (
                          <span className="mx-1 text-gray-400">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="font-medium text-sm text-blue-800 mb-1">💡 小贴士</h4>
            <p className="text-xs text-blue-700">
              LiteFlow 是一个纯前端应用，所有数据都存储在您的浏览器本地，确保隐私安全。
              您可以导出工作流为 JSON 文件进行备份或分享。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

