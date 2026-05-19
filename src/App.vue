<script setup lang="ts">
import { ref } from "vue";
import { Terminal, Bot, Settings } from "lucide-vue-next";
import TerminalShell from "@/components/Layout/TerminalShell.vue";
import AppTerminal from "@/components/Terminal/AppTerminal.vue";
import AIPanel from "@/components/AI/AIPanel.vue";
import ConfigPanel from "@/components/Config/ConfigPanel.vue";

const tabs = [
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "ai", label: "AI", icon: Bot },
  { id: "config", label: "Config", icon: Settings },
] as const;

const activeTab = ref<string>("terminal");
</script>

<template>
  <TerminalShell>
    <template #tabs>
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all duration-200"
        :class="activeTab === tab.id ? 'text-(--text-hint) bg-(--accent)' : 'text-(--text-primary)'"
        @click="() => (activeTab = tab.id)"
      >
        <component :is="tab.icon" :size="13" />
        <span class="hidden sm:inline">{{ tab.label }}</span>
      </button>
    </template>

    <AppTerminal v-show="activeTab === 'terminal'" class="h-full w-full" />
    <AIPanel v-show="activeTab === 'ai'" class="h-full w-full" />
    <ConfigPanel v-show="activeTab === 'config'" class="h-full w-full" />
  </TerminalShell>
</template>
