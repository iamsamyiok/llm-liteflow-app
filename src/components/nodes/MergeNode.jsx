import { Handle, Position } from 'reactflow';
import { useState } from 'react';
import useStore from '../../store/useStore';

const MergeNode = ({ id, data }) => {
  const [separator, setSeparator] = useState(data.separator || '\n');
  const updateNodeData = useStore(state => state.updateNodeData);

  const handleSeparatorChange = (e) => {
    const newSeparator = e.target.value;
    setSeparator(newSeparator);
    updateNodeData(id, { separator: newSeparator });
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
        <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
        <div className="font-bold text-sm">{data.label}</div>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">分隔符:</div>
      <select
        value={separator}
        onChange={handleSeparatorChange}
        className="w-full p-2 border border-gray-300 rounded text-xs"
      >
        <option value="\n">换行</option>
        <option value=" ">空格</option>
        <option value=", ">逗号</option>
        <option value=" | ">竖线</option>
        <option value="">无分隔符</option>
      </select>
      
      {data.value && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs max-h-20 overflow-y-auto">
          <div className="font-semibold text-gray-600 mb-1">合并结果:</div>
          {data.value}
        </div>
      )}
      
      {data.status === 'executing' && (
        <div className="text-xs text-orange-600 mt-1 flex items-center">
          <div className="animate-spin w-3 h-3 border border-orange-500 border-t-transparent rounded-full mr-1"></div>
          合并中...
        </div>
      )}
      
      {data.status === 'error' && (
        <div className="text-xs text-red-600 mt-1">错误: {data.error}</div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-indigo-500"
        style={{ top: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-indigo-500"
        style={{ top: '70%' }}
        id="input2"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-indigo-500"
      />
    </div>
  );
};

export default MergeNode;

