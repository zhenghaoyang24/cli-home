<script setup lang="ts">
import { ref } from 'vue';
import { Terminal, Bot, Settings } from 'lucide-vue-next';
import TerminalComponent from '@/components/Terminal/Terminal.vue';
import AIPanel from '@/components/AI/AIPanel.vue';
import ConfigPanel from '@/components/Config/ConfigPanel.vue';

const tabs = [
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'config', label: 'Config', icon: Settings },
] as const;

const activeTab = ref<string>('terminal');
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
    <div
      class="terminal-glow rounded-xl overflow-hidden border"
      style="
        width: 720px;
        max-width: calc(100vw - 48px);
        border-color: #1c1c30;
        background: #0c0c12;
        box-shadow: 0 0 60px rgba(100,140,220,0.04), 0 0 120px rgba(100,140,220,0.02), 0 30px 80px rgba(0,0,0,0.9);
      "
    >
      <div
        class="flex items-center justify-between px-4 py-2.5 border-b"
        style="background: #0f0f18; border-color: #1c1c30;"
      >
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-full" style="background: #ff5f56;"></div>
            <div class="w-3 h-3 rounded-full" style="background: #ffbd2e;"></div>
            <div class="w-3 h-3 rounded-full" style="background: #27c93f;"></div>
          </div>
          <span class="text-xs font-mono ml-2" style="color: #4a527a;">CLI Home — zsh</span>
        </div>

        <nav class="flex items-center gap-0.5">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all duration-200"
            :style="activeTab === tab.id
              ? 'background: #1a1a30; color: #7aa2f7;'
              : 'color: #2e3145;'"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" :size="13" />
            <span class="hidden sm:inline">{{ tab.label }}</span>
          </button>
        </nav>
      </div>

      <div class="terminal-content overflow-y-scroll overflow-x-hidden" style="height: 520px; width: 100%;">
        <TerminalComponent v-show="activeTab === 'terminal'" class="h-full" style="width: 100%;" />
        <AIPanel v-show="activeTab === 'ai'" class="h-full" style="width: 100%;" />
        <ConfigPanel v-show="activeTab === 'config'" class="h-full" style="width: 100%;" />
      </div>
    </div>

    <p class="mt-6 text-xs font-mono tracking-widest" style="color: #1c1c30;">
      CLI HOME · VUE3 · TERMINAL
    </p>
  </div>
</template>
