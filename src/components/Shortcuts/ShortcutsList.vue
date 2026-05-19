<script setup lang="ts">
import { ref, computed } from "vue";
import { ExternalLink } from "lucide-vue-next";
import { useShortcutsStore } from "@/stores/shortcuts";

const shortcutsStore = useShortcutsStore();
const searchQuery = ref("");

const filteredShortcuts = computed(() => {
  if (!searchQuery.value) return shortcutsStore.sortedShortcuts;
  return shortcutsStore.findByKeyword(searchQuery.value);
});

const openShortcut = (url: string) => window.open(url, "_blank");
</script>

<template>
  <div class="h-full flex flex-col bg-[#0a0a0f]">
    <div class="px-5 py-3 border-b border-[#1a1a2e]">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索快捷指令..."
        class="w-full px-3 py-2 bg-[#0d0d14] border border-[#1a1a2e] rounded text-[13px] font-mono text-[#c0caf5] placeholder-[#3b4261] focus:outline-none focus:border-[#7dcfff]/50"
      />
    </div>

    <div class="flex-1 overflow-y-auto p-5">
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        <button
          v-for="shortcut in filteredShortcuts"
          :key="shortcut.id"
          class="group flex flex-col items-center p-3 rounded-lg border border-transparent hover:border-[#1a1a2e] hover:bg-[#111118] transition-all duration-200 relative"
          @click="openShortcut(shortcut.url)"
        >
          <div
            class="w-10 h-10 rounded-lg bg-[#7dcfff]/10 flex items-center justify-center mb-2 text-sm font-bold font-mono text-[#7dcfff] group-hover:bg-[#7dcfff]/20 transition-colors"
          >
            {{ shortcut.name[0].toUpperCase() }}
          </div>
          <span class="text-xs font-mono text-[#a9b1d6] truncate max-w-full">{{
            shortcut.name
          }}</span>
          <span
            class="text-[10px] font-mono text-[#3b4261] truncate max-w-full mt-0.5"
            >{{ shortcut.url }}</span
          >
          <ExternalLink
            :size="12"
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-60 text-[#3b4261]"
          />
        </button>
      </div>

      <div
        v-if="filteredShortcuts.length === 0"
        class="flex flex-col items-center justify-center h-full text-[#3b4261]"
      >
        <div class="text-3xl mb-2 opacity-30">⌘</div>
        <p class="text-xs font-mono">暂无快捷指令</p>
        <p class="text-[10px] font-mono mt-0.5 text-[#1a1a2e]">
          shortcut add &lt;name&gt; &lt;url&gt;
        </p>
      </div>
    </div>
  </div>
</template>
