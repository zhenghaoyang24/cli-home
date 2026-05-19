const STORAGE_PREFIX = "clihome_";

export function saveConfig<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save config:", e);
  }
}

export function loadConfig<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load config:", e);
  }
  return defaultValue;
}

export function saveShortcuts(shortcuts: unknown[]): void {
  saveConfig("shortcuts", shortcuts);
}

export function loadShortcuts<T>(defaultValue: T): T {
  return loadConfig("shortcuts", defaultValue);
}

export function saveCommandHistory(history: unknown[]): void {
  saveConfig("command_history", history);
}

export function loadCommandHistory<T>(defaultValue: T): T {
  return loadConfig("command_history", defaultValue);
}

export function clearAllConfig(): void {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error("Failed to clear config:", e);
  }
}
