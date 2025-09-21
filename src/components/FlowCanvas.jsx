import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useStore from '../store/useStore';
import InputNode from './nodes/InputNode';
import LLMNode from './nodes/LLMNode';
import CodeNode from './nodes/CodeNode';
import ConditionNode from './nodes/ConditionNode';
import MergeNode from './nodes/MergeNode';
import OutputNode from './nodes/OutputNode';

const nodeTypes = {
  input: InputNode,
  llm: LLMNode,
  code: CodeNode,
  condition: ConditionNode,
  merge: MergeNode,
  output: OutputNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const FlowCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const { nodes, edges, setNodes, setEdges } = useStore();
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);
  const { project } = useReactFlow();

  // 同步本地状态和全局状态
  const syncNodes = useCallback((newNodes) => {
    setLocalNodes(newNodes);
    setNodes(newNodes);
  }, [setLocalNodes, setNodes]);

  const syncEdges = useCallback((newEdges) => {
    setLocalEdges(newEdges);
    setEdges(newEdges);
  }, [setLocalEdges, setEdges]);

  // 当全局状态变化时更新本地状态
  React.useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);

  React.useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(params, localEdges);
      syncEdges(newEdges);
    },
    [localEdges, syncEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/nodelabel');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { 
          label,
          value: type === 'input' ? '请输入文本...' : '',
          status: 'idle'
        },
      };

      syncNodes([...localNodes, newNode]);
    },
    [project, localNodes, syncNodes]
  );

  const onNodesChangeHandler = useCallback(
    (changes) => {
      onNodesChange(changes);
      // 延迟同步以避免频繁更新
      setTimeout(() => {
        setNodes(localNodes);
      }, 100);
    },
    [onNodesChange, localNodes, setNodes]
  );

  const onEdgesChangeHandler = useCallback(
    (changes) => {
      onEdgesChange(changes);
      // 延迟同步以避免频繁更新
      setTimeout(() => {
        setEdges(localEdges);
      }, 100);
    },
    [onEdgesChange, localEdges, setEdges]
  );

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChangeHandler}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background;
            if (n.type === 'input') return '#3b82f6';
            if (n.type === 'llm') return '#8b5cf6';
            if (n.type === 'code') return '#10b981';
            if (n.type === 'condition') return '#f59e0b';
            if (n.type === 'merge') return '#6366f1';
            if (n.type === 'output') return '#ef4444';
            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background;
            return '#fff';
          }}
          nodeBorderRadius={2}
        />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

const FlowCanvasWrapper = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
);

export default FlowCanvasWrapper;

