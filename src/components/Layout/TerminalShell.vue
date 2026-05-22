<script setup lang="ts">
defineSlots<{
  tabs(): unknown;
  default(): unknown;
}>();
</script>

<template>
  <div
    class="w-185 max-md:w-screen flex flex-col items-center justify-center min-h-screen max-md:p-2 p-4 z-10"
  >
    <div
      class="w-full terminal-glow rounded-xl overflow-hidden border border-(--border-main) bg-(--bg-panel)"
    >
      <div
        class="flex items-center justify-between px-4 py-2.5 border border-(--border-main) bg-(--bg-surface)"
      >
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-full" style="background: var(--dot-red)" />
            <div class="w-3 h-3 rounded-full" style="background: var(--dot-yellow)" />
            <div class="w-3 h-3 rounded-full" style="background: var(--dot-green)" />
          </div>
          <span class="text-xs font-mono ml-2 text-(--text-label)">CLI Home</span>
        </div>

        <nav class="flex items-center gap-0.5">
          <slot name="tabs" />
        </nav>
      </div>

      <div class="h-110 max-md:h-80 w-full terminal-content relative flex flex-col overflow-hidden">
        <slot />
      </div>
    </div>

    <div class="mt-6 text-xs font-mono tracking-widest text-(--text-dim)">
      CLI HOME · TERMINAL ·
      <a href="https://github.com/zhenghaoyang24/cli-home" target="_blank">GitHub</a>
    </div>
  </div>
</template>
