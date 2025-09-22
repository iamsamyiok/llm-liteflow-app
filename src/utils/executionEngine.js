// 工作流执行引擎
import { VariableResolver } from './variableResolver';

export class ExecutionEngine {
  constructor(nodes, edges, llmConfig, updateNodeData) {
    this.nodes = nodes;
    this.edges = edges;
    this.llmConfig = llmConfig;
    this.updateNodeData = updateNodeData;
    this.nodeOutputs = new Map();
    this.variableResolver = new VariableResolver(nodes, edges, this.nodeOutputs);
  }

  // 拓扑排序，确定执行顺序
  topologicalSort() {
    const inDegree = new Map();
    const adjList = new Map();
    
    // 初始化
    this.nodes.forEach(node => {
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    });

    // 构建邻接表和入度
    this.edges.forEach(edge => {
      adjList.get(edge.source).push(edge.target);
      inDegree.set(edge.target, inDegree.get(edge.target) + 1);
    });

    // 拓扑排序
    const queue = [];
    const result = [];

    // 找到所有入度为0的节点
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    while (queue.length > 0) {
      const current = queue.shift();
      result.push(current);

      adjList.get(current).forEach(neighbor => {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      });
    }

    return result;
  }

  // 获取节点的输入
  getNodeInputs(nodeId) {
    const inputs = [];
    this.edges.forEach(edge => {
      if (edge.target === nodeId) {
        const output = this.nodeOutputs.get(edge.source);
        if (output !== undefined) {
          inputs.push(output);
        }
      }
    });
    return inputs;
  }

  // 执行输入节点
  async executeInputNode(node) {
    this.updateNodeData(node.id, { status: 'executing' });
    
    try {
      const output = node.data.value || '';
      this.nodeOutputs.set(node.id, output);
      this.updateNodeData(node.id, { 
        status: 'completed',
        value: output 
      });
      return output;
    } catch (error) {
      this.updateNodeData(node.id, { 
        status: 'error',
        error: error.message 
      });
      throw error;
    }
  }

  // 执行LLM节点
  async executeLlmNode(node) {
    this.updateNodeData(node.id, { status: 'executing' });
    
    try {
      const inputs = this.getNodeInputs(node.id);
      const inputText = inputs.join('\n');

      if (!this.llmConfig.baseUrl || !this.llmConfig.apiKey) {
        throw new Error('请先配置LLM设置');
      }

      // 构建消息数组
      const messages = [];
      
      // 添加系统提示词（支持变量引用）
      if (node.data.systemPrompt) {
        const resolvedSystemPrompt = this.variableResolver.resolveVariables(
          node.data.systemPrompt, 
          node.id
        );
        messages.push({
          role: 'system',
          content: resolvedSystemPrompt
        });
      }
      
      // 处理用户提示词模板（支持变量引用）
      let userContent;
      if (node.data.userPrompt) {
        // 先解析变量引用，再替换{{input}}
        let resolvedUserPrompt = this.variableResolver.resolveVariables(
          node.data.userPrompt, 
          node.id
        );
        // 替换剩余的{{input}}变量（向后兼容）
        userContent = resolvedUserPrompt.replace(/\{\{input\}\}/g, inputText);
      } else {
        // 如果没有用户提示词模板，直接使用输入
        userContent = inputText;
      }
      
      messages.push({
        role: 'user',
        content: userContent
      });

      const response = await fetch(`${this.llmConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.llmConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: this.llmConfig.modelName,
          messages: messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const output = data.choices[0].message.content;
      
      this.nodeOutputs.set(node.id, output);
      this.updateNodeData(node.id, { 
        status: 'completed',
        value: output 
      });
      
      return output;
    } catch (error) {
      this.updateNodeData(node.id, { 
        status: 'error',
        error: error.message 
      });
      throw error;
    }
  }

  // 执行代码节点
  async executeCodeNode(node) {
    this.updateNodeData(node.id, { status: 'executing' });
    
    try {
      const inputs = this.getNodeInputs(node.id);
      let code = node.data.code || '';
      
      // 解析代码中的变量引用
      code = this.variableResolver.resolveVariables(code, node.id);
      
      // 创建一个安全的执行环境
      const func = new Function('inputs', 'console', code + '\nreturn result;');
      const consoleOutput = [];
      const mockConsole = {
        log: (...args) => consoleOutput.push(args.join(' ')),
        error: (...args) => consoleOutput.push('ERROR: ' + args.join(' ')),
        warn: (...args) => consoleOutput.push('WARN: ' + args.join(' ')),
      };
      
      const result = func(inputs, mockConsole);
      const output = result !== undefined ? String(result) : consoleOutput.join('\n');
      
      this.nodeOutputs.set(node.id, output);
      this.updateNodeData(node.id, { 
        status: 'completed',
        value: output 
      });
      
      return output;
    } catch (error) {
      this.updateNodeData(node.id, { 
        status: 'error',
        error: error.message 
      });
      throw error;
    }
  }

  // 执行条件节点
  async executeConditionNode(node) {
    this.updateNodeData(node.id, { status: 'executing' });
    
    try {
      const inputs = this.getNodeInputs(node.id);
      const input = inputs[0] || '';
      const condition = node.data.condition || '';
      
      // 简单的条件判断
      let result = false;
      if (condition.includes('包含')) {
        const keyword = condition.replace('包含', '').trim();
        result = input.includes(keyword);
      } else if (condition.includes('长度大于')) {
        const length = parseInt(condition.replace('长度大于', '').trim());
        result = input.length > length;
      } else if (condition.includes('等于')) {
        const value = condition.replace('等于', '').trim();
        result = input === value;
      }
      
      const output = result ? 'true' : 'false';
      this.nodeOutputs.set(node.id, output);
      this.updateNodeData(node.id, { 
        status: 'completed',
        value: output 
      });
      
      return output;
    } catch (error) {
      this.updateNodeData(node.id, { 
        status: 'error',
        error: error.message 
      });
      throw error;
    }
  }

  // 执行合并节点
  async executeMergeNode(node) {
    this.updateNodeData(node.id, { status: 'executing' });
    
    try {
      const inputs = this.getNodeInputs(node.id);
      const separator = node.data.separator || '\n';
      const output = inputs.join(separator);
      
      this.nodeOutputs.set(node.id, output);
      this.updateNodeData(node.id, { 
        status: 'completed',
        value: output 
      });
      
      return output;
    } catch (error) {
      this.updateNodeData(node.id, { 
        status: 'error',
        error: error.message 
      });
      throw error;
    }
  }

  // 执行输出节点
  async executeOutputNode(node) {
    this.updateNodeData(node.id, { status: 'executing' });
    
    try {
      const inputs = this.getNodeInputs(node.id);
      const output = inputs.join('\n');
      
      this.nodeOutputs.set(node.id, output);
      this.updateNodeData(node.id, { 
        status: 'completed',
        value: output 
      });
      
      return output;
    } catch (error) {
      this.updateNodeData(node.id, { 
        status: 'error',
        error: error.message 
      });
      throw error;
    }
  }

  // 执行单个节点
  async executeNode(node) {
    switch (node.type) {
      case 'input':
        return await this.executeInputNode(node);
      case 'llm':
        return await this.executeLlmNode(node);
      case 'code':
        return await this.executeCodeNode(node);
      case 'condition':
        return await this.executeConditionNode(node);
      case 'merge':
        return await this.executeMergeNode(node);
      case 'output':
        return await this.executeOutputNode(node);
      default:
        throw new Error(`未知的节点类型: ${node.type}`);
    }
  }

  // 执行整个工作流
  async execute() {
    try {
      // 重置所有节点状态
      this.nodes.forEach(node => {
        this.updateNodeData(node.id, { status: 'idle', error: null });
      });

      this.nodeOutputs.clear();
      
      // 获取执行顺序
      const executionOrder = this.topologicalSort();
      
      if (executionOrder.length !== this.nodes.length) {
        throw new Error('工作流中存在循环依赖');
      }

      // 按顺序执行节点
      for (const nodeId of executionOrder) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
          await this.executeNode(node);
          // 添加小延迟以便用户看到执行过程
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      return true;
    } catch (error) {
      console.error('工作流执行失败:', error);
      throw error;
    }
  }
}

