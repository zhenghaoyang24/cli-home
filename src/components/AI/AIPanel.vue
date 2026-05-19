<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Send, Trash2 } from "lucide-vue-next";
import { useAIStore } from "@/stores/ai";

const aiStore = useAIStore();
const inputMessage = ref("");
const isStreaming = ref(false);
const streamingResponse = ref("");
const chatRef = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight;
};

const handleSend = async () => {
  if (!inputMessage.value.trim()) return;
  if (!aiStore.hasApiKey) {
    alert("请先配置 API 密钥");
    return;
  }
  const userMsg = inputMessage.value;
  inputMessage.value = "";
  isStreaming.value = true;
  streamingResponse.value = "";
  try {
    await aiStore.sendMessageToAIStream(userMsg, chunk => {
      streamingResponse.value += chunk;
      scrollToBottom();
    });
    aiStore.addMessage({
      id: Date.now().toString(),
      role: "user",
      content: userMsg,
      timestamp: new Date(),
    });
    aiStore.addMessage({
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: streamingResponse.value,
      timestamp: new Date(),
    });
    streamingResponse.value = "";
  } catch (error) {
    alert((error as Error).message);
  } finally {
    isStreaming.value = false;
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};
</script>

<template>
  <div class="h-full w-full flex flex-col bg-(--bg-panel)">
    <div class="flex items-center justify-between px-5 py-2.5 border-b border-(--border-main)">
      <span class="text-xs font-mono tracking-wider text-(--text-label)">AI · CHAT</span>
      <button
        v-if="aiStore.messages.length"
        class="flex items-center gap-1 text-[10px] font-mono transition-colors text-(--text-dimmer)"
        @click="aiStore.clearMessages()"
      >
        <Trash2 :size="12" /> CLEAR
      </button>
    </div>

    <div ref="chatRef" class="flex-1 overflow-y-scroll overflow-x-hidden px-5 py-4 space-y-4">
      <div
        v-if="aiStore.messages.length === 0 && !isStreaming"
        class="flex flex-col items-center justify-center h-full"
      >
        <div class="text-4xl mb-3 opacity-20">🤖</div>
        <p class="text-xs font-mono text-(--text-dimmer)">启动 AI 对话</p>
        <p class="text-[10px] font-mono mt-1 text-(--text-dim)">
          请确保已在 Config 中配置 API 密钥
        </p>
      </div>

      <div
        v-for="msg in aiStore.messages"
        :key="msg.id"
        :class="['flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '']"
      >
        <div
          class="w-7 h-7 rounded flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
          :style="
            msg.role === 'user'
              ? { background: 'var(--accent-bg-md)', color: 'var(--accent)' }
              : { background: 'var(--success-bg)', color: 'var(--success)' }
          "
        >
          {{ msg.role === "user" ? "U" : "AI" }}
        </div>
        <div
          class="max-w-[75%] px-3 py-2 rounded-lg text-[13px] font-mono leading-relaxed text-(--text-primary)"
          :style="
            msg.role === 'user'
              ? { background: 'var(--accent-bg)', borderTopRightRadius: '2px' }
              : { background: 'var(--bg-bubble)', borderTopLeftRadius: '2px' }
          "
        >
          <p class="whitespace-pre-wrap break-all">{{ msg.content }}</p>
        </div>
      </div>

      <div v-if="isStreaming" class="flex gap-3">
        <div
          class="w-7 h-7 rounded flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
          style="background: var(--success-bg); color: var(--success)"
        >
          AI
        </div>
        <div
          class="max-w-[75%] px-3 py-2 rounded-lg text-[13px] font-mono leading-relaxed"
          style="background: var(--bg-bubble); border-top-left-radius: 2px"
        >
          <p class="whitespace-pre-wrap break-all text-(--text-primary)">
            {{ streamingResponse }}<span class="cursor-blink" style="color: var(--accent)">▌</span>
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="!aiStore.hasApiKey"
      class="px-5 py-2 text-[10px] font-mono text-(--warning)"
      style="border-top: 1px solid var(--warning-bd-2); background: var(--warning-bg)"
    >
      ⚠ 请先在 Config 中设置 API 密钥
    </div>

    <div class="px-5 py-3 border-t border-(--border-main) bg-(--bg-surface)">
      <div class="flex gap-2">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="输入消息..."
          :disabled="isStreaming"
          class="flex-1 px-3 py-2 rounded text-[13px] font-mono transition-colors disabled:opacity-40 bg-(--bg-panel) border border-(--border-main) text-(--text-input)"
          style="caret-color: var(--accent)"
          @keydown="handleKeyDown"
        />
        <button
          :disabled="isStreaming || !inputMessage.trim()"
          class="px-3 py-2 rounded transition-colors disabled:opacity-25 disabled:cursor-not-allowed text-(--accent)"
          style="background: var(--accent-bg); border: 1px solid var(--accent-bd)"
          @click="handleSend"
        >
          <Send :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>
