<template>
  <div class="absolute top-0 left-0 w-full h-full bg-(--bg-panel) z-0">
    <div class="relative w-full h-full overflow-hidden">
      <Transition name="bg-crossfade">
        <component :is="effectComponent" :key="currentEffect" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useBgEffect } from "@/composables/useBgEffect";
import EffectLetter from "./Effect/EffectLetter.vue";
import EffectDither from "./Effect/EffectDither.vue";
import EffectFater from "./Effect/EffectFater.vue";
import EffectGalaxy from "./Effect/EffectGalaxy.vue";
import EffectOrb from "./Effect/EffectOrb.vue";
import EffectPlasma from "./Effect/EffectPlasma.vue";
import EffectSoft from "./Effect/EffectSoft.vue";

const { currentEffect } = useBgEffect();

const effectMap: Record<string, object> = {
  soft: EffectSoft,
  dither: EffectDither,
  fater: EffectFater,
  galaxy: EffectGalaxy,
  letter: EffectLetter,
  orb: EffectOrb,
  plasma: EffectPlasma,
};

const effectComponent = computed(() => effectMap[currentEffect.value] || EffectSoft);
</script>

<style scoped>
.bg-crossfade-enter-active,
.bg-crossfade-leave-active {
  position: absolute;
  inset: 0;
  transition: opacity 1s ease;
}
.bg-crossfade-enter-from,
.bg-crossfade-leave-to {
  opacity: 0;
}
</style>
