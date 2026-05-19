import type { AIConfig } from "@/types";

export const DEFAULT_AI_CONFIG: AIConfig = {
  apiKey: "",
  apiUrl: "https://api.openai.com/v1/chat/completions",
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 1000,
};

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
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: message }],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error?.message || "请求失败");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "无响应";
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
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: message }],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error?.message || "请求失败");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("无法获取响应流");
  }

  const decoder = new TextDecoder();
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
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
