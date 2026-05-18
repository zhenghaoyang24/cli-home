<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Trash2, Edit2 } from 'lucide-vue-next';
import { useShortcutsStore } from '@/stores/shortcuts';

const shortcutsStore = useShortcutsStore();
const showForm = ref(false);
const editingId = ref<string | null>(null);
const editName = ref('');
const editUrl = ref('');

const openAddForm = () => { editingId.value = null; editName.value = ''; editUrl.value = ''; showForm.value = true; };
const openEditForm = (id: string, n: string, u: string) => { editingId.value = id; editName.value = n; editUrl.value = u; showForm.value = true; };
const save = () => {
  if (!editName.value || !editUrl.value) { alert('请填写完整信息'); return; }
  try {
    if (editingId.value) shortcutsStore.updateShortcut(editingId.value, editName.value, editUrl.value);
    else shortcutsStore.addShortcut(editName.value, editUrl.value);
    showForm.value = false; editName.value = ''; editUrl.value = ''; editingId.value = null;
  } catch (e) { alert((e as Error).message); }
};
const del = (id: string, name: string) => {
  if (confirm(`确定删除 "${name}" 吗？`)) { try { shortcutsStore.deleteShortcut(id); } catch (e) { alert((e as Error).message); } }
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-2">
      <span class="text-lg" style="color: #9aa5ce;">⌘</span>
      <h3 class="text-sm font-mono tracking-wide" style="color: #9aa5ce;">Shortcut Config</h3>
    </div>

    <div class="flex items-center justify-between">
      <label class="text-[11px] font-mono tracking-wider uppercase" style="color: #4a527a;">Shortcuts</label>
      <button
        class="flex items-center gap-1 text-[10px] font-mono transition-colors"
        style="color: #7aa2f7;" @click="openAddForm"
      ><Plus :size="12" /> ADD</button>
    </div>

    <div v-if="showForm" class="space-y-2 p-3 rounded-lg" style="background: #0f0f18; border: 1px solid #1c1c30;">
      <input v-model="editName" type="text" placeholder="Name"
        class="w-full px-3 py-2 rounded text-[13px] font-mono"
        style="background: #0c0c12; border: 1px solid #1c1c30; color: #9aa5ce; caret-color: #7aa2f7;" />
      <input v-model="editUrl" type="text" placeholder="URL"
        class="w-full px-3 py-2 rounded text-[13px] font-mono"
        style="background: #0c0c12; border: 1px solid #1c1c30; color: #9aa5ce; caret-color: #7aa2f7;" />
      <div class="flex gap-2">
        <button class="flex-1 py-2 rounded text-[11px] font-mono transition-colors"
          style="background: rgba(122,162,247,0.08); border: 1px solid rgba(122,162,247,0.2); color: #7aa2f7;"
          @click="save">{{ editingId ? 'Save' : 'Add' }}</button>
        <button class="px-3 py-2 rounded text-[11px] font-mono transition-colors"
          style="border: 1px solid #1c1c30; color: #292e3e;"
          @click="showForm = false">Cancel</button>
      </div>
    </div>

    <div class="space-y-1">
      <div v-for="sc in shortcutsStore.sortedShortcuts" :key="sc.id"
        class="flex items-center justify-between p-2.5 rounded transition-colors"
        style="background: #0f0f18; border: 1px solid #1c1c30;">
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-mono" style="color: #9aa5ce;">{{ sc.name }}</div>
          <div class="text-[10px] font-mono truncate" style="color: #292e3e;">{{ sc.url }}</div>
        </div>
        <div class="flex items-center gap-1 ml-2">
          <button class="p-1 transition-colors" style="color: #2e3145;" @click="openEditForm(sc.id, sc.name, sc.url)"><Edit2 :size="13" /></button>
          <button class="p-1 transition-colors" style="color: #2e3145;" @click="del(sc.id, sc.name)"><Trash2 :size="13" /></button>
        </div>
      </div>
      <div v-if="!shortcutsStore.shortcuts.length" class="text-center py-8 text-[11px] font-mono" style="color: #292e3e;">No shortcuts yet</div>
    </div>
  </div>
</template>
