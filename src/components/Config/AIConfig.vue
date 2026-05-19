<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAIStore } from "@/stores/ai";

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
      <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)"
        >API Key</label
      >
      <input
        :value="aiStore.config.apiKey"
        @input="aiStore.updateConfig('apiKey', ($event.target as HTMLInputElement).value)"
        type="password"
        placeholder="sk-..."
        class="w-full px-3 py-2 rounded text-[13px] font-mono transition-colors bg-(--bg-surface) border border-(--border-main) text-(--text-primary)"
        style="caret-color: var(--accent)"
      />
    </div>

    <div class="space-y-1.5">
      <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)"
        >API URL</label
      >
      <input
        :value="aiStore.config.apiUrl"
        @input="aiStore.updateConfig('apiUrl', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="https://api.openai.com/v1/chat/completions"
        class="w-full px-3 py-2 rounded text-[13px] font-mono transition-colors bg-(--bg-surface) border border-(--border-main) text-(--text-primary)"
        style="caret-color: var(--accent)"
      />
    </div>

    <div class="space-y-1.5">
      <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)"
        >Model</label
      >
      <input
        :value="aiStore.config.model"
        @input="aiStore.updateConfig('model', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="gpt-3.5-turbo"
        class="w-full px-3 py-2 rounded text-[13px] font-mono transition-colors bg-(--bg-surface) border border-(--border-main) text-(--text-primary)"
        style="caret-color: var(--accent)"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)"
          >Temperature</label
        >
        <input
          :value="aiStore.config.temperature"
          @input="
            aiStore.updateConfig(
              'temperature',
              parseFloat(($event.target as HTMLInputElement).value),
            )
          "
          type="number"
          min="0"
          max="2"
          step="0.1"
          class="w-full px-3 py-2 rounded text-[13px] font-mono bg-(--bg-surface) border border-(--border-main) text-(--text-primary)"
        />
      </div>
      <div class="space-y-1.5">
        <label class="text-[11px] font-mono tracking-wider uppercase text-(--text-label)"
          >Max Tokens</label
        >
        <input
          :value="aiStore.config.maxTokens"
          @input="
            aiStore.updateConfig('maxTokens', parseInt(($event.target as HTMLInputElement).value))
          "
          type="number"
          min="1"
          class="w-full px-3 py-2 rounded text-[13px] font-mono bg-(--bg-surface) border border-(--border-main) text-(--text-primary)"
        />
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
