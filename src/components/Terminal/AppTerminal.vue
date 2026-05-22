<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import OutputLine from "./OutputLine.vue";
import CommandInput from "./CommandInput.vue";
import HintBox from "./HintBox.vue";
import { useTerminalStore } from "@/stores/terminal";
import { useCommands } from "@/composables/useCommands";

const terminalStore = useTerminalStore();
const outputRef = ref<HTMLElement | null>(null);

const { hints, executeCommand, handleTabComplete, showWelcome } = useCommands();

const scrollToBottom = () => {
  nextTick(() => {
    if (outputRef.value) outputRef.value.scrollTop = outputRef.value.scrollHeight;
  });
};

watch(
  () => terminalStore.history.map(h => h.content).join(""),
  () => scrollToBottom(),
);

const handleNavigate = (dir: "up" | "down") => terminalStore.navigateHistory(dir);

onMounted(() => {
  if (terminalStore.history.length === 0) {
    showWelcome();
  }
});
</script>

<template>
  <div class="flex-1 min-h-0 w-full flex flex-col bg-(--bg-panel)">
    <div
      ref="outputRef"
      class="output-area flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 font-mono text-[13px] leading-relaxed space-y-0.5"
    >
      <OutputLine v-for="line in terminalStore.history" :key="line.id" :line="line" />
    </div>
    <HintBox :hints="hints" />
    <div class="px-5 py-3 border-t border-(--border-main) bg-(--bg-surface)">
      <CommandInput
        v-model="terminalStore.currentInput"
        @submit="executeCommand"
        @navigate="handleNavigate"
        @tab="handleTabComplete"
      />
    </div>
  </div>
</template>
