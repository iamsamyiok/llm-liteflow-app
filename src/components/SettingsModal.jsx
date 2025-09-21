import { useState, useEffect } from 'react';
import { X, Save, Settings } from 'lucide-react';
import useStore from '../store/useStore';

const SettingsModal = ({ isOpen, onClose }) => {
  const { llmConfig, setLlmConfig } = useStore();
  const [formData, setFormData] = useState({
    baseUrl: '',
    apiKey: '',
    modelName: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(llmConfig);
    }
  }, [isOpen, llmConfig]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLlmConfig(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-bold">LLM 设置</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base URL
            </label>
            <input
              type="url"
              value={formData.baseUrl}
              onChange={(e) => handleChange('baseUrl', e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              支持 OpenAI API 格式的服务地址
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder="sk-..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              您的 API 密钥，仅存储在本地浏览器
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              模型名称
            </label>
            <input
              type="text"
              value={formData.modelName}
              onChange={(e) => handleChange('modelName', e.target.value)}
              placeholder="gpt-3.5-turbo"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              要使用的模型名称
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <h4 className="font-medium text-sm text-yellow-800 mb-1">常用配置示例</h4>
            <div className="text-xs text-yellow-700 space-y-1">
              <div><strong>OpenAI:</strong> https://api.openai.com/v1</div>
              <div><strong>Groq:</strong> https://api.groq.com/openai/v1</div>
              <div><strong>Together:</strong> https://api.together.xyz/v1</div>
              <div><strong>本地 Ollama:</strong> http://localhost:11434/v1</div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-1" />
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;

