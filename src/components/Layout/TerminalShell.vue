<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

defineSlots<{
  tabs(): unknown;
  default(): unknown;
}>();

const isDragging = ref(false);
const dragPos = ref({ x: 0, y: 0 });
const returning = ref(false);
const startMouse = ref({ x: 0, y: 0 });
const startDragPos = ref({ x: 0, y: 0 });

function startDrag(e: MouseEvent | TouchEvent) {
  isDragging.value = true;
  returning.value = false;
  startMouse.value = {
    x: "touches" in e ? e.touches[0].clientX : e.clientX,
    y: "touches" in e ? e.touches[0].clientY : e.clientY,
  };
  startDragPos.value = { x: dragPos.value.x, y: dragPos.value.y };
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return;
  e.preventDefault();
  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
  dragPos.value = {
    x: startDragPos.value.x + (clientX - startMouse.value.x),
    y: startDragPos.value.y + (clientY - startMouse.value.y),
  };
}

function endDrag() {
  if (!isDragging.value) return;
  isDragging.value = false;
  returning.value = true;
  dragPos.value = { x: 0, y: 0 };
  setTimeout(() => {
    returning.value = false;
  }, 600);
}

onMounted(() => {
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchmove", onDrag, { passive: false });
  document.addEventListener("touchend", endDrag);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", endDrag);
});
</script>

<template>
  <div
    class="w-185 max-md:w-screen flex flex-col items-center justify-center min-h-screen max-md:p-2 p-4 z-10"
    :class="{ 'drag-returning': returning }"
    :style="{
      transform: `translate(${dragPos.x}px, ${dragPos.y}px)`,
      opacity: isDragging ? 0.5 : 1,
    }"
  >
    <div
      class="w-full terminal-glow rounded-xl overflow-hidden border border-(--border-main) bg-(--bg-panel)"
    >
      <div
        class="flex items-center justify-between px-4 py-2.5 border border-(--border-main) bg-(--bg-surface)"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex items-center gap-1.5 cursor-grab active:cursor-grabbing select-none"
            @mousedown.prevent="startDrag"
            @touchstart.prevent="startDrag"
          >
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

      <div
        class="h-110 max-md:h-80 w-full terminal-content relative flex flex-col overflow-hidden"
      >
        <slot />
      </div>
    </div>

    <div class="mt-6 text-xs font-mono tracking-widest text-(--text-dim)">
      CLI HOME · TERMINAL ·
      <a href="https://github.com/zhenghaoyang24/cli-home" target="_blank">GitHub</a>
    </div>
  </div>
</template>

<style scoped>
.drag-returning {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
</style>
