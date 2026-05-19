import { defineStore } from "pinia";
import { ref } from "vue";

export const useConfigStore = defineStore(
  "config",
  () => {
    const language = ref<"en" | "zh">("en");

    function setLanguage(lang: "en" | "zh") {
      language.value = lang;
    }

    return {
      language,
      setLanguage,
    };
  },
  {
    persist: true,
  },
);
