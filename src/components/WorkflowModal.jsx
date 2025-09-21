import { useState } from 'react';
import { X, Save, FolderOpen, Trash2, Download, Upload } from 'lucide-react';
import useStore from '../store/useStore';

const WorkflowModal = ({ isOpen, onClose }) => {
  const { 
    nodes, 
    edges, 
    savedWorkflows, 
    saveWorkflow, 
    loadWorkflow, 
    deleteWorkflow,
    setNodes,
    setEdges 
  } = useStore();
  const [workflowName, setWorkflowName] = useState('');
  const [activeTab, setActiveTab] = useState('save');

  const handleSave = () => {
    if (workflowName.trim()) {
      saveWorkflow(workflowName.trim(), { nodes, edges });
      setWorkflowName('');
      alert('工作流已保存！');
    }
  };

  const handleLoad = (workflowId) => {
    loadWorkflow(workflowId);
    onClose();
    alert('工作流已加载！');
  };

  const handleDelete = (workflowId) => {
    if (confirm('确定要删除这个工作流吗？')) {
      deleteWorkflow(workflowId);
    }
  };

  const handleExport = () => {
    const data = {
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.nodes && data.edges) {
            setNodes(data.nodes);
            setEdges(data.edges);
            onClose();
            alert('工作流已导入！');
          } else {
            alert('无效的工作流文件格式');
          }
        } catch (error) {
          alert('文件解析失败');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">工作流管理</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex space-x-1 mb-4">
          <button
            onClick={() => setActiveTab('save')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'save' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            保存工作流
          </button>
          <button
            onClick={() => setActiveTab('load')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'load' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            加载工作流
          </button>
          <button
            onClick={() => setActiveTab('import-export')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'import-export' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            导入/导出
          </button>
        </div>

        <div className="overflow-y-auto max-h-96">
          {activeTab === 'save' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工作流名称
                </label>
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="输入工作流名称..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={!workflowName.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                保存当前工作流
              </button>
            </div>
          )}

          {activeTab === 'load' && (
            <div className="space-y-3">
              {savedWorkflows.length === 0 ? (
                <p className="text-gray-500 text-center py-8">暂无保存的工作流</p>
              ) : (
                savedWorkflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="font-medium">{workflow.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(workflow.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLoad(workflow.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center"
                      >
                        <FolderOpen className="w-3 h-3 mr-1" />
                        加载
                      </button>
                      <button
                        onClick={() => handleDelete(workflow.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        删除
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'import-export' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">导出当前工作流</h4>
                <button
                  onClick={handleExport}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出为 JSON 文件
                </button>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">导入工作流</h4>
                <label className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  选择 JSON 文件导入
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowModal;

