import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AIConfig, AIMessage } from "@/types";
import {
  DEFAULT_AI_CONFIG,
  PROVIDER_URLS,
  PROVIDER_MODELS,
  PROVIDERS,
  sendMessage as aiSendMessage,
  sendMessageStream as aiSendMessageStream,
  generateMessageId,
} from "@/services/aiService";

export const useAIStore = defineStore(
  "ai",
  () => {
    const config = ref<AIConfig>({ ...DEFAULT_AI_CONFIG });
    const messages = ref<AIMessage[]>([]);
    const isLoading = ref(false);

    const updateConfig = (key: keyof AIConfig, value: string | number | undefined) => {
      if (value === undefined || value === "") return;
      const current = config.value[key];
      if (typeof current === "number") {
        const num = typeof value === "number" ? value : parseFloat(String(value));
        if (!Number.isNaN(num)) (config.value[key] as number) = num;
      } else {
        (config.value[key] as string) = String(value);
      }
    };

    const setProvider = (provider: string) => {
      config.value.provider = provider;
      config.value.apiUrl = PROVIDER_URLS[provider] || config.value.apiUrl;
      config.value.model = PROVIDER_MODELS[provider] || config.value.model;
    };

    const addMessage = (message: AIMessage) => {
      messages.value.push(message);
    };

    const clearMessages = () => {
      messages.value = [];
    };

    const sendMessageToAI = async (content: string): Promise<string> => {
      isLoading.value = true;
      try {
        return await aiSendMessage(config.value, content);
      } finally {
        isLoading.value = false;
      }
    };

    const sendMessageToAIStream = async (
      content: string,
      callback: (chunk: string) => void,
    ): Promise<void> => {
      isLoading.value = true;
      try {
        await aiSendMessageStream(config.value, content, callback);
      } finally {
        isLoading.value = false;
      }
    };

    const createUserMessage = (content: string): AIMessage => ({
      id: generateMessageId(),
      role: "user",
      content,
      timestamp: new Date(),
    });

    const createAssistantMessage = (content: string): AIMessage => ({
      id: generateMessageId(),
      role: "assistant",
      content,
      timestamp: new Date(),
    });

    const hasApiKey = computed(() => !!config.value.apiKey);

    return {
      config,
      messages,
      isLoading,
      hasApiKey,
      updateConfig,
      setProvider,
      PROVIDERS,
      addMessage,
      clearMessages,
      sendMessageToAI,
      sendMessageToAIStream,
      createUserMessage,
      createAssistantMessage,
    };
  },
  {
    persist: {
      pick: ["config"],
    },
  },
);
