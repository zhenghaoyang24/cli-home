import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AIConfig, AIMessage } from '@/types';
import {
  getConfig,
  updateConfig as serviceUpdateConfig,
  sendMessage,
  sendMessageStream,
  clearHistory as serviceClearHistory,
  generateMessageId,
} from '@/services/aiService';

export const useAIStore = defineStore('ai', () => {
  const config = ref<AIConfig>(getConfig());
  const messages = ref<AIMessage[]>([]);
  const isLoading = ref(false);

  const updateConfig = (key: keyof AIConfig, value: unknown) => {
    serviceUpdateConfig(key, value);
    config.value = getConfig();
  };

  const addMessage = (message: AIMessage) => {
    messages.value.push(message);
  };

  const clearMessages = () => {
    serviceClearHistory();
    messages.value = [];
  };

  const sendMessageToAI = async (content: string): Promise<string> => {
    isLoading.value = true;
    try {
      const response = await sendMessage(content);
      return response;
    } finally {
      isLoading.value = false;
    }
  };

  const sendMessageToAIStream = async (
    content: string,
    callback: (chunk: string) => void
  ): Promise<void> => {
    isLoading.value = true;
    try {
      await sendMessageStream(content, callback);
    } finally {
      isLoading.value = false;
    }
  };

  const createUserMessage = (content: string): AIMessage => ({
    id: generateMessageId(),
    role: 'user',
    content,
    timestamp: new Date(),
  });

  const createAssistantMessage = (content: string): AIMessage => ({
    id: generateMessageId(),
    role: 'assistant',
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
    addMessage,
    clearMessages,
    sendMessageToAI,
    sendMessageToAIStream,
    createUserMessage,
    createAssistantMessage,
  };
});
