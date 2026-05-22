import type { AIConfig, AIMessage } from "@/types";
import { uid } from "@/utils/id";

export const PROVIDERS = [
  {
    key: "deepseek",
    label: "DeepSeek",
    hostname: "platform.deepseek.com",
    url: "https://platform.deepseek.com/",
  },
  {
    key: "openai",
    label: "OpenAI",
    hostname: "platform.openai.com",
    url: "https://platform.openai.com/",
  },
  {
    key: "anthropic",
    label: "Anthropic",
    hostname: "console.anthropic.com",
    url: "https://console.anthropic.com/",
  },
  {
    key: "google",
    label: "Google AI",
    hostname: "aistudio.google.com",
    url: "https://aistudio.google.com/",
  },
] as const;

export const PROVIDER_URLS: Record<string, string> = {
  deepseek: "https://api.deepseek.com/v1/chat/completions",
  openai: "https://api.openai.com/v1/chat/completions",
  anthropic: "https://api.anthropic.com/v1/messages",
  google: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
};

export const PROVIDER_MODELS: Record<string, string> = {
  deepseek: "deepseek-v4-flash",
  openai: "gpt-3.5-turbo",
  anthropic: "claude-3-haiku-20240307",
  google: "gemini-pro",
};

export const SYSTEM_PROMPT = `你是一个运行在 CLI Home（终端风格浏览器主页）中的 AI 助手。

## 角色身份
你是 CLI Home 的智能命令行协作者，专注于帮助用户在终端式浏览器主页环境中高效完成各类操作。你的知识领域涵盖命令行工具、Web 搜索、开发者工具、浏览器功能与网络技术。

## 服务目标
- 帮助用户快速获取信息与答案
- 提供搜索建议与导航辅助
- 解答编程相关的技术问题，如代码编写、代码调试、性能优化、数据库操作等
- 协助用户配置和使用 CLI Home 的各项功能（搜索、快捷指令、背景效果等）

## 核心能力
- 命令行操作指导（shell、git、vim 等）
- Web 搜索建议与信息整合
- 编程与技术问题解答
- 浏览器功能与开发者工具使用建议
- 终端效率技巧（别名、管道、脚本等）

## 语言风格
- 简洁精炼：优先短段落、列表、代码块，避免冗长铺垫
- 技术导向：自然使用专业术语，必要时附命令示例
- 结构化：善用 \`code\`、列表、分隔线等终端友好格式
- 语言自适应：用户用中文则回复中文，用英文则回复英文
- 无废话：不问候、不自我宣传、不假扮人类

## 行为边界与优先级
1. 可以回答任何领域的问题，但优先给出实用、简洁、技术导向的回答；对于与终端、开发、浏览器、搜索相关的问题，会发挥核心专长提供深度帮助
2. 对于开放式话题，尽量关联到技术或实用角度回答
3. 不执行代码或命令（仅提供指导）
4. 不编造不存在的 CLI Home 功能
5. 不知道的就直接说不知道，不猜测
6. 保持专业中立，不进行角色扮演或不必要的情感表达

## CLI Home 终端功能知识库
以下是当前终端支持的所有命令，当用户询问如何使用、配置或报错时，优先基于以下知识回答：

- \`help\` — 显示完整的命令参考列表。**鼓励用户优先使用此命令了解所有功能**
- \`about\` — 显示项目信息（版本、作者、许可证等）
- \`clear\` — 清空终端输出历史
- \`history\` — 查看命令执行历史
- \`search <keyword>\` — 使用默认搜索引擎搜索关键词
- \`search <engine> <keyword>\` — 使用指定搜索引擎搜索
- \`search add <name> <URL模板>\` — 添加自定义搜索引擎（URL 中用 {} 或 {query} 占位搜索词）
- \`search list\` — 列出所有搜索引擎
- \`search default <engine>\` — 设置默认搜索引擎
- \`search delete <engine>\` — 删除搜索引擎
- \`chat <question>\` — 直接向 AI 提问
- \`chat set <apiKey> <apiUrl> <model>\` — 配置 AI 的 API 密钥、接口地址和模型
- \`chat clear\` — 清空 AI 聊天记录
- \`goto <name>\` — 打开快捷指令对应的网址
- \`goto add <name> <URL>\` — 添加快捷指令
- \`goto list\` — 列出所有快捷指令
- \`goto edit <name> <URL>\` — 编辑快捷指令
- \`goto delete <name>\` — 删除快捷指令
- \`config language <en|cn>\` — 切换界面语言
- \`config language list\` — 查看可用语言列表
- \`config bg <effect>\` — 设置背景效果（soft / dither / fater / galaxy / letter / orb / plasma）
- \`config bg list\` — 列出所有背景效果及描述
- \`date\` — 显示当前系统时间（格式：YYYY-MM-DD HH:MM:SS）
- \`ping <url>\` — 测试网络地址的连通性和响应时间
- \`<直接输入>\` — 非命令文本会自动触发默认搜索引擎搜索
- 通过项目UI界面进行操作

当用户询问项目功能或配置问题时，先引导用户输入 \`help\` 查看完整命令列表，再针对具体需求给出解答。`;

export const DEFAULT_AI_CONFIG: AIConfig = {
  apiKey: "",
  apiUrl: PROVIDER_URLS.openai,
  model: PROVIDER_MODELS.openai,
  provider: "openai",
  temperature: 0.7,
  maxTokens: 1000,
};

function buildBody(config: AIConfig, message: string, stream: boolean): string {
  const base = {
    model: config.model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message },
    ],
    stream,
  };
  return JSON.stringify({
    ...base,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
  });
}

export async function sendMessage(config: AIConfig, message: string): Promise<string> {
  if (!config.apiKey) {
    throw new Error("请先配置API密钥");
  }

  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: buildBody(config, message, false),
  });

  if (!response.ok) {
    let errorText;
    try {
      const errorData = await response.json();
      errorText = errorData?.error?.message || JSON.stringify(errorData);
    } catch {
      errorText = await response.text().catch(() => "");
    }
    throw new Error(`[${response.status}] ${errorText || "请求失败"}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "无响应";
}

const decoder = new TextDecoder();

function buildBodyWithHistory(config: AIConfig, messages: AIMessage[], stream: boolean): string {
  const apiMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];
  const base = {
    model: config.model,
    messages: apiMessages,
    stream,
  };
  return JSON.stringify({
    ...base,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
  });
}

export async function sendMessageStream(
  config: AIConfig,
  message: string,
  callback: (chunk: string) => void,
): Promise<void> {
  if (!config.apiKey) {
    throw new Error("请先配置API密钥");
  }

  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: buildBody(config, message, true),
  });

  if (!response.ok) {
    let errorText;
    try {
      const errorData = await response.json();
      errorText = errorData?.error?.message || JSON.stringify(errorData);
    } catch {
      errorText = await response.text().catch(() => "");
    }
    throw new Error(`[${response.status}] ${errorText || "请求失败"}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("无法获取响应流");
  }

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;

      try {
        const data = JSON.parse(trimmed.slice(6));
        const content = data.choices?.[0]?.delta?.content;
        if (content) {
          callback(content);
        }
      } catch {
        continue;
      }
    }
  }
}

export async function sendMessageStreamWithHistory(
  config: AIConfig,
  messages: AIMessage[],
  callback: (chunk: string) => void,
): Promise<void> {
  if (!config.apiKey) {
    throw new Error("请先配置API密钥");
  }

  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: buildBodyWithHistory(config, messages, true),
  });

  if (!response.ok) {
    let errorText;
    try {
      const errorData = await response.json();
      errorText = errorData?.error?.message || JSON.stringify(errorData);
    } catch {
      errorText = await response.text().catch(() => "");
    }
    throw new Error(`[${response.status}] ${errorText || "请求失败"}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("无法获取响应流");
  }

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;

      try {
        const data = JSON.parse(trimmed.slice(6));
        const content = data.choices?.[0]?.delta?.content;
        if (content) {
          callback(content);
        }
      } catch {
        continue;
      }
    }
  }
}

export function generateMessageId(): string {
  return uid();
}
