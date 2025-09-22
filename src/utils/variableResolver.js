/**
 * 变量引用解析器
 * 支持以下语法：
 * - {{input}} - 引用上游节点的输出
 * - {{node_id}} - 引用指定节点的输出
 * - {{node_id.field}} - 引用指定节点的特定字段
 */

export class VariableResolver {
  constructor(nodes, edges, nodeOutputs) {
    this.nodes = nodes;
    this.edges = edges;
    this.nodeOutputs = nodeOutputs;
  }

  /**
   * 解析文本中的变量引用
   * @param {string} text - 包含变量引用的文本
   * @param {string} currentNodeId - 当前节点ID
   * @returns {string} - 解析后的文本
   */
  resolveVariables(text, currentNodeId) {
    if (!text || typeof text !== 'string') {
      return text;
    }

    // 匹配 {{variable}} 格式的变量
    const variablePattern = /\{\{([^}]+)\}\}/g;
    
    return text.replace(variablePattern, (match, variableName) => {
      const trimmedName = variableName.trim();
      
      try {
        return this.resolveVariable(trimmedName, currentNodeId);
      } catch (error) {
        console.warn(`变量解析失败: ${match}`, error);
        return match; // 保留原始变量引用
      }
    });
  }

  /**
   * 解析单个变量
   * @param {string} variableName - 变量名
   * @param {string} currentNodeId - 当前节点ID
   * @returns {string} - 变量值
   */
  resolveVariable(variableName, currentNodeId) {
    // 处理 input 特殊变量
    if (variableName === 'input') {
      return this.getUpstreamInputs(currentNodeId);
    }

    // 处理节点引用 (node_id 或 node_id.field)
    const parts = variableName.split('.');
    const nodeId = parts[0];
    const field = parts[1];

    // 检查节点是否存在
    const targetNode = this.nodes.find(node => node.id === nodeId);
    if (!targetNode) {
      throw new Error(`节点 ${nodeId} 不存在`);
    }

    // 获取节点输出
    const nodeOutput = this.nodeOutputs.get(nodeId);
    
    if (field) {
      // 如果指定了字段，尝试从节点数据或输出中获取
      if (targetNode.data && targetNode.data[field] !== undefined) {
        return targetNode.data[field];
      }
      
      // 如果输出是对象，尝试获取指定字段
      if (typeof nodeOutput === 'object' && nodeOutput !== null) {
        return nodeOutput[field] || '';
      }
      
      throw new Error(`节点 ${nodeId} 没有字段 ${field}`);
    }

    // 返回节点的输出值
    return nodeOutput || '';
  }

  /**
   * 获取上游节点的输入
   * @param {string} nodeId - 节点ID
   * @returns {string} - 上游输入的合并文本
   */
  getUpstreamInputs(nodeId) {
    const upstreamEdges = this.edges.filter(edge => edge.target === nodeId);
    const inputs = [];

    upstreamEdges.forEach(edge => {
      const sourceOutput = this.nodeOutputs.get(edge.source);
      if (sourceOutput) {
        inputs.push(sourceOutput);
      }
    });

    return inputs.join('\n');
  }

  /**
   * 获取文本中所有的变量引用
   * @param {string} text - 文本
   * @returns {Array} - 变量引用列表
   */
  extractVariables(text) {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const variablePattern = /\{\{([^}]+)\}\}/g;
    const variables = [];
    let match;

    while ((match = variablePattern.exec(text)) !== null) {
      variables.push({
        full: match[0],
        name: match[1].trim(),
        start: match.index,
        end: match.index + match[0].length
      });
    }

    return variables;
  }

  /**
   * 验证变量引用是否有效
   * @param {string} text - 文本
   * @param {string} currentNodeId - 当前节点ID
   * @returns {Array} - 无效变量列表
   */
  validateVariables(text, currentNodeId) {
    const variables = this.extractVariables(text);
    const invalidVariables = [];

    variables.forEach(variable => {
      try {
        this.resolveVariable(variable.name, currentNodeId);
      } catch (error) {
        invalidVariables.push({
          variable: variable.full,
          error: error.message
        });
      }
    });

    return invalidVariables;
  }

  /**
   * 获取可用的变量列表
   * @param {string} currentNodeId - 当前节点ID
   * @returns {Array} - 可用变量列表
   */
  getAvailableVariables(currentNodeId) {
    const variables = [];

    // 添加 input 变量
    const upstreamEdges = this.edges.filter(edge => edge.target === currentNodeId);
    if (upstreamEdges.length > 0) {
      variables.push({
        name: 'input',
        description: '上游节点的输出',
        example: '{{input}}'
      });
    }

    // 添加所有其他节点的变量
    this.nodes.forEach(node => {
      if (node.id !== currentNodeId) {
        variables.push({
          name: node.id,
          description: `${node.data.label || node.type} 节点的输出`,
          example: `{{${node.id}}}`,
          nodeType: node.type,
          nodeLabel: node.data.label
        });

        // 如果节点有特殊字段，也添加进来
        if (node.data) {
          Object.keys(node.data).forEach(field => {
            if (field !== 'label' && field !== 'status' && field !== 'error') {
              variables.push({
                name: `${node.id}.${field}`,
                description: `${node.data.label || node.type} 节点的 ${field} 字段`,
                example: `{{${node.id}.${field}}}`,
                nodeType: node.type,
                nodeLabel: node.data.label,
                field: field
              });
            }
          });
        }
      }
    });

    return variables;
  }
}

export default VariableResolver;

