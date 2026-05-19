<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Plus, Trash2, Edit2 } from "lucide-vue-next";
import { useShortcutsStore } from "@/stores/shortcuts";

const { t } = useI18n();
const shortcutsStore = useShortcutsStore();
const showForm = ref(false);
const editingId = ref<string | null>(null);
const editName = ref("");
const editUrl = ref("");

const openAddForm = () => {
  editingId.value = null;
  editName.value = "";
  editUrl.value = "";
  showForm.value = true;
};
const openEditForm = (id: string, n: string, u: string) => {
  editingId.value = id;
  editName.value = n;
  editUrl.value = u;
  showForm.value = true;
};
const save = () => {
  if (!editName.value || !editUrl.value) {
    alert(t("components.pleaseFillComplete"));
    return;
  }
  try {
    if (editingId.value)
      shortcutsStore.updateShortcut(editingId.value, editName.value, editUrl.value);
    else shortcutsStore.addShortcut(editName.value, editUrl.value);
    showForm.value = false;
    editName.value = "";
    editUrl.value = "";
    editingId.value = null;
  } catch (e) {
    alert((e as Error).message);
  }
};
const del = (id: string, name: string) => {
  if (confirm(t("components.confirmDelete", { name }))) {
    try {
      shortcutsStore.deleteShortcut(id);
    } catch (e) {
      alert((e as Error).message);
    }
  }
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-2">
      <span class="text-lg text-(--text-primary)">⌘</span>
      <h3 class="text-sm font-mono tracking-wide text-(--text-primary)">Shortcut Config</h3>
    </div>

    <div class="flex items-center justify-between">
      <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)"
        >Shortcuts</label
      >
      <button
        class="flex items-center gap-1 text-[10px] font-mono transition-colors text-(--accent)"
        @click="openAddForm"
      >
        <Plus :size="12" /> ADD
      </button>
    </div>

    <div
      v-if="showForm"
      class="space-y-2 p-3 rounded-lg bg-(--bg-surface) border border-(--border-main)"
    >
      <input
        v-model="editName"
        type="text"
        placeholder="Name"
        class="w-full px-3 py-2 rounded text-[13px] font-mono bg-(--bg-panel) border border-(--border-main) text-(--text-primary)"
        style="caret-color: var(--accent)"
      />
      <input
        v-model="editUrl"
        type="text"
        placeholder="URL"
        class="w-full px-3 py-2 rounded text-[13px] font-mono bg-(--bg-panel) border border-(--border-main) text-(--text-primary)"
        style="caret-color: var(--accent)"
      />
      <div class="flex gap-2">
        <button
          class="flex-1 py-2 rounded text-[11px] font-mono transition-colors text-(--accent)"
          style="background: var(--accent-bg); border: 1px solid var(--accent-bd)"
          @click="save"
        >
          {{ editingId ? "Save" : "Add" }}
        </button>
        <button
          class="px-3 py-2 rounded text-[11px] font-mono transition-colors border border-(--border-main) text-(--text-dimmer)"
          @click="showForm = false"
        >
          Cancel
        </button>
      </div>
    </div>

    <div class="space-y-1">
      <div
        v-for="sc in shortcutsStore.sortedShortcuts"
        :key="sc.id"
        class="flex items-center justify-between p-2.5 rounded transition-colors bg-(--bg-surface) border border-(--border-main)"
      >
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-mono text-(--text-primary)">
            {{ sc.name }}
          </div>
          <div class="text-[10px] font-mono truncate text-(--text-dimmer)">
            {{ sc.url }}
          </div>
        </div>
        <div class="flex items-center gap-1 ml-2">
          <button
            class="p-1 transition-colors text-(--text-dim)"
            @click="openEditForm(sc.id, sc.name, sc.url)"
          >
            <Edit2 :size="13" />
          </button>
          <button class="p-1 transition-colors text-(--text-dim)" @click="del(sc.id, sc.name)">
            <Trash2 :size="13" />
          </button>
        </div>
      </div>
      <div
        v-if="!shortcutsStore.shortcuts.length"
        class="text-center py-8 text-[11px] font-mono text-(--text-dimmer)"
      >
        No shortcuts yet
      </div>
    </div>
  </div>
</template>
