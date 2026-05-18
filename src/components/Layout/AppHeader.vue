<script setup lang="ts">
import { Terminal, Search, Bot, Link2, Settings } from 'lucide-vue-next';

defineProps<{
  activeTab: string;
}>();

const emit = defineEmits<{
  (e: 'tabChange', tab: string): void;
}>();

const tabs = [
  { id: 'terminal', label: '终端', icon: Terminal },
  { id: 'search', label: '搜索', icon: Search },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'shortcuts', label: '快捷指令', icon: Link2 },
  { id: 'config', label: '配置', icon: Settings },
];
</script>

<template>
  <header class="bg-[#161b22] border-b border-[#30363d]">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-center justify-between h-12">
        <div class="flex items-center gap-3">
          <Terminal :size="24" class="text-blue-400" />
          <h1 class="text-xl font-bold text-white">CLI Home</h1>
        </div>
        
        <nav class="flex items-center gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors',
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#30363d]'
            ]"
            @click="emit('tabChange', tab.id)"
          >
            <component :is="tab.icon" :size="16" />
            <span>{{ tab.label }}</span>
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>
