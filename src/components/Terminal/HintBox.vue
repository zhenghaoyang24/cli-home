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
    style="background: #0a0a10; border-top: 1px solid #1c1c30;"
  >
    <div
      v-for="(h, i) in hints"
      :key="i"
      class="flex whitespace-pre"
    >
      <span style="color: #292e3e;">  {{ h.item.command.slice(0, h.matchLen) }}</span>
      <span style="color: #7aa2f7;">{{ h.item.command.slice(h.matchLen) }}</span>
      <span style="color: #3b4261; margin-left: 12px;">{{ h.item.desc }}</span>
    </div>
  </div>
</template>
