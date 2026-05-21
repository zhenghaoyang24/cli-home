import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useBgStore } from "@/stores/bg";
import type { BgEffect } from "@/stores/bg";

export { ALL_EFFECTS } from "@/stores/bg";
export type { BgEffect } from "@/stores/bg";

export function useBgEffect(): {
  currentEffect: Ref<BgEffect>;
  setEffect: (_name: string) => boolean;
} {
  const store = useBgStore();
  const { effect: currentEffect } = storeToRefs(store);
  return {
    currentEffect,
    setEffect: (name: string) => store.setEffect(name),
  };
}
