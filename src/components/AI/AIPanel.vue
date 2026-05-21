<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Send, Trash2 } from "lucide-vue-next";
import { useAIStore } from "@/stores/ai";
import { showToast } from "@/stores/notification";
import MarkdownRenderer from "./MarkdownRenderer.vue";
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue";

const { t } = useI18n();
const aiStore = useAIStore();

const props = defineProps<{ active: boolean }>();

const inputMessage = ref("");
const isStreaming = ref(false);
const streamingResponse = ref("");
const chatRef = ref<HTMLElement | null>(null);
const pendingClear = ref(false);

const scrollToBottom = async () => {
  await nextTick();
  if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight;
};

watch(
  () => aiStore.messages.length,
  () => scrollToBottom(),
);

watch(
  () => pendingClear.value,
  val => {
    if (!val) nextTick(() => scrollToBottom());
  },
);

watch(
  () => props.active,
  val => {
    if (val) scrollToBottom();
  },
);

const handleSend = async () => {
  if (!inputMessage.value.trim()) return;
  if (!aiStore.hasApiKey) {
    showToast(t("errors.apiKeyRequired"), "warning");
    return;
  }
  const userMsg = inputMessage.value;
  inputMessage.value = "";
  const userMsgId = Date.now().toString();
  const aiMsgId = (Date.now() + 1).toString();

  aiStore.addMessage({
    id: userMsgId,
    role: "user",
    content: userMsg,
    timestamp: new Date(),
  });

  isStreaming.value = true;
  streamingResponse.value = "";
  try {
    await aiStore.sendMessageStreamWithHistory(chunk => {
      streamingResponse.value += chunk;
      scrollToBottom();
    });
    aiStore.addMessage({
      id: aiMsgId,
      role: "assistant",
      content: streamingResponse.value,
      timestamp: new Date(),
    });
    streamingResponse.value = "";
  } catch (error) {
    showToast((error as Error).message, "error");
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

const confirmClear = () => {
  aiStore.clearMessages();
  showToast(t("messages.aiHistoryCleared"), "success");
  pendingClear.value = false;
};
</script>

<template>
  <div class="flex-1 min-h-0 w-full flex flex-col bg-(--bg-panel)">
    <div class="flex items-center justify-between px-5 py-2.5 border-b border-(--border-main)">
      <span class="text-xs font-mono tracking-wider text-(--text-secondary)">AI · CHAT</span>
      <button
        v-if="aiStore.messages.length"
        class="flex items-center gap-1 text-[12px] font-mono transition-colors text-(--text-secondary)"
        @click="pendingClear = true"
      >
        <Trash2 :size="14" /> CLEAR
      </button>
    </div>

    <div ref="chatRef" class="flex-1 overflow-y-scroll overflow-x-hidden px-5 py-4 space-y-4">
      <div
        v-if="aiStore.messages.length === 0 && !isStreaming"
        class="flex flex-col items-center justify-center h-full"
      >
        <div class="text-4xl mb-3 opacity-20">🤖</div>
        <p class="text-xs font-mono text-(--text-dimmer)">
          {{ t("components.startAiChat") }}
        </p>
        <p class="text-[10px] font-mono mt-1 text-(--text-dim)">
          {{ t("components.pleaseConfigApiKeyInConfig") }}
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
          {{ msg.role === "user" ? "Me" : "AI" }}
        </div>
        <div
          class="max-w-[75%] px-3 py-2 rounded-lg text-[13px] font-mono leading-relaxed text-(--text-primary)"
          :style="
            msg.role === 'user'
              ? { background: 'var(--accent-bg)', borderTopRightRadius: '2px' }
              : { background: 'var(--bg-bubble)', borderTopLeftRadius: '2px' }
          "
        >
          <p v-if="msg.role === 'user'" class="whitespace-pre-wrap break-all">
            {{ msg.content }}
          </p>
          <MarkdownRenderer v-else :content="msg.content" />
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
          <MarkdownRenderer :content="streamingResponse" />
          <span class="cursor-blink" style="color: var(--accent)">▌</span>
        </div>
      </div>

      <div
        v-if="aiStore.isMaxLimit"
        class="text-center py-3 px-4 rounded text-[12px] font-mono leading-relaxed"
        style="
          background: var(--warning-bg);
          border: 1px solid var(--warning-bd);
          color: var(--warning);
        "
      >
        {{ t("components.chatLimitReached") }}
      </div>
    </div>

    <div
      v-if="!aiStore.hasApiKey"
      class="px-5 py-2 text-[10px] font-mono text-(--warning)"
      style="border-top: 1px solid var(--warning-bd-2); background: var(--warning-bg)"
    >
      ⚠ {{ t("components.setApiKeyInConfig") }}
    </div>

    <div class="px-5 py-3 border-t border-(--border-main) bg-(--bg-surface)">
      <div class="flex gap-2">
        <input
          v-model="inputMessage"
          type="text"
          :placeholder="t('components.placeholder')"
          :disabled="isStreaming || aiStore.isMaxLimit"
          class="flex-1 px-3 py-2 rounded text-[13px] font-mono transition-colors disabled:opacity-40 bg-(--bg-panel) border border-(--border-main) text-(--text-input)"
          style="caret-color: var(--accent)"
          @keydown="handleKeyDown"
        />
        <button
          :disabled="isStreaming || !inputMessage.trim() || aiStore.isMaxLimit"
          class="px-3 py-2 rounded transition-colors disabled:opacity-25 disabled:cursor-not-allowed text-(--accent)"
          style="background: var(--accent-bg); border: 1px solid var(--accent-bd)"
          @click="handleSend"
        >
          <Send :size="15" />
        </button>
      </div>
    </div>

    <ConfirmDialog
      v-if="pendingClear"
      title="Clear Chat History"
      :message="t('components.confirmClear')"
      confirmText="Clear"
      @confirm="confirmClear"
      @cancel="pendingClear = false"
    />
  </div>
</template>
