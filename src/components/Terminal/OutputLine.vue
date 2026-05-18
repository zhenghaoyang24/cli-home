<script setup lang="ts">
import type { OutputLine } from '@/types';

defineProps<{
  line: OutputLine;
}>();

const getConfig = (type: OutputLine['type']) => {
  switch (type) {
    case 'input':  return { color: '#7aa2f7', prefix: '❯' };
    case 'success': return { color: '#9ece6a', prefix: '' };
    case 'error':   return { color: '#f7768e', prefix: '' };
    case 'warning': return { color: '#e0af68', prefix: '' };
    case 'info':    return { color: '#7aa2f7', prefix: '' };
    default:        return { color: '#9aa5ce', prefix: '' };
  }
};
</script>

<template>
  <div
    class="font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-all"
    :style="{ color: getConfig(line.type).color, opacity: line.type === 'output' ? 0.78 : 1 }"
  >
    <span v-if="getConfig(line.type).prefix" class="select-none mr-2">{{ getConfig(line.type).prefix }}</span>
    <span>{{ line.content }}</span>
  </div>
</template>
