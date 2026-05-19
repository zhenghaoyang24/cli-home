<script setup lang="ts">
import { useAIStore } from "@/stores/ai";
const aiStore = useAIStore();
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-2">
      <span class="text-lg text-[var(--text-primary)]">🤖</span>
      <h3 class="text-sm font-mono tracking-wide text-[var(--text-primary)]">
        AI Config
      </h3>
    </div>

    <div class="space-y-1.5">
      <label
        class="text-[11px] font-mono tracking-wider uppercase text-[var(--text-label)]"
        >API Key</label
      >
      <input
        :value="aiStore.config.apiKey"
        @input="aiStore.updateConfig('apiKey', ($event.target as HTMLInputElement).value)"
        type="password"
        placeholder="sk-..."
        class="w-full px-3 py-2 rounded text-[13px] font-mono transition-colors bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-primary)]"
        style="caret-color: var(--accent)"
      />
    </div>

    <div class="space-y-1.5">
      <label
        class="text-[11px] font-mono tracking-wider uppercase text-[var(--text-label)]"
        >API URL</label
      >
      <input
        :value="aiStore.config.apiUrl"
        @input="aiStore.updateConfig('apiUrl', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="https://api.openai.com/v1/chat/completions"
        class="w-full px-3 py-2 rounded text-[13px] font-mono transition-colors bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-primary)]"
        style="caret-color: var(--accent)"
      />
    </div>

    <div class="space-y-1.5">
      <label
        class="text-[11px] font-mono tracking-wider uppercase text-[var(--text-label)]"
        >Model</label
      >
      <input
        :value="aiStore.config.model"
        @input="aiStore.updateConfig('model', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="gpt-3.5-turbo"
        class="w-full px-3 py-2 rounded text-[13px] font-mono transition-colors bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-primary)]"
        style="caret-color: var(--accent)"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label
          class="text-[11px] font-mono tracking-wider uppercase text-[var(--text-label)]"
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
          class="w-full px-3 py-2 rounded text-[13px] font-mono bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-primary)]"
        />
      </div>
      <div class="space-y-1.5">
        <label
          class="text-[11px] font-mono tracking-wider uppercase text-[var(--text-label)]"
          >Max Tokens</label
        >
        <input
          :value="aiStore.config.maxTokens"
          @input="
            aiStore.updateConfig('maxTokens', parseInt(($event.target as HTMLInputElement).value))
          "
          type="number"
          min="1"
          class="w-full px-3 py-2 rounded text-[13px] font-mono bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-primary)]"
        />
      </div>
    </div>

    <div
      v-if="!aiStore.hasApiKey"
      class="p-3 rounded text-[11px] font-mono text-[var(--warning)]"
      style="background: var(--warning-bg); border: 1px solid var(--warning-bd)"
    >
      ⚠ 请配置 API 密钥以使用 AI 功能
    </div>
  </div>
</template>
