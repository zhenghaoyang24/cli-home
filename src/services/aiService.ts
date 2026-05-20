import type { AIConfig } from "@/types";
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
    messages: [{ role: "user", content: message }],
    stream,
  };
  if (config.provider === "deepseek") {
    return JSON.stringify({
      ...base,
      thinking: { type: "enabled" },
      reasoning_effort: "high",
    });
  }
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

export function generateMessageId(): string {
  return uid();
}
