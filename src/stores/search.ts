import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SearchEngine, SearchConfig } from "@/types";
import { DEFAULT_SEARCH_CONFIG, executeSearch, findEngineByName } from "@/services/searchService";

export const useSearchStore = defineStore(
  "search",
  () => {
    const config = ref<SearchConfig>({ ...DEFAULT_SEARCH_CONFIG, engines: [...DEFAULT_SEARCH_CONFIG.engines] });

    const engines = computed(() => config.value.engines);
    const defaultEngine = computed(() => config.value.defaultEngine);

    const setDefaultEngine = (engineId: string) => {
      if (config.value.engines.some((e) => e.id === engineId)) {
        config.value.defaultEngine = engineId;
      }
    };

    const addEngine = (engine: Omit<SearchEngine, "id">) => {
      const id = engine.name.toLowerCase().replace(/\s+/g, "-");
      if (config.value.engines.some((e) => e.id === id)) {
        throw new Error(`搜索引擎 "${engine.name}" 已存在`);
      }
      const newEngine: SearchEngine = { ...engine, id };
      config.value.engines.push(newEngine);
      return newEngine;
    };

    const removeEngine = (engineId: string) => {
      config.value.engines = config.value.engines.filter((e) => e.id !== engineId);
      if (config.value.defaultEngine === engineId && config.value.engines.length > 0) {
        config.value.defaultEngine = config.value.engines[0].id;
      }
    };

    const findEngine = (name: string) => findEngineByName(config.value.engines, name);

    const doSearch = (query: string, engineId?: string) => {
      executeSearch(config.value.engines, config.value.defaultEngine, query, engineId);
    };

    return {
      config,
      engines,
      defaultEngine,
      setDefaultEngine,
      addEngine,
      removeEngine,
      findEngine,
      doSearch,
    };
  },
  {
    persist: true,
  },
);
