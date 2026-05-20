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
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background: rgba(0, 0, 0, 0.5)"
    @click.self="emit('cancel')"
  >
    <div
      class="w-80 rounded-lg p-5 shadow-xl border"
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
</template>
