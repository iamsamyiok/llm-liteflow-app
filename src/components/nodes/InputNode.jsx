import { Handle, Position } from 'reactflow';
import { useState } from 'react';
import useStore from '../../store/useStore';

const InputNode = ({ id, data }) => {
  const [value, setValue] = useState(data.value || '');
  const updateNodeData = useStore(state => state.updateNodeData);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateNodeData(id, { value: newValue });
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
    <div className={`px-4 py-2 shadow-md rounded-md border-2 ${getStatusColor()} min-w-[200px]`}>
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
        <div className="font-bold text-sm">{data.label}</div>
      </div>
      
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="输入文本..."
        className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
        rows={3}
      />
      
      {data.status === 'executing' && (
        <div className="text-xs text-orange-600 mt-1">执行中...</div>
      )}
      
      {data.status === 'error' && (
        <div className="text-xs text-red-600 mt-1">错误: {data.error}</div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default InputNode;

