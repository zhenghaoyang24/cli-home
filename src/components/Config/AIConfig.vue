<script setup lang="ts">
import { useAIStore } from '@/stores/ai';
const aiStore = useAIStore();
const uc = (key: keyof typeof aiStore.config, val: unknown) => aiStore.updateConfig(key, val);
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-2">
      <span class="text-lg" style="color: #9aa5ce;">🤖</span>
      <h3 class="text-sm font-mono tracking-wide" style="color: #9aa5ce;">AI Config</h3>
    </div>

    <div v-for="field in [
      { key: 'apiKey' as const, label: 'API Key', type: 'password', ph: 'sk-...' },
      { key: 'apiUrl' as const, label: 'API URL', type: 'text', ph: 'https://api.openai.com/v1/chat/completions' },
      { key: 'model' as const, label: 'Model', type: 'text', ph: 'gpt-3.5-turbo' },
    ]" :key="field.key" class="space-y-1.5">
      <label class="text-[11px] font-mono tracking-wider uppercase" style="color: #4a527a;">{{ field.label }}</label>
      <input
        :value="aiStore.config[field.key]"
        @input="uc(field.key, ($event.target as HTMLInputElement).value)"
        :type="field.type" :placeholder="field.ph"
        class="w-full px-3 py-2 rounded text-[13px] font-mono transition-colors"
        style="background: #0f0f18; border: 1px solid #1c1c30; color: #9aa5ce; caret-color: #7aa2f7;"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label class="text-[11px] font-mono tracking-wider uppercase" style="color: #4a527a;">Temperature</label>
        <input
          :value="aiStore.config.temperature"
          @input="uc('temperature', parseFloat(($event.target as HTMLInputElement).value))"
          type="number" min="0" max="2" step="0.1"
          class="w-full px-3 py-2 rounded text-[13px] font-mono"
          style="background: #0f0f18; border: 1px solid #1c1c30; color: #9aa5ce;"
        />
      </div>
      <div class="space-y-1.5">
        <label class="text-[11px] font-mono tracking-wider uppercase" style="color: #4a527a;">Max Tokens</label>
        <input
          :value="aiStore.config.maxTokens"
          @input="uc('maxTokens', parseInt(($event.target as HTMLInputElement).value))"
          type="number" min="1"
          class="w-full px-3 py-2 rounded text-[13px] font-mono"
          style="background: #0f0f18; border: 1px solid #1c1c30; color: #9aa5ce;"
        />
      </div>
    </div>

    <div v-if="!aiStore.hasApiKey" class="p-3 rounded text-[11px] font-mono" style="background: rgba(224,175,104,0.04); border: 1px solid rgba(224,175,104,0.13); color: #e0af68;">
      ⚠ 请配置 API 密钥以使用 AI 功能
    </div>
  </div>
</template>
