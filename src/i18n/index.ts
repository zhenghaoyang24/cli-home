import { createI18n } from "vue-i18n";
import type { Ref } from "vue";
import en from "./locales/en";
import zh from "./locales/zh";
import { useConfigStore } from "@/stores/config";

export type MessageSchema = typeof en;

const i18n = createI18n<[MessageSchema], "en" | "zh">({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    zh,
  },
});

export function setLocale(locale: "en" | "zh") {
  (i18n.global.locale as unknown as Ref<string>).value = locale;
  const configStore = useConfigStore();
  configStore.setLanguage(locale);
}

export function initLocale() {
  const configStore = useConfigStore();
  if (configStore.language) {
    (i18n.global.locale as unknown as Ref<string>).value = configStore.language;
  }
}

export default i18n;
