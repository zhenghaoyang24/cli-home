<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Plus, Trash2, Edit2 } from "lucide-vue-next";
import { useShortcutsStore } from "@/stores/shortcuts";
import { showToast } from "@/stores/notification";
import AppInput from "@/components/Common/AppInput.vue";
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue";

const { t } = useI18n();
const shortcutsStore = useShortcutsStore();

function isValidUrl(str: string): boolean {
  const pattern = /^https?:\/\/[\w.-]+(\.[\w-]+)+(\/[\w.~/?%#&=+\-@!$'()*,:;]*)*$/i;
  return pattern.test(
    str.startsWith("http://") || str.startsWith("https://") ? str : `https://${str}`,
  );
}

const showForm = ref(false);
const editingId = ref<string | null>(null);
const editName = ref("");
const editUrl = ref("");
const pendingDelete = ref<{ id: string; name: string } | null>(null);

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

const cancelForm = () => {
  showForm.value = false;
  editingId.value = null;
  editName.value = "";
  editUrl.value = "";
};

const save = () => {
  if (!editName.value || !editUrl.value) {
    showToast(t("components.pleaseFillComplete"), "warning");
    return;
  }
  if (!isValidUrl(editUrl.value)) {
    showToast(t("messages.invalidUrl", { url: editUrl.value }), "error");
    return;
  }
  try {
    if (editingId.value)
      shortcutsStore.updateShortcut(editingId.value, editName.value, editUrl.value);
    else shortcutsStore.addShortcut(editName.value, editUrl.value);
    const action = editingId.value ? "updated" : "added";
    showToast(t("messages." + action, { name: editName.value }), "success");
    cancelForm();
  } catch (e) {
    showToast((e as Error).message, "error");
  }
};

const confirmDelete = () => {
  if (!pendingDelete.value) return;
  try {
    shortcutsStore.deleteShortcut(pendingDelete.value.id);
    showToast(t("messages.deleted", { name: pendingDelete.value.name }), "success");
  } catch (e) {
    showToast((e as Error).message, "error");
  }
  pendingDelete.value = null;
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

    <!-- Add form at the bottom -->
    <div
      v-if="showForm && editingId === null"
      class="space-y-2 p-3 rounded-lg bg-(--bg-surface) border border-(--border-main)"
    >
      <AppInput v-model="editName" type="text" placeholder="Name key" />
      <AppInput v-model="editUrl" type="text" placeholder="URL" />
      <div class="flex gap-2">
        <button
          class="flex-1 py-2 rounded text-[11px] font-mono transition-colors text-(--accent)"
          style="background: var(--accent-bg); border: 1px solid var(--accent-bd)"
          @click="save"
        >
          Add
        </button>
        <button
          class="px-3 py-2 rounded text-[11px] font-mono transition-colors border border-(--border-main) text-(--text-dimmer)"
          @click="cancelForm"
        >
          Cancel
        </button>
      </div>
    </div>

    <div class="space-y-1">
      <template v-for="sc in shortcutsStore.sortedShortcuts" :key="sc.id">
        <!-- Edit form right below the editing item -->
        <div
          v-if="showForm && editingId === sc.id"
          class="space-y-2 p-3 rounded-lg bg-(--bg-surface) border border-(--border-main)"
        >
          <AppInput v-model="editName" type="text" placeholder="Name key" />
          <AppInput v-model="editUrl" type="text" placeholder="URL" />
          <div class="flex gap-2">
            <button
              class="flex-1 py-2 rounded text-[11px] font-mono transition-colors text-(--accent)"
              style="background: var(--accent-bg); border: 1px solid var(--accent-bd)"
              @click="save"
            >
              Save
            </button>
            <button
              class="px-3 py-2 rounded text-[11px] font-mono transition-colors border border-(--border-main) text-(--text-dimmer)"
              @click="cancelForm"
            >
              Cancel
            </button>
          </div>
        </div>
        <div
          v-else
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
            <button
              class="p-1 transition-colors text-(--text-dim)"
              @click="pendingDelete = { id: sc.id, name: sc.name }"
            >
              <Trash2 :size="13" />
            </button>
          </div>
        </div>
      </template>

      <div
        v-if="!shortcutsStore.shortcuts.length"
        class="text-center py-8 text-[11px] font-mono text-(--text-dimmer)"
      >
        No shortcuts yet
      </div>
    </div>

    <ConfirmDialog
      v-if="pendingDelete"
      title="Delete Shortcut"
      :message="t('components.confirmDelete', { name: pendingDelete.name })"
      confirmText="Delete"
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>
