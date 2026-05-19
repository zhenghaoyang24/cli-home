<script setup lang="ts">
import { ref } from "vue";
import SearchConfig from "./SearchConfig.vue";
import AIConfig from "./AIConfig.vue";
import ShortcutConfig from "./ShortcutConfig.vue";

const activeSection = ref("search");
</script>

<template>
  <div class="flex h-full w-full bg-[var(--bg-panel)]">
    <div class="w-36 p-3 border-r border-[var(--border-main)]">
      <nav class="space-y-0.5">
        <button
          v-for="s in [
            { id: 'search', label: 'Search' },
            { id: 'ai', label: 'AI' },
            { id: 'shortcuts', label: 'Shortcuts' },
          ]"
          :key="s.id"
          class="w-full px-3 py-2 rounded text-left text-xs font-mono transition-all duration-200 border"
          :class="
            activeSection === s.id
              ? 'bg-[var(--accent-bg)] text-[var(--accent)] border-[var(--accent-bd)]'
              : 'text-[var(--text-dim)] border-transparent'
          "
          @click="activeSection = s.id"
        >
          {{ s.label }}
        </button>
      </nav>
    </div>
    <div class="flex-1 overflow-y-scroll overflow-x-hidden p-6">
      <SearchConfig v-if="activeSection === 'search'" />
      <AIConfig v-else-if="activeSection === 'ai'" />
      <ShortcutConfig v-else />
    </div>
  </div>
</template>
