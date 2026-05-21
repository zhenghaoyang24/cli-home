<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <Transition name="dialog" appear>
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background: rgba(0, 0, 0, 0.5)"
      @click.self="emit('cancel')"
    >
      <div
        class="w-80 rounded-lg p-5 shadow-xl border dialog-panel"
        style="background: var(--bg-panel); border-color: var(--border-main)"
      >
        <p class="text-[13px] font-mono font-semibold text-(--text-primary) mb-1">
          {{ title }}
        </p>
        <p class="text-[12px] font-mono text-(--text-secondary) mb-5">{{ message }}</p>
        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-1.5 rounded text-[11px] font-mono transition-colors border text-(--text-secondary)"
            style="border-color: var(--border-main)"
            @click="emit('cancel')"
          >
            {{ cancelText || "Cancel" }}
          </button>
          <button
            class="px-4 py-1.5 rounded text-[11px] font-mono transition-colors text-white"
            style="background: var(--error)"
            @click="emit('confirm')"
          >
            {{ confirmText || "Confirm" }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dialog-enter-active {
  transition: opacity 200ms ease-in-out;
}
.dialog-enter-active .dialog-panel {
  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
}
.dialog-leave-active {
  transition: opacity 200ms ease-in;
}
.dialog-leave-active .dialog-panel {
  transition: opacity 200ms ease-in, transform 200ms ease-in;
}
.dialog-enter-from {
  opacity: 0;
}
.dialog-enter-from .dialog-panel {
  opacity: 0;
  transform: translateY(-40px) scale(0.8);
}
.dialog-leave-to {
  opacity: 0;
}
.dialog-leave-to .dialog-panel {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
