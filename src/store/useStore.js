import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // LLM配置
      llmConfig: {
        baseUrl: '',
        apiKey: '',
        modelName: '',
      },
      setLlmConfig: (config) => set({ llmConfig: config }),

      // 节点和边
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          position: { x: 100, y: 100 },
          data: { 
            label: '输入节点',
            value: '请写一首关于星空的诗',
            status: 'idle'
          },
        },
        {
          id: 'llm-1',
          type: 'llm',
          position: { x: 300, y: 100 },
          data: { 
            label: 'LLM 节点',
            value: '',
            status: 'idle'
          },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 500, y: 100 },
          data: { 
            label: '输出节点',
            value: '',
            status: 'idle'
          },
        },
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'input-1',
          target: 'llm-1',
          type: 'smoothstep',
        },
        {
          id: 'e2-3',
          source: 'llm-1',
          target: 'output-1',
          type: 'smoothstep',
        },
      ],
      
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      
      updateNodeData: (nodeId, data) => {
        const nodes = get().nodes;
        const updatedNodes = nodes.map(node => 
          node.id === nodeId 
            ? { ...node, data: { ...node.data, ...data } }
            : node
        );
        set({ nodes: updatedNodes });
      },

      // 工作流执行状态
      isExecuting: false,
      setIsExecuting: (executing) => set({ isExecuting: executing }),

      // 保存的工作流
      savedWorkflows: [],
      saveWorkflow: (name, workflow) => {
        const savedWorkflows = get().savedWorkflows;
        const newWorkflow = {
          id: Date.now().toString(),
          name,
          nodes: workflow.nodes,
          edges: workflow.edges,
          createdAt: new Date().toISOString(),
        };
        set({ savedWorkflows: [...savedWorkflows, newWorkflow] });
      },
      
      loadWorkflow: (workflowId) => {
        const workflow = get().savedWorkflows.find(w => w.id === workflowId);
        if (workflow) {
          set({ 
            nodes: workflow.nodes,
            edges: workflow.edges 
          });
        }
      },

      deleteWorkflow: (workflowId) => {
        const savedWorkflows = get().savedWorkflows.filter(w => w.id !== workflowId);
        set({ savedWorkflows });
      },
    }),
    {
      name: 'llm-liteflow-storage',
      partialize: (state) => ({
        llmConfig: state.llmConfig,
        savedWorkflows: state.savedWorkflows,
      }),
    }
  )
);

export default useStore;

