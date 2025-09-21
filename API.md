# API 文档

LiteFlow 支持多种 LLM 服务提供商的 API。本文档详细说明了如何配置和使用不同的 API。

## 🔧 支持的 API 格式

LiteFlow 使用标准的 OpenAI API 格式，兼容大多数 LLM 服务提供商。

### 基本请求格式

```javascript
POST {baseUrl}/chat/completions
Content-Type: application/json
Authorization: Bearer {apiKey}

{
  "model": "{modelName}",
  "messages": [
    {
      "role": "user",
      "content": "用户输入的文本"
    }
  ],
  "temperature": 0.7
}
```

### 响应格式

```javascript
{
  "choices": [
    {
      "message": {
        "content": "AI 生成的回复"
      }
    }
  ]
}
```

## 🌐 支持的服务提供商

### 1. OpenAI

**配置示例:**
- Base URL: `https://api.openai.com/v1`
- API Key: `sk-...`
- Model Name: `gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`

**特点:**
- 最稳定的服务
- 支持多种模型
- 响应速度快

**获取 API Key:**
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册账户并验证
3. 在 API Keys 页面创建新的 API Key

### 2. Groq

**配置示例:**
- Base URL: `https://api.groq.com/openai/v1`
- API Key: `gsk_...`
- Model Name: `llama2-70b-4096`, `mixtral-8x7b-32768`

**特点:**
- 极快的推理速度
- 免费额度较高
- 支持开源模型

**获取 API Key:**
1. 访问 [Groq Console](https://console.groq.com/)
2. 注册账户
3. 在 API Keys 页面创建 API Key

### 3. Together AI

**配置示例:**
- Base URL: `https://api.together.xyz/v1`
- API Key: `...`
- Model Name: `meta-llama/Llama-2-70b-chat-hf`, `mistralai/Mixtral-8x7B-Instruct-v0.1`

**特点:**
- 支持多种开源模型
- 价格相对便宜
- 模型选择丰富

**获取 API Key:**
1. 访问 [Together AI](https://api.together.xyz/)
2. 注册账户
3. 在设置页面获取 API Key

### 4. Anthropic Claude (通过代理)

**配置示例:**
- Base URL: `https://api.anthropic.com/v1` (需要代理转换)
- API Key: `sk-ant-...`
- Model Name: `claude-3-sonnet-20240229`

**注意:** Claude API 格式与 OpenAI 不同，需要使用代理服务转换。

### 5. 本地 Ollama

**配置示例:**
- Base URL: `http://localhost:11434/v1`
- API Key: `ollama` (任意值)
- Model Name: `llama2`, `codellama`, `mistral`

**安装 Ollama:**
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# 启动服务
ollama serve

# 下载模型
ollama pull llama2
```

**特点:**
- 完全本地运行
- 隐私保护
- 无网络依赖
- 免费使用

### 6. Azure OpenAI

**配置示例:**
- Base URL: `https://{resource-name}.openai.azure.com/openai/deployments/{deployment-name}`
- API Key: `...`
- Model Name: `gpt-35-turbo`, `gpt-4`

**特点:**
- 企业级服务
- 数据隐私保护
- 稳定性高

## 🔐 API Key 安全

### 最佳实践

1. **永远不要在代码中硬编码 API Key**
2. **使用环境变量存储敏感信息**
3. **定期轮换 API Key**
4. **限制 API Key 权限**
5. **监控 API 使用情况**

### 本地存储

LiteFlow 将 API Key 存储在浏览器的 `localStorage` 中：

```javascript
// 存储配置
localStorage.setItem('llm-liteflow-storage', JSON.stringify({
  llmConfig: {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: 'sk-...',
    modelName: 'gpt-3.5-turbo'
  }
}));

// 读取配置
const config = JSON.parse(localStorage.getItem('llm-liteflow-storage'));
```

### 安全注意事项

- 数据仅存储在本地浏览器
- 不会发送到任何第三方服务器
- 清除浏览器数据会删除配置
- 建议定期备份重要配置

## 🚨 错误处理

### 常见错误

#### 1. 401 Unauthorized
```json
{
  "error": {
    "message": "Invalid API key",
    "type": "invalid_request_error"
  }
}
```

**解决方案:**
- 检查 API Key 是否正确
- 确认 API Key 是否有效
- 检查 API Key 权限

#### 2. 429 Rate Limit Exceeded
```json
{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error"
  }
}
```

**解决方案:**
- 等待一段时间后重试
- 升级 API 计划
- 实现请求限流

#### 3. 404 Not Found
```json
{
  "error": {
    "message": "Model not found",
    "type": "invalid_request_error"
  }
}
```

**解决方案:**
- 检查模型名称是否正确
- 确认模型是否可用
- 查看服务商文档

#### 4. CORS 错误

**错误信息:**
```
Access to fetch at 'https://api.openai.com/v1/chat/completions' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**解决方案:**
- 使用支持 CORS 的 API 服务
- 通过代理服务器转发请求
- 使用浏览器扩展禁用 CORS (仅开发环境)

## 🔧 自定义 API 集成

### 添加新的 API 提供商

1. **修改执行引擎**

```javascript
// src/utils/executionEngine.js
async executeLlmNode(node) {
  // 根据 baseUrl 判断提供商类型
  const provider = this.detectProvider(this.llmConfig.baseUrl);
  
  switch (provider) {
    case 'openai':
      return await this.executeOpenAIRequest(node);
    case 'anthropic':
      return await this.executeAnthropicRequest(node);
    case 'custom':
      return await this.executeCustomRequest(node);
    default:
      return await this.executeOpenAIRequest(node); // 默认使用 OpenAI 格式
  }
}
```

2. **实现自定义请求方法**

```javascript
async executeCustomRequest(node) {
  const inputs = this.getNodeInputs(node.id);
  const prompt = inputs.join('\n');

  const response = await fetch(`${this.llmConfig.baseUrl}/custom/endpoint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.llmConfig.apiKey}`,
    },
    body: JSON.stringify({
      // 自定义请求格式
      input: prompt,
      model: this.llmConfig.modelName,
      parameters: {
        temperature: 0.7
      }
    }),
  });

  const data = await response.json();
  // 解析自定义响应格式
  return data.output || data.result;
}
```

### 代理服务器示例

如果需要解决 CORS 问题或转换 API 格式，可以创建代理服务器：

```javascript
// proxy-server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/proxy', async (req, res) => {
  const { baseUrl, apiKey, ...requestData } = req.body;
  
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestData),
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('代理服务器运行在 http://localhost:3001');
});
```

## 📊 API 使用监控

### 请求日志

LiteFlow 在开发模式下会记录 API 请求：

```javascript
console.log('API Request:', {
  url: `${baseUrl}/chat/completions`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: requestData
});

console.log('API Response:', {
  status: response.status,
  data: responseData
});
```

### 性能监控

```javascript
const startTime = performance.now();
const response = await fetch(apiUrl, options);
const endTime = performance.now();

console.log(`API 请求耗时: ${endTime - startTime}ms`);
```

## 🔄 API 版本兼容性

### OpenAI API 版本

- **v1**: 当前稳定版本
- **Legacy**: 旧版本 (不推荐)

### 模型版本管理

```javascript
const modelVersions = {
  'gpt-3.5-turbo': 'gpt-3.5-turbo-0125',
  'gpt-4': 'gpt-4-0613',
  'gpt-4-turbo': 'gpt-4-turbo-2024-04-09'
};
```

## 📚 参考资源

- [OpenAI API 文档](https://platform.openai.com/docs/api-reference)
- [Groq API 文档](https://console.groq.com/docs)
- [Together AI 文档](https://docs.together.ai/)
- [Ollama API 文档](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Anthropic API 文档](https://docs.anthropic.com/claude/reference)

## 🆘 获取帮助

如果遇到 API 相关问题：

1. 检查 API Key 和配置
2. 查看浏览器控制台错误信息
3. 参考服务商官方文档
4. 在项目 Issues 中搜索相关问题
5. 创建新的 Issue 描述问题

