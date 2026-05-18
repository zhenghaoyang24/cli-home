<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';

const props = defineProps<{ modelValue: string }>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'submit'): void;
  (e: 'navigate', direction: 'up' | 'down'): void;
  (e: 'tab'): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

watch(() => props.modelValue, () => {
  nextTick(() => {
    if (inputRef.value) inputRef.value.setSelectionRange(props.modelValue.length, props.modelValue.length);
  });
});

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') { event.preventDefault(); emit('submit'); }
  else if (event.key === 'ArrowUp') { event.preventDefault(); emit('navigate', 'up'); }
  else if (event.key === 'ArrowDown') { event.preventDefault(); emit('navigate', 'down'); }
  else if (event.key === 'Tab') { event.preventDefault(); emit('tab'); }
};

const focus = () => inputRef.value?.focus();
onMounted(() => focus());
defineExpose({ focus });
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="font-mono text-base select-none" style="color: #9ece6a;">❯</span>
    <input
      ref="inputRef"
      type="text"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown="handleKeyDown"
      class="flex-1 bg-transparent border-none outline-none text-base font-mono py-1"
      style="color: #a9b1d6; caret-color: #7aa2f7;"
      placeholder="输入命令..."
      autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
    />
    <span class="w-2.5 h-[18px] cursor-blink" style="background: #7aa2f7;"></span>
  </div>
</template>
