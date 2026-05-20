<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ExternalLink } from "lucide-vue-next";
import { useAIStore } from "@/stores/ai";
import AppInput from "@/components/Common/AppInput.vue";

const { t } = useI18n();
const aiStore = useAIStore();
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-2">
      <span class="text-lg text-(--text-primary)">🤖</span>
      <h3 class="text-sm font-mono tracking-wide text-(--text-primary)">AI Config</h3>
    </div>

    <div class="space-y-1.5">
      <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)">
        API Key
      </label>
      <AppInput
        :model-value="aiStore.config.apiKey"
        @input="aiStore.updateConfig('apiKey', $event)"
        type="password"
        placeholder="sk-..."
      />
    </div>

    <div class="space-y-1.5">
      <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)">
        API URL
      </label>
      <AppInput
        :model-value="aiStore.config.apiUrl"
        @input="aiStore.updateConfig('apiUrl', $event)"
        type="text"
        placeholder="https://api.openai.com/v1/chat/completions"
      />
    </div>

    <div class="space-y-1.5">
      <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)">
        Model
      </label>
      <AppInput
        :model-value="aiStore.config.model"
        @input="aiStore.updateConfig('model', $event)"
        type="text"
        placeholder="gpt-3.5-turbo"
      />
    </div>

    <div class="space-y-1.5">
      <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)">
        Model Provider
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="p in aiStore.PROVIDERS"
          :key="p.key"
          class="group relative flex flex-col items-start p-3 rounded-lg text-left border transition-all"
          :class="
            aiStore.config.provider === p.key
              ? 'text-(--accent) bg-(--accent-bg) border-(--accent-bd-str)'
              : 'text-(--text-dimmer) border-(--border-main) hover:border-(--text-dim)'
          "
          @click="aiStore.setProvider(p.key)"
        >
          <span class="text-[13px] font-mono font-semibold">{{ p.label }}</span>
          <a
            :href="p.url"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-1 text-[10px] font-mono flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
            :class="aiStore.config.provider === p.key ? 'text-(--accent)' : 'text-(--text-dim)'"
            @click.stop
          >
            {{ p.hostname }}
            <ExternalLink :size="10" />
          </a>
        </button>
      </div>
    </div>

    <div
      v-if="!aiStore.hasApiKey"
      class="p-3 rounded text-[11px] font-mono text-(--warning)"
      style="background: var(--warning-bg); border: 1px solid var(--warning-bd)"
    >
      ⚠ {{ t("components.pleaseConfigApiKey") }}
    </div>
  </div>
</template>
