<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import { useSearchStore } from '@/stores/search';

const searchStore = useSearchStore();
const showAdd = ref(false);
const newName = ref('');
const newUrl = ref('');

const add = () => {
  if (!newName.value || !newUrl.value) return;
  if (!newUrl.value.includes('{query}') && !newUrl.value.includes('${')) { alert('URL 必须包含 {query} 或 ${} 占位符'); return; }
  searchStore.addEngine({ name: newName.value, url: newUrl.value });
  newName.value = ''; newUrl.value = ''; showAdd.value = false;
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-2">
      <span class="text-lg" style="color: #9aa5ce;">🔍</span>
      <h3 class="text-sm font-mono tracking-wide" style="color: #9aa5ce;">Search Config</h3>
    </div>

    <div class="space-y-1.5">
      <label class="text-[11px] font-mono tracking-wider uppercase" style="color: #4a527a;">Default Engine</label>
      <div class="flex flex-wrap gap-1.5">
        <button v-for="e in searchStore.engines" :key="e.id"
          class="px-3 py-1.5 rounded text-[11px] font-mono transition-all border"
          :style="searchStore.defaultEngine === e.id
            ? 'border-color: rgba(122,162,247,0.3); background: rgba(122,162,247,0.08); color: #7aa2f7;'
            : 'border-color: #1c1c30; color: #292e3e;'"
          @click="searchStore.setDefaultEngine(e.id)"
        >{{ e.name }}</button>
      </div>
    </div>

    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label class="text-[11px] font-mono tracking-wider uppercase" style="color: #4a527a;">Engines</label>
        <button class="flex items-center gap-1 text-[10px] font-mono transition-colors"
          style="color: #7aa2f7;" @click="showAdd = !showAdd"><Plus :size="12" /> ADD</button>
      </div>

      <div v-if="showAdd" class="space-y-2 p-3 rounded-lg" style="background: #0f0f18; border: 1px solid #1c1c30;">
        <input v-model="newName" type="text" placeholder="Engine name"
          class="w-full px-3 py-2 rounded text-[13px] font-mono"
          style="background: #0c0c12; border: 1px solid #1c1c30; color: #9aa5ce; caret-color: #7aa2f7;" />
        <input v-model="newUrl" type="text" placeholder="URL (with {query} or ${})"
          class="w-full px-3 py-2 rounded text-[13px] font-mono"
          style="background: #0c0c12; border: 1px solid #1c1c30; color: #9aa5ce; caret-color: #7aa2f7;" />
        <button class="w-full py-2 rounded text-[11px] font-mono transition-colors"
          style="background: rgba(122,162,247,0.08); border: 1px solid rgba(122,162,247,0.2); color: #7aa2f7;"
          @click="add">Add Engine</button>
      </div>

      <div class="space-y-1">
        <div v-for="e in searchStore.engines" :key="e.id"
          class="flex items-center justify-between p-2.5 rounded"
          style="background: #0f0f18; border: 1px solid #1c1c30;">
          <div class="min-w-0 flex-1">
            <div class="text-[13px] font-mono" style="color: #9aa5ce;">{{ e.name }}</div>
            <div class="text-[10px] font-mono truncate" style="color: #292e3e;">{{ e.url }}</div>
          </div>
          <button v-if="searchStore.engines.length > 1" class="p-1 transition-colors ml-2" style="color: #2e3145;"
            @click="searchStore.removeEngine(e.id)"><Trash2 :size="14" /></button>
        </div>
      </div>
    </div>
  </div>
</template>
