<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, ArrowRight } from 'lucide-vue-next';
import { useSearchStore } from '@/stores/search';

const searchStore = useSearchStore();
const query = ref('');
const selectedEngine = ref('');

const engines = computed(() => searchStore.engines);
const defaultEngine = computed(() => searchStore.defaultEngine);

const currentEngineId = computed(() => selectedEngine.value || defaultEngine.value);

const handleSearch = () => {
  if (!query.value.trim()) return;
  searchStore.doSearch(query.value, currentEngineId.value);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') handleSearch();
};
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center px-6 bg-[#0a0a0f]">
    <div class="w-full max-w-lg">
      <p class="text-[#565f89] text-xs font-mono mb-6 tracking-wider text-center">
        SEARCH · {{ engines.find(e => e.id === currentEngineId)?.name || currentEngineId }}
      </p>

      <div class="flex flex-wrap justify-center gap-1.5 mb-6">
        <button
          v-for="engine in engines"
          :key="engine.id"
          :class="[
            'px-3 py-1 rounded text-[11px] font-mono transition-all duration-200 border',
            currentEngineId === engine.id
              ? 'border-[#7dcfff]/40 bg-[#7dcfff]/10 text-[#7dcfff]'
              : 'border-transparent text-[#3b4261] hover:text-[#565f89] hover:bg-[#111118]'
          ]"
          @click="selectedEngine = engine.id"
        >
          {{ engine.name }}
        </button>
      </div>

      <div class="relative">
        <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3b4261]" />
        <input
          v-model="query"
          type="text"
          placeholder="输入搜索关键词..."
          class="w-full pl-10 pr-4 py-3 bg-[#0d0d14] border border-[#1a1a2e] rounded-lg text-[#c0caf5] text-sm font-mono placeholder-[#3b4261] focus:outline-none focus:border-[#7dcfff]/50 transition-colors"
          @keydown="handleKeyDown"
          autofocus
        />
        <button
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#7dcfff] hover:text-[#b4f0ff] transition-colors"
          @click="handleSearch"
        >
          <ArrowRight :size="16" />
        </button>
      </div>

      <div class="mt-8 grid grid-cols-4 gap-2">
        <button
          v-for="engine in engines"
          :key="engine.id"
          :class="[
            'flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 border',
            currentEngineId === engine.id
              ? 'border-[#7dcfff]/30 bg-[#7dcfff]/5'
              : 'border-transparent hover:bg-[#111118]'
          ]"
          @click="selectedEngine = engine.id"
        >
          <div :class="[
            'w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold font-mono transition-colors',
            currentEngineId === engine.id ? 'bg-[#7dcfff]/20 text-[#7dcfff]' : 'bg-[#111118] text-[#3b4261]'
          ]">
            {{ engine.name[0].toUpperCase() }}
          </div>
          <span :class="[
            'text-[10px] font-mono',
            currentEngineId === engine.id ? 'text-[#7dcfff]' : 'text-[#3b4261]'
          ]">
            {{ engine.name }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
