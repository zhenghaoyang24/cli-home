import type { SearchEngine, SearchConfig } from "@/types";

export const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  defaultEngine: "bing",
  engines: [
    { id: "bing", name: "Bing", url: "https://www.bing.com/search?q={query}" },
    { id: "github", name: "GitHub", url: "https://github.com/search?q={query}" },
    { id: "baidu", name: "百度", url: "https://www.baidu.com/s?wd={query}" },
  ],
};

export function buildSearchUrl(
  engines: SearchEngine[],
  defaultEngineId: string,
  engineId: string | undefined,
  query: string,
): string {
  const engine =
    engines.find(e => e.id === engineId) ||
    engines.find(e => e.id === defaultEngineId) ||
    engines[0];

  if (!engine) return "";

  const encoded = encodeURIComponent(query);
  return engine.url
    .replace("${query}", encoded)
    .replace("${}", encoded)
    .replace("{}", encoded)
    .replace("{query}", encoded);
}

export function findEngineByName(engines: SearchEngine[], name: string): SearchEngine | undefined {
  const lower = name.toLowerCase();
  return engines.find(e => e.name.toLowerCase() === lower || e.id === lower);
}

export function executeSearch(
  engines: SearchEngine[],
  defaultEngineId: string,
  query: string,
  engineId?: string,
): void {
  const url = buildSearchUrl(engines, defaultEngineId, engineId, query);
  if (url) window.open(url, "_blank");
}
