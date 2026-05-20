<script setup lang="ts">
import { useToast } from "@/stores/notification";

const { toasts } = useToast();

const typeStyle: Record<string, string> = {
  success:
    "color: var(--success); background: var(--success-bg); border: 1px solid var(--success-bd, #2d4a2d)",
  error:
    "color: var(--error); background: var(--error-bg); border: 1px solid var(--error-bd, #4a2d2d)",
  warning:
    "color: var(--warning); background: var(--warning-bg); border: 1px solid var(--warning-bd, #4a4020)",
  info: "color: var(--accent); background: var(--accent-bg); border: 1px solid var(--accent-bd, #2d3a4a)",
};
</script>

<template>
  <div
    class="fixed top-4 left-1/2 -translate-x-1/2 z-999999 flex flex-col items-center gap-2 pointer-events-none"
  >
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="px-4 py-2 rounded text-[12px] font-mono shadow-lg pointer-events-auto whitespace-nowrap"
        :style="typeStyle[t.type]"
      >
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.3s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
