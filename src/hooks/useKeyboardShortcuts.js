import { useEffect } from 'react';
import useStore from '../store/useStore';
import { ExecutionEngine } from '../utils/executionEngine';

export const useKeyboardShortcuts = (callbacks = {}) => {
  const { 
    nodes, 
    edges, 
    llmConfig, 
    isExecuting, 
    setIsExecuting, 
    updateNodeData 
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // 如果在输入框中，不处理快捷键
      if (event.target.tagName === 'INPUT' || 
          event.target.tagName === 'TEXTAREA' || 
          event.target.contentEditable === 'true') {
        return;
      }

      const { ctrlKey, metaKey, key } = event;
      const isModifierPressed = ctrlKey || metaKey;

      // Ctrl/Cmd + S: 保存工作流
      if (isModifierPressed && key === 's') {
        event.preventDefault();
        callbacks.onSave?.();
      }

      // Ctrl/Cmd + O: 打开工作流管理
      if (isModifierPressed && key === 'o') {
        event.preventDefault();
        callbacks.onOpen?.();
      }

      // Ctrl/Cmd + R: 运行工作流
      if (isModifierPressed && key === 'r') {
        event.preventDefault();
        if (!isExecuting && llmConfig.baseUrl && llmConfig.apiKey) {
          handleExecute();
        }
      }

      // Delete: 删除选中节点
      if (key === 'Delete') {
        event.preventDefault();
        callbacks.onDelete?.();
      }

      // F: 适应画布
      if (key === 'f' || key === 'F') {
        event.preventDefault();
        callbacks.onFitView?.();
      }

      // Escape: 关闭模态框
      if (key === 'Escape') {
        callbacks.onEscape?.();
      }

      // ?: 显示帮助
      if (key === '?' && !isModifierPressed) {
        event.preventDefault();
        callbacks.onHelp?.();
      }
    };

    const handleExecute = async () => {
      try {
        setIsExecuting(true);
        const engine = new ExecutionEngine(nodes, edges, llmConfig, updateNodeData);
        await engine.execute();
      } catch (error) {
        console.error('执行失败:', error);
      } finally {
        setIsExecuting(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, llmConfig, isExecuting, callbacks, setIsExecuting, updateNodeData]);
};

export default useKeyboardShortcuts;

