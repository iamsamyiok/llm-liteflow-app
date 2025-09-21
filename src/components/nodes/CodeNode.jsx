import { Handle, Position } from 'reactflow';
import { useState } from 'react';
import useStore from '../../store/useStore';

const CodeNode = ({ id, data }) => {
  const [code, setCode] = useState(data.code || '// 在这里编写JavaScript代码\n// 输入数据通过 inputs 数组获取\n// 请将结果赋值给 result 变量\n\nconst result = inputs[0] || "Hello World";');
  const updateNodeData = useStore(state => state.updateNodeData);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    updateNodeData(id, { code: newCode });
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'executing': return 'border-orange-500 bg-orange-50';
      case 'completed': return 'border-green-500 bg-green-50';
      case 'error': return 'border-red-500 bg-red-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 ${getStatusColor()} min-w-[300px]`}>
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        <div className="font-bold text-sm">{data.label}</div>
      </div>
      
      <textarea
        value={code}
        onChange={handleCodeChange}
        placeholder="编写JavaScript代码..."
        className="w-full p-2 border border-gray-300 rounded text-xs font-mono resize-none"
        rows={6}
      />
      
      {data.value && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs max-h-20 overflow-y-auto">
          <div className="font-semibold text-gray-600 mb-1">输出:</div>
          {data.value}
        </div>
      )}
      
      {data.status === 'executing' && (
        <div className="text-xs text-orange-600 mt-1 flex items-center">
          <div className="animate-spin w-3 h-3 border border-orange-500 border-t-transparent rounded-full mr-1"></div>
          执行中...
        </div>
      )}
      
      {data.status === 'error' && (
        <div className="text-xs text-red-600 mt-1">错误: {data.error}</div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default CodeNode;

