<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Plus, Trash2 } from "lucide-vue-next";
import { useSearchStore } from "@/stores/search";
import { showToast } from "@/stores/notification";
import AppInput from "@/components/Common/AppInput.vue";

const { t } = useI18n();
const searchStore = useSearchStore();
const showAdd = ref(false);
const newName = ref("");
const newUrl = ref("");

const add = () => {
  if (!newName.value || !newUrl.value) return;
  if (!newUrl.value.includes("{query}") && !newUrl.value.includes("${")) {
    showToast(t("components.urlMustIncludePlaceholder"), "warning");
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
      <span class="text-lg text-(--text-primary)">🔍</span>
      <h3 class="text-sm font-mono tracking-wide text-(--text-primary)">Search Config</h3>
    </div>

    <div class="space-y-1.5">
      <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)"
        >Default Engine</label
      >
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="e in searchStore.engines"
          :key="e.id"
          class="px-3 py-1.5 rounded text-[11px] font-mono transition-all border"
          :class="
            searchStore.defaultEngine === e.id
              ? 'text-(--accent) bg-(--accent-bg) border-(--accent-bd-str)'
              : 'text-(--text-dimmer) border-(--border-main)'
          "
          @click="searchStore.setDefaultEngine(e.id)"
        >
          {{ e.name }}
        </button>
      </div>
    </div>

    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)"
          >Engines</label
        >
        <button
          class="flex items-center gap-1 text-[10px] font-mono transition-colors text-(--accent)"
          @click="showAdd = !showAdd"
        >
          <Plus :size="12" /> ADD
        </button>
      </div>

      <div
        v-if="showAdd"
        class="space-y-2 p-3 rounded-lg bg-(--bg-surface) border border-(--border-main)"
      >
        <AppInput v-model="newName" type="text" placeholder="Engine name" />
        <AppInput v-model="newUrl" type="text" placeholder="URL (with {query} or ${})" />
        <button
          class="w-full py-2 rounded text-[11px] font-mono transition-colors text-(--accent)"
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
          class="flex items-center justify-between p-2.5 rounded bg-(--bg-surface) border border-(--border-main)"
        >
          <div class="min-w-0 flex-1">
            <div class="text-[13px] font-mono text-(--text-primary)">
              {{ e.name }}
            </div>
            <div class="text-[10px] font-mono truncate text-(--text-dimmer)">
              {{ e.url }}
            </div>
          </div>
          <button
            v-if="searchStore.engines.length > 1"
            class="p-1 transition-colors ml-2 text-(--text-dim)"
            @click="searchStore.removeEngine(e.id)"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
