<script setup lang="ts">
import { ref } from "vue";
import { Plus, Trash2 } from "lucide-vue-next";
import { useSearchStore } from "@/stores/search";

const searchStore = useSearchStore();
const showAdd = ref(false);
const newName = ref("");
const newUrl = ref("");

const add = () => {
  if (!newName.value || !newUrl.value) return;
  if (!newUrl.value.includes("{query}") && !newUrl.value.includes("${")) {
    alert("URL 必须包含 {query} 或 ${} 占位符");
    return;
  }
  searchStore.addEngine({ name: newName.value, url: newUrl.value });
  newName.value = "";
  newUrl.value = "";
  showAdd.value = false;
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-2">
      <span class="text-lg text-[var(--text-primary)]">🔍</span>
      <h3 class="text-sm font-mono tracking-wide text-[var(--text-primary)]">Search Config</h3>
    </div>

    <div class="space-y-1.5">
      <label class="text-[11px] font-mono tracking-wider uppercase text-[var(--text-label)]"
        >Default Engine</label
      >
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="e in searchStore.engines"
          :key="e.id"
          class="px-3 py-1.5 rounded text-[11px] font-mono transition-all border"
          :class="
            searchStore.defaultEngine === e.id
              ? 'text-[var(--accent)] bg-[var(--accent-bg)] border-[var(--accent-bd-str)]'
              : 'text-[var(--text-dimmer)] border-[var(--border-main)]'
          "
          @click="searchStore.setDefaultEngine(e.id)"
        >
          {{ e.name }}
        </button>
      </div>
    </div>

    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label class="text-[11px] font-mono tracking-wider uppercase text-[var(--text-label)]"
          >Engines</label
        >
        <button
          class="flex items-center gap-1 text-[10px] font-mono transition-colors text-[var(--accent)]"
          @click="showAdd = !showAdd"
        >
          <Plus :size="12" /> ADD
        </button>
      </div>

      <div
        v-if="showAdd"
        class="space-y-2 p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-main)]"
      >
        <input
          v-model="newName"
          type="text"
          placeholder="Engine name"
          class="w-full px-3 py-2 rounded text-[13px] font-mono bg-[var(--bg-panel)] border border-[var(--border-main)] text-[var(--text-primary)]"
          style="caret-color: var(--accent)"
        />
        <input
          v-model="newUrl"
          type="text"
          placeholder="URL (with {query} or ${})"
          class="w-full px-3 py-2 rounded text-[13px] font-mono bg-[var(--bg-panel)] border border-[var(--border-main)] text-[var(--text-primary)]"
          style="caret-color: var(--accent)"
        />
        <button
          class="w-full py-2 rounded text-[11px] font-mono transition-colors text-[var(--accent)]"
          style="background: var(--accent-bg); border: 1px solid var(--accent-bd)"
          @click="add"
        >
          Add Engine
        </button>
      </div>

      <div class="space-y-1">
        <div
          v-for="e in searchStore.engines"
          :key="e.id"
          class="flex items-center justify-between p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-main)]"
        >
          <div class="min-w-0 flex-1">
            <div class="text-[13px] font-mono text-[var(--text-primary)]">
              {{ e.name }}
            </div>
            <div class="text-[10px] font-mono truncate text-[var(--text-dimmer)]">
              {{ e.url }}
            </div>
          </div>
          <button
            v-if="searchStore.engines.length > 1"
            class="p-1 transition-colors ml-2 text-[var(--text-dim)]"
            @click="searchStore.removeEngine(e.id)"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
