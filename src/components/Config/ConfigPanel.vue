<script setup lang="ts">
import { ref } from 'vue';
import SearchConfig from './SearchConfig.vue';
import AIConfig from './AIConfig.vue';
import ShortcutConfig from './ShortcutConfig.vue';

const activeSection = ref('search');
</script>

<template>
  <div class="flex h-full w-full" style="background: #0c0c12;">
    <div class="w-36 p-3 border-r" style="border-color: #1c1c30;">
      <nav class="space-y-0.5">
        <button
          v-for="s in [{ id: 'search', label: 'Search' }, { id: 'ai', label: 'AI' }, { id: 'shortcuts', label: 'Shortcuts' }]"
          :key="s.id"
          class="w-full px-3 py-2 rounded text-left text-xs font-mono transition-all duration-200"
          :style="activeSection === s.id
            ? 'background: rgba(122,162,247,0.08); color: #7aa2f7; border: 1px solid rgba(122,162,247,0.15);'
            : 'color: #2e3145; border: 1px solid transparent;'"
          @click="activeSection = s.id"
        >{{ s.label }}</button>
      </nav>
    </div>
    <div class="flex-1 overflow-y-scroll overflow-x-hidden p-6">
      <SearchConfig v-if="activeSection === 'search'" />
      <AIConfig v-else-if="activeSection === 'ai'" />
      <ShortcutConfig v-else />
    </div>
  </div>
</template>
