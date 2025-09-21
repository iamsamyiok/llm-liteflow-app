import { Handle, Position } from 'reactflow';

const OutputNode = ({ id, data }) => {
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
        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
        <div className="font-bold text-sm">{data.label}</div>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">
        最终输出结果
      </div>
      
      {data.value ? (
        <div className="p-3 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto border">
          {data.value}
        </div>
      ) : (
        <div className="p-3 bg-gray-100 rounded text-sm text-gray-500 italic">
          等待输入数据...
        </div>
      )}
      
      {data.status === 'executing' && (
        <div className="text-xs text-orange-600 mt-1 flex items-center">
          <div className="animate-spin w-3 h-3 border border-orange-500 border-t-transparent rounded-full mr-1"></div>
          处理中...
        </div>
      )}
      
      {data.status === 'error' && (
        <div className="text-xs text-red-600 mt-1">错误: {data.error}</div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500"
      />
    </div>
  );
};

export default OutputNode;

