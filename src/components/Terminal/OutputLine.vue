<script setup lang="ts">
import type { OutputLine } from "@/types";

defineProps<{
  line: OutputLine;
}>();

const getConfig = (type: OutputLine["type"]) => {
  switch (type) {
    case "input":
      return { color: "var(--accent)", prefix: "❯" };
    case "success":
      return { color: "var(--success)", prefix: "" };
    case "error":
      return { color: "var(--error)", prefix: "" };
    case "warning":
      return { color: "var(--warning)", prefix: "" };
    case "info":
      return { color: "var(--accent)", prefix: "" };
    default:
      return { color: "var(--text-primary)", prefix: "" };
  }
};
</script>

<template>
  <div
    class="font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-all"
    :style="{
      color: getConfig(line.type).color,
      opacity: line.type === 'output' ? 0.78 : 1,
    }"
  >
    <!-- <span v-if="getConfig(line.type).prefix" class="select-none mr-2">{{
      getConfig(line.type).prefix
    }}</span> -->
    <span>{{ line.content }}</span>
    <span
      v-if="line._typing"
      class="cursor-blink inline-block w-1.75 h-3.5 ml-px align-middle"
      :style="{ background: getConfig(line.type).color }"
    ></span>
  </div>
</template>
