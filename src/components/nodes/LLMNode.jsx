import { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, MessageSquare, User } from 'lucide-react';
import useStore from '../../store/useStore';
import VariableHelper from '../VariableHelper';

const LLMNode = ({ id, data }) => {
  const [showConfig, setShowConfig] = useState(false);
  const systemPromptRef = useRef(null);
  const userPromptRef = useRef(null);
  const updateNodeData = useStore(state => state.updateNodeData);

  const getStatusColor = () => {
    switch (data.status) {
      case 'executing': return 'border-orange-500 bg-orange-50';
      case 'completed': return 'border-green-500 bg-green-50';
      case 'error': return 'border-red-500 bg-red-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const handleSystemPromptChange = (e) => {
    updateNodeData(id, { systemPrompt: e.target.value });
  };

  const handleUserPromptChange = (e) => {
    updateNodeData(id, { userPrompt: e.target.value });
  };

  const handleConfigToggle = (e) => {
    e.stopPropagation();
    setShowConfig(!showConfig);
  };

  const handleInsertVariable = (variable, targetField) => {
    const textarea = targetField === 'system' ? systemPromptRef.current : userPromptRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = targetField === 'system' ? (data.systemPrompt || '') : (data.userPrompt || '');
      const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);
      
      if (targetField === 'system') {
        updateNodeData(id, { systemPrompt: newValue });
      } else {
        updateNodeData(id, { userPrompt: newValue });
      }
      
      // 重新聚焦并设置光标位置
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 ${getStatusColor()} min-w-[250px] max-w-[400px]`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <div className="font-bold text-sm">{data.label}</div>
        </div>
        <button
          onClick={handleConfigToggle}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          title="配置提示词"
        >
          <Settings className="w-3 h-3 text-gray-600" />
        </button>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">
        AI 语言模型处理
      </div>

      {showConfig && (
        <div className="mb-3 space-y-2 border-t pt-2">
          <div className="relative">
            <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
              <div className="flex items-center">
                <MessageSquare className="w-3 h-3 mr-1" />
                系统提示词
              </div>
              <VariableHelper 
                currentNodeId={id} 
                onInsertVariable={(variable) => handleInsertVariable(variable, 'system')}
              />
            </div>
            <textarea
              ref={systemPromptRef}
              value={data.systemPrompt || ''}
              onChange={handleSystemPromptChange}
              placeholder="设置AI的角色和行为规则，支持{{变量}}引用..."
              className="w-full p-2 text-xs border border-gray-300 rounded resize-none"
              rows={2}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
              <div className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                用户提示词模板
              </div>
              <VariableHelper 
                currentNodeId={id} 
                onInsertVariable={(variable) => handleInsertVariable(variable, 'user')}
              />
            </div>
            <textarea
              ref={userPromptRef}
              value={data.userPrompt || ''}
              onChange={handleUserPromptChange}
              placeholder="用户输入的处理模板，支持{{input}}、{{node_id}}等变量引用..."
              className="w-full p-2 text-xs border border-gray-300 rounded resize-none"
              rows={2}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      
      {data.value && (
        <div className="p-2 bg-gray-50 rounded text-xs max-h-20 overflow-y-auto">
          {data.value}
        </div>
      )}
      
      {data.status === 'executing' && (
        <div className="text-xs text-orange-600 mt-1 flex items-center">
          <div className="animate-spin w-3 h-3 border border-orange-500 border-t-transparent rounded-full mr-1"></div>
          正在处理...
        </div>
      )}
      
      {data.status === 'error' && (
        <div className="text-xs text-red-600 mt-1">错误: {data.error}</div>
      )}

      {/* 提示词配置状态指示 */}
      {(data.systemPrompt || data.userPrompt) && (
        <div className="flex items-center mt-1 text-xs text-purple-600">
          <Settings className="w-3 h-3 mr-1" />
          已配置提示词
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
};

export default LLMNode;

