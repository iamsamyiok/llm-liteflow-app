import { useState } from 'react';
import { HelpCircle, Copy, Check, Variable } from 'lucide-react';
import useStore from '../store/useStore';
import { VariableResolver } from '../utils/variableResolver';

const VariableHelper = ({ currentNodeId, onInsertVariable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedVariable, setCopiedVariable] = useState(null);
  const { nodes, edges } = useStore();

  const variableResolver = new VariableResolver(nodes, edges, new Map());
  const availableVariables = variableResolver.getAvailableVariables(currentNodeId);

  const handleCopyVariable = async (variableExample) => {
    try {
      await navigator.clipboard.writeText(variableExample);
      setCopiedVariable(variableExample);
      setTimeout(() => setCopiedVariable(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleInsertVariable = (variableExample) => {
    if (onInsertVariable) {
      onInsertVariable(variableExample);
    }
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
        title="查看可用变量"
      >
        <Variable className="w-3 h-3 mr-1" />
        变量
      </button>
    );
  }

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[300px] max-w-[400px]">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Variable className="w-4 h-4 mr-2 text-blue-600" />
            <h4 className="font-medium text-sm">可用变量</h4>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          点击变量名复制，双击插入到文本中
        </p>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {availableVariables.length === 0 ? (
          <div className="p-3 text-xs text-gray-500 text-center">
            暂无可用变量
          </div>
        ) : (
          <div className="p-2">
            {availableVariables.map((variable, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group"
                onClick={() => handleCopyVariable(variable.example)}
                onDoubleClick={() => handleInsertVariable(variable.example)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <code className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded text-blue-600">
                      {variable.example}
                    </code>
                    {copiedVariable === variable.example && (
                      <Check className="w-3 h-3 ml-1 text-green-600" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5 truncate">
                    {variable.description}
                  </div>
                  {variable.nodeLabel && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      来源: {variable.nodeLabel}
                    </div>
                  )}
                </div>
                <Copy className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="flex items-center mb-1">
            <HelpCircle className="w-3 h-3 mr-1" />
            <span className="font-medium">使用说明:</span>
          </div>
          <ul className="space-y-1 ml-4">
            <li>• <code>{'{{input}}'}</code> - 引用上游节点输出</li>
            <li>• <code>{'{{node_id}}'}</code> - 引用指定节点输出</li>
            <li>• <code>{'{{node_id.field}}'}</code> - 引用节点特定字段</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VariableHelper;

