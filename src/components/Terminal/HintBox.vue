<script setup lang="ts">
export interface HintItem {
  command: string;
  desc: string;
}

defineProps<{
  hints: { item: HintItem; matchLen: number }[];
}>();
</script>

<template>
  <div
    v-if="hints.length > 0"
    class="font-mono text-[12px] leading-5 px-5 py-2"
    style="background: var(--bg-hint); border-top: 1px solid var(--border-main)"
  >
    <div v-for="(h, i) in hints" :key="i" class="flex whitespace-pre">
      <span style="color: var(--text-dimmer)">
        {{ h.item.command.slice(0, h.matchLen) }}</span
      >
      <span style="color: var(--accent)">{{
        h.item.command.slice(h.matchLen)
      }}</span>
      <span style="color: var(--text-hint); margin-left: 12px">{{
        h.item.desc
      }}</span>
    </div>
  </div>
</template>
