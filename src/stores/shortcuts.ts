import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Shortcut } from '@/types';
import { saveShortcuts, loadShortcuts } from '@/services/storageService';

const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: '1', name: 'bilibili', url: 'https://www.bilibili.com', createdAt: new Date() },
  { id: '2', name: 'github', url: 'https://github.com', createdAt: new Date() },
  { id: '3', name: 'baidu', url: 'https://www.baidu.com', createdAt: new Date() },
  { id: '4', name: 'google', url: 'https://www.google.com', createdAt: new Date() },
];

export const useShortcutsStore = defineStore('shortcuts', () => {
  const shortcuts = ref<Shortcut[]>(loadShortcuts<Shortcut[]>(DEFAULT_SHORTCUTS));

  const saveShortcutsToStorage = () => {
    saveShortcuts(shortcuts.value);
  };

  const addShortcut = (name: string, url: string) => {
    const exists = shortcuts.value.some(s => s.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      throw new Error('快捷指令已存在');
    }

    const newShortcut: Shortcut = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name,
      url,
      createdAt: new Date(),
    };
    shortcuts.value.push(newShortcut);
    saveShortcutsToStorage();
    return newShortcut;
  };

  const updateShortcut = (id: string, name: string, url: string) => {
    const index = shortcuts.value.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('快捷指令不存在');
    }

    const nameExists = shortcuts.value.some(
      s => s.id !== id && s.name.toLowerCase() === name.toLowerCase()
    );
    if (nameExists) {
      throw new Error('快捷指令名称已存在');
    }

    shortcuts.value[index].name = name;
    shortcuts.value[index].url = url;
    saveShortcutsToStorage();
    return shortcuts.value[index];
  };

  const deleteShortcut = (id: string) => {
    const index = shortcuts.value.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('快捷指令不存在');
    }
    shortcuts.value.splice(index, 1);
    saveShortcutsToStorage();
  };

  const findShortcutByName = (name: string): Shortcut | undefined => {
    return shortcuts.value.find(s => s.name.toLowerCase() === name.toLowerCase());
  };

  const executeShortcut = (name: string): boolean => {
    const shortcut = findShortcutByName(name);
    if (shortcut) {
      window.open(shortcut.url, '_blank');
      return true;
    }
    return false;
  };

  const findByKeyword = (keyword: string): Shortcut[] => {
    const lowerKeyword = keyword.toLowerCase();
    return shortcuts.value.filter(s => 
      s.name.toLowerCase().includes(lowerKeyword) || 
      s.url.toLowerCase().includes(lowerKeyword)
    );
  };

  const sortedShortcuts = computed(() => {
    return [...shortcuts.value].sort((a, b) => a.name.localeCompare(b.name));
  });

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
});
