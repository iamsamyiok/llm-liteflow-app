import { useState } from 'react';
import { Play, Settings, Save, FolderOpen, RotateCcw, Zap, HelpCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { ExecutionEngine } from '../utils/executionEngine';
import SettingsModal from './SettingsModal';
import WorkflowModal from './WorkflowModal';
import HelpModal from './HelpModal';
import { showNotification } from './NotificationSystem';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

const Header = () => {
  const { 
    nodes, 
    edges, 
    llmConfig, 
    isExecuting, 
    setIsExecuting, 
    updateNodeData,
    setNodes,
    setEdges 
  } = useStore();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleExecute = async () => {
    if (isExecuting) return;
    
    try {
      setIsExecuting(true);
      showNotification('info', '开始执行', '工作流正在运行...');
      const engine = new ExecutionEngine(nodes, edges, llmConfig, updateNodeData);
      await engine.execute();
      showNotification('success', '执行完成', '工作流已成功执行');
    } catch (error) {
      showNotification('error', '执行失败', error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置所有节点状态吗？')) {
      nodes.forEach(node => {
        updateNodeData(node.id, { 
          status: 'idle', 
          error: null,
          value: node.type === 'input' ? node.data.value : ''
        });
      });
      showNotification('success', '重置完成', '所有节点状态已重置');
    }
  };

  const handleClear = () => {
    if (confirm('确定要清空画布吗？')) {
      setNodes([]);
      setEdges([]);
      showNotification('info', '画布已清空', '所有节点和连接已删除');
    }
  };

  // 快捷键回调
  useKeyboardShortcuts({
    onSave: () => setShowWorkflow(true),
    onOpen: () => setShowWorkflow(true),
    onHelp: () => setShowHelp(true),
    onDelete: () => {
      // 删除选中的节点将由ReactFlow自动处理
      // 这里可以添加额外的删除逻辑或通知
      showNotification('info', '删除节点', '选中节点并按Delete键删除');
    },
    onEscape: () => {
      setShowSettings(false);
      setShowWorkflow(false);
      setShowHelp(false);
    }
  });

  const isConfigured = llmConfig.baseUrl && llmConfig.apiKey && llmConfig.modelName;

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">LiteFlow</h1>
              <p className="text-sm text-gray-600">轻量级 LLM 工作流编排器</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center text-sm font-medium transition-colors"
              title="帮助 (?)"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              帮助
            </button>
            
            <button
              onClick={() => setShowWorkflow(true)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center text-sm font-medium transition-colors"
              title="工作流管理 (Ctrl+O)"
            >
              <FolderOpen className="w-4 h-4 mr-1" />
              工作流
            </button>
            
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center text-sm font-medium transition-colors"
              title="重置节点状态"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </button>
            
            <button
              onClick={handleClear}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center text-sm font-medium transition-colors"
              title="清空画布"
            >
              清空
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className={`px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors ${
                isConfigured 
                  ? 'text-green-700 bg-green-50 hover:bg-green-100' 
                  : 'text-orange-700 bg-orange-50 hover:bg-orange-100'
              }`}
              title="LLM设置"
            >
              <Settings className="w-4 h-4 mr-1" />
              {isConfigured ? 'LLM已配置' : 'LLM设置'}
            </button>
            
            <button
              onClick={handleExecute}
              disabled={isExecuting || !isConfigured}
              className={`px-6 py-2 rounded-md flex items-center text-sm font-medium transition-colors ${
                isExecuting || !isConfigured
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title={isConfigured ? "运行工作流 (Ctrl+R)" : "请先配置LLM设置"}
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full mr-2"></div>
                  执行中...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  运行
                </>
              )}
            </button>
          </div>
        </div>
        
        {!isConfigured && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ 请先配置 LLM 设置才能运行工作流
            </p>
          </div>
        )}
      </header>
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
      
      <WorkflowModal 
        isOpen={showWorkflow} 
        onClose={() => setShowWorkflow(false)} 
      />
      
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
    </>
  );
};

export default Header;

