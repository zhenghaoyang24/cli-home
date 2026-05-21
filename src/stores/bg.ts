import { defineStore } from "pinia";
import { ref } from "vue";

export const EFFECTS = [
  "soft",
  "dither",
  "fater",
  "galaxy",
  "letter",
  "orb",
  "plasma",
] as const;

export type BgEffect = (typeof EFFECTS)[number];

export const ALL_EFFECTS: readonly string[] = EFFECTS;

export const useBgStore = defineStore(
  "bg",
  () => {
    const effect = ref<BgEffect>("soft");

    function setEffect(name: string): boolean {
      if (EFFECTS.includes(name as BgEffect)) {
        effect.value = name as BgEffect;
        return true;
      }
      return false;
    }

    return { effect, setEffect };
  },
  {
    persist: true,
  },
);
