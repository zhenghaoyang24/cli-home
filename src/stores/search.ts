import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SearchConfig, SearchEngine } from '@/types';
import {
  getConfig,
  saveSearchConfig,
  executeSearch,
  addEngine as serviceAddEngine,
  removeEngine as serviceRemoveEngine,
  setDefaultEngine as serviceSetDefaultEngine,
} from '@/services/searchService';

export const useSearchStore = defineStore('search', () => {
  const config = ref<SearchConfig>(getConfig());

  const engines = computed(() => config.value.engines);
  const defaultEngine = computed(() => config.value.defaultEngine);

  const saveConfig = () => {
    saveSearchConfig(config.value);
  };

  const setDefaultEngine = (engineId: string) => {
    if (config.value.engines.some(e => e.id === engineId)) {
      config.value.defaultEngine = engineId;
      serviceSetDefaultEngine(engineId);
    }
  };

  const addEngine = (engine: Omit<SearchEngine, 'id'>) => {
    const newEngine = serviceAddEngine(engine);
    config.value = getConfig();
    return newEngine;
  };

  const removeEngine = (engineId: string) => {
    serviceRemoveEngine(engineId);
    config.value = getConfig();
  };

  const doSearch = (query: string, engineId?: string) => {
    executeSearch(query, engineId);
  };

  return {
    config,
    engines,
    defaultEngine,
    saveConfig,
    setDefaultEngine,
    addEngine,
    removeEngine,
    doSearch,
  };
});
