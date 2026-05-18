import type { SearchEngine, SearchConfig } from "@/types";
import { saveConfig, loadConfig } from "./storageService";

const DEFAULT_ENGINES: SearchEngine[] = [
  { id: "bing", name: "Bing", url: "https://www.bing.com/search?q={query}" },
  { id: "google", name: "Google", url: "https://www.google.com/search?q={query}" },
  { id: "baidu", name: "百度", url: "https://www.baidu.com/s?wd={query}" },
];

const DEFAULT_CONFIG: SearchConfig = {
  defaultEngine: "bing",
  engines: DEFAULT_ENGINES,
};

export function getConfig(): SearchConfig {
  return loadConfig("search_config", DEFAULT_CONFIG);
}

export function saveSearchConfig(config: SearchConfig): void {
  saveConfig("search_config", config);
}

export function buildSearchUrl(engineId: string, query: string): string {
  const config = getConfig();
  const engine =
    config.engines.find((e) => e.id === engineId) ||
    config.engines.find((e) => e.id === config.defaultEngine) ||
    config.engines[0];

  const encoded = encodeURIComponent(query);
  return engine.url
    .replace("${query}", encoded)
    .replace("${}", encoded)
    .replace("{}", encoded)
    .replace("{query}", encoded);
}

export function getEngines(): SearchEngine[] {
  return getConfig().engines;
}

export function setDefaultEngine(engineId: string): void {
  const config = getConfig();
  if (config.engines.some((e) => e.id === engineId)) {
    config.defaultEngine = engineId;
    saveSearchConfig(config);
  }
}

export function addEngine(engine: Omit<SearchEngine, "id">): SearchEngine {
  const config = getConfig();
  const id = engine.name.toLowerCase().replace(/\s+/g, "-");
  if (config.engines.some((e) => e.id === id)) {
    throw new Error(`搜索引擎 "${engine.name}" 已存在`);
  }
  const newEngine: SearchEngine = { ...engine, id };
  config.engines.push(newEngine);
  saveSearchConfig(config);
  return newEngine;
}

export function removeEngine(engineId: string): void {
  const config = getConfig();
  config.engines = config.engines.filter((e) => e.id !== engineId);
  if (config.defaultEngine === engineId && config.engines.length > 0) {
    config.defaultEngine = config.engines[0].id;
  }
  saveSearchConfig(config);
}

export function findEngineByName(name: string): SearchEngine | undefined {
  const config = getConfig();
  const lower = name.toLowerCase();
  return config.engines.find((e) => e.name.toLowerCase() === lower || e.id === lower);
}

export function executeSearch(query: string, engineId?: string): void {
  const targetEngineId = engineId || getConfig().defaultEngine;
  const url = buildSearchUrl(targetEngineId, query);
  window.open(url, "_blank");
}
