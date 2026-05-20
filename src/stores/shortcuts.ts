import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Shortcut } from "@/types";

const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: "1", name: "bilibili", url: "https://www.bilibili.com", createdAt: new Date() },
  { id: "2", name: "github", url: "https://github.com", createdAt: new Date() },
  { id: "3", name: "baidu", url: "https://www.baidu.com", createdAt: new Date() },
  { id: "4", name: "google", url: "https://www.google.com", createdAt: new Date() },
];

export const useShortcutsStore = defineStore(
  "shortcuts",
  () => {
    const shortcuts = ref<Shortcut[]>(DEFAULT_SHORTCUTS);

    function ensureProtocol(url: string): string {
      if (/^https?:\/\//i.test(url)) return url;
      return `https://${url}`;
    }

    const addShortcut = (name: string, url: string) => {
      if (shortcuts.value.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        throw new Error("快捷指令已存在");
      }
      const item: Shortcut = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name,
        url: ensureProtocol(url),
        createdAt: new Date(),
      };
      shortcuts.value.push(item);
      return item;
    };

    const updateShortcut = (id: string, name: string, url: string) => {
      const existing = shortcuts.value.find(s => s.id === id);
      if (!existing) throw new Error("快捷指令不存在");
      if (shortcuts.value.some(s => s.id !== id && s.name.toLowerCase() === name.toLowerCase())) {
        throw new Error("快捷指令名称已存在");
      }
      existing.name = name;
      existing.url = ensureProtocol(url);
      return existing;
    };

    const deleteShortcut = (id: string) => {
      const idx = shortcuts.value.findIndex(s => s.id === id);
      if (idx === -1) throw new Error("快捷指令不存在");
      shortcuts.value.splice(idx, 1);
    };

    const findShortcutByName = (name: string): Shortcut | undefined => {
      return shortcuts.value.find(s => s.name.toLowerCase() === name.toLowerCase());
    };

    const executeShortcut = (name: string): boolean => {
      const sc = findShortcutByName(name);
      if (sc) {
        window.open(sc.url, "_blank");
        return true;
      }
      return false;
    };

    const findByKeyword = (keyword: string): Shortcut[] => {
      const kw = keyword.toLowerCase();
      return shortcuts.value.filter(
        s => s.name.toLowerCase().includes(kw) || s.url.toLowerCase().includes(kw),
      );
    };

    const sortedShortcuts = computed(() =>
      [...shortcuts.value].sort((a, b) => a.name.localeCompare(b.name)),
    );

    return {
      shortcuts,
      sortedShortcuts,
      addShortcut,
      updateShortcut,
      deleteShortcut,
      findShortcutByName,
      executeShortcut,
      findByKeyword,
    };
  },
  { persist: true },
);
