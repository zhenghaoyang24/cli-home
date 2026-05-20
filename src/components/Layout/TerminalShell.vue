<script setup lang="ts">
defineSlots<{
  tabs(): unknown;
  default(): unknown;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
    <div
      class="terminal-glow rounded-xl overflow-hidden border border-(--border-main)"
      style="
        width: 720px;
        max-width: calc(100vw - 48px);
        background: var(--bg-panel);
        box-shadow:
          0 0 60px var(--shadow),
          0 0 120px var(--glow-b),
          0 30px 80px rgba(0, 0, 0, 0.9);
      "
    >
      <div
        class="flex items-center justify-between px-4 py-2.5 border-b border-(--border-main) bg-(--bg-surface)"
      >
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-full" style="background: var(--dot-red)" />
            <div class="w-3 h-3 rounded-full" style="background: var(--dot-yellow)" />
            <div class="w-3 h-3 rounded-full" style="background: var(--dot-green)" />
          </div>
          <span class="text-xs font-mono ml-2 text-(--text-label)">CLI Home — zsh</span>
        </div>

        <nav class="flex items-center gap-0.5">
          <slot name="tabs" />
        </nav>
      </div>

      <div
        class="terminal-content flex flex-col overflow-hidden"
        style="height: 420px; width: 100%"
      >
        <slot />
      </div>
    </div>

    <div class="mt-6 text-xs font-mono tracking-widest text-(--text-dimmer)">
      CLI HOME · TERMINAL ·
      <a href="https://github.com/zhenghaoyang24/cli-home" target="_blank">GitHub</a>
    </div>
  </div>
</template>
