<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  modelValue?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "input", value: string): void;
}>();

const focused = ref(false);

const onInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  emit("update:modelValue", val);
  emit("input", val);
};
</script>

<template>
  <input
    :value="modelValue"
    :type="type ?? 'text'"
    :placeholder="placeholder"
    :disabled="disabled"
    class="w-full px-3 py-2 rounded text-[13px] font-mono transition-colors bg-(--bg-surface) border text-(--text-primary)"
    :class="focused ? 'border-(--border-focus)' : 'border-(--border-main)'"
    style="caret-color: var(--accent)"
    @input="onInput"
    @focus="focused = true"
    @blur="focused = false"
  />
</template>
