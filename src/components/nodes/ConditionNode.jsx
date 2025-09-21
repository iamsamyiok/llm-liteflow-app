import { Handle, Position } from 'reactflow';
import { useState } from 'react';
import useStore from '../../store/useStore';

const ConditionNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data.condition || '包含 关键词');
  const updateNodeData = useStore(state => state.updateNodeData);

  const handleConditionChange = (e) => {
    const newCondition = e.target.value;
    setCondition(newCondition);
    updateNodeData(id, { condition: newCondition });
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
        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
        <div className="font-bold text-sm">{data.label}</div>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">条件:</div>
      <input
        type="text"
        value={condition}
        onChange={handleConditionChange}
        placeholder="例: 包含 关键词"
        className="w-full p-2 border border-gray-300 rounded text-xs"
      />
      
      <div className="text-xs text-gray-500 mt-1">
        支持: 包含、长度大于、等于
      </div>
      
      {data.value && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <div className="font-semibold text-gray-600 mb-1">结果:</div>
          <span className={data.value === 'true' ? 'text-green-600' : 'text-red-600'}>
            {data.value === 'true' ? '✓ 条件满足' : '✗ 条件不满足'}
          </span>
        </div>
      )}
      
      {data.status === 'executing' && (
        <div className="text-xs text-orange-600 mt-1 flex items-center">
          <div className="animate-spin w-3 h-3 border border-orange-500 border-t-transparent rounded-full mr-1"></div>
          判断中...
        </div>
      )}
      
      {data.status === 'error' && (
        <div className="text-xs text-red-600 mt-1">错误: {data.error}</div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-yellow-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-yellow-500"
      />
    </div>
  );
};

export default ConditionNode;

