<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { Send, Trash2 } from 'lucide-vue-next';
import { useAIStore } from '@/stores/ai';

const aiStore = useAIStore();
const inputMessage = ref('');
const isStreaming = ref(false);
const streamingResponse = ref('');
const chatRef = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight;
};

const handleSend = async () => {
  if (!inputMessage.value.trim()) return;
  if (!aiStore.hasApiKey) { alert('请先配置 API 密钥'); return; }
  const userMsg = inputMessage.value;
  inputMessage.value = '';
  isStreaming.value = true;
  streamingResponse.value = '';
  try {
    await aiStore.sendMessageToAIStream(userMsg, (chunk) => { streamingResponse.value += chunk; scrollToBottom(); });
    aiStore.addMessage({ id: Date.now().toString(), role: 'user', content: userMsg, timestamp: new Date() });
    aiStore.addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: streamingResponse.value, timestamp: new Date() });
    streamingResponse.value = '';
  } catch (error) { alert((error as Error).message); }
  finally { isStreaming.value = false; }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
};
</script>

<template>
  <div class="h-full w-full flex flex-col" style="background: #0c0c12;">
    <div class="flex items-center justify-between px-5 py-2.5 border-b" style="border-color: #1c1c30;">
      <span class="text-xs font-mono tracking-wider" style="color: #4a527a;">AI · CHAT</span>
      <button
        v-if="aiStore.messages.length"
        class="flex items-center gap-1 text-[10px] font-mono transition-colors"
        style="color: #292e3e;"
        @click="aiStore.clearMessages()"
      >
        <Trash2 :size="12" /> CLEAR
      </button>
    </div>

    <div ref="chatRef" class="flex-1 overflow-y-scroll overflow-x-hidden px-5 py-4 space-y-4">
      <div v-if="aiStore.messages.length === 0 && !isStreaming" class="flex flex-col items-center justify-center h-full">
        <div class="text-4xl mb-3 opacity-20">🤖</div>
        <p class="text-xs font-mono" style="color: #292e3e;">启动 AI 对话</p>
        <p class="text-[10px] font-mono mt-1" style="color: #1c1c30;">请确保已在 Config 中配置 API 密钥</p>
      </div>

      <div v-for="msg in aiStore.messages" :key="msg.id" :class="['flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '']">
        <div
          class="w-7 h-7 rounded flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0"
          :style="msg.role === 'user' ? 'background: rgba(122,162,247,0.15); color: #7aa2f7;' : 'background: rgba(158,206,106,0.15); color: #9ece6a;'"
        >{{ msg.role === 'user' ? 'U' : 'AI' }}</div>
        <div
          class="max-w-[75%] px-3 py-2 rounded-lg text-[13px] font-mono leading-relaxed"
          :style="msg.role === 'user'
            ? 'background: rgba(122,162,247,0.06); color: #9aa5ce; border-top-right-radius: 2px;'
            : 'background: #111118; color: #9aa5ce; border-top-left-radius: 2px;'"
        >
          <p class="whitespace-pre-wrap break-all">{{ msg.content }}</p>
        </div>
      </div>

      <div v-if="isStreaming" class="flex gap-3">
        <div class="w-7 h-7 rounded flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0" style="background: rgba(158,206,106,0.15); color: #9ece6a;">AI</div>
        <div class="max-w-[75%] px-3 py-2 rounded-lg text-[13px] font-mono leading-relaxed" style="background: #111118; border-top-left-radius: 2px;">
          <p class="whitespace-pre-wrap break-all" style="color: #9aa5ce;">{{ streamingResponse }}<span class="cursor-blink" style="color: #7aa2f7;">▌</span></p>
        </div>
      </div>
    </div>

    <div v-if="!aiStore.hasApiKey" class="px-5 py-2 text-[10px] font-mono" style="border-top: 1px solid rgba(224,175,104,0.15); background: rgba(224,175,104,0.04); color: #e0af68;">
      ⚠ 请先在 Config 中设置 API 密钥
    </div>

    <div class="px-5 py-3 border-t" style="border-color: #1c1c30; background: #0f0f18;">
      <div class="flex gap-2">
        <input
          v-model="inputMessage" type="text" placeholder="输入消息..." :disabled="isStreaming"
          class="flex-1 px-3 py-2 rounded text-[13px] font-mono transition-colors disabled:opacity-40"
          style="background: #0c0c12; border: 1px solid #1c1c30; color: #a9b1d6; caret-color: #7aa2f7;"
          @keydown="handleKeyDown"
        />
        <button
          :disabled="isStreaming || !inputMessage.trim()"
          class="px-3 py-2 rounded transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          style="background: rgba(122,162,247,0.08); border: 1px solid rgba(122,162,247,0.2); color: #7aa2f7;"
          @click="handleSend"
        ><Send :size="15" /></button>
      </div>
    </div>
  </div>
</template>
