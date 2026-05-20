import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTerminalStore } from "@/stores/terminal";
import { useSearchStore } from "@/stores/search";
import { useAIStore } from "@/stores/ai";
import { useShortcutsStore } from "@/stores/shortcuts";
import type { HintItem } from "@/components/Terminal/HintBox.vue";
import {
  parseCommand,
  parseSearchArgs,
  parseToArgs,
  parseAIArgs,
  parseConfigArgs,
} from "@/utils/commandParser";
import { setLocale } from "@/i18n";

export function useCommands() {
  const { t } = useI18n();
  const terminalStore = useTerminalStore();
  const searchStore = useSearchStore();
  const aiStore = useAIStore();
  const shortcutsStore = useShortcutsStore();

  const hints = computed(() => {
    const input = terminalStore.currentInput;
    if (!input) return [];
    const lower = input.toLowerCase();
    const allHints: HintItem[] = [
      { command: "help", desc: t("terminal.help") },
      { command: "clear", desc: t("terminal.clear") },
      { command: "history", desc: t("terminal.history") },
      { command: "search <keyword>", desc: t("terminal.searchKeyword") },
      { command: "search <engine> <keyword>", desc: t("terminal.searchEngineKeyword") },
      { command: "search add <name> <URL+{}>", desc: t("terminal.searchAdd") },
      { command: "search list", desc: t("terminal.searchList") },
      { command: "search default <engine>", desc: t("terminal.searchDefault") },
      { command: "search delete <engine>", desc: t("terminal.searchDelete") },
      { command: "ai <question>", desc: t("terminal.aiQuestion") },
      { command: "ai config set <key> <val>", desc: t("terminal.aiConfig") },
      { command: "ai clear", desc: t("terminal.aiClear") },
      { command: "goto <name>", desc: t("terminal.gotoName") },
      { command: "goto add <name> <URL>", desc: t("terminal.gotoAdd") },
      { command: "goto list", desc: t("terminal.gotoList") },
      { command: "goto edit <name> <URL>", desc: t("terminal.gotoEdit") },
      { command: "goto delete <name>", desc: t("terminal.gotoDelete") },
      { command: "config language <en|cn>", desc: t("terminal.configLanguage") },
      { command: "config language list", desc: t("terminal.configLanguageList") },
    ];
    return allHints
      .filter(h => h.command.toLowerCase().startsWith(lower))
      .map(h => ({ item: h, matchLen: input.length }))
      .slice(0, 8);
  });

  const findCommonPrefix = (strings: string[]): string => {
    if (!strings.length) return "";
    let prefix = strings[0];
    for (const s of strings) {
      while (!s.toLowerCase().startsWith(prefix.toLowerCase())) {
        prefix = prefix.slice(0, -1);
        if (!prefix) return "";
      }
    }
    return prefix;
  };

  const handleTabComplete = () => {
    const input = terminalStore.currentInput;
    if (!input) return;
    const lower = input.toLowerCase();
    const allHints = hints.value.map(h => h.item);
    const matches = allHints.filter(h => h.command.toLowerCase().startsWith(lower));
    if (matches.length === 1) {
      terminalStore.currentInput = matches[0].command;
      return;
    }
    if (matches.length > 1) {
      const common = findCommonPrefix(matches.map(m => m.command));
      if (common.length > input.length) {
        terminalStore.currentInput = common;
      }
    }
  };

  const showHelp = () => {
    terminalStore.addOutput("", "output");
    terminalStore.addOutput(
      "┌───────────────────────────────────────────────────────────────────┐",
      "info",
    );
    terminalStore.addOutput(
      `│                   ${t("terminal.commandReference").padEnd(48)}│`,
      "info",
    );
    terminalStore.addOutput(
      "┌───────────────────────────────────────────────────────────────────┐",
      "info",
    );
    const cmds = [
      ["help", t("terminal.help")],
      ["clear", t("terminal.clear")],
      ["history", t("terminal.history")],
      ["search <keyword>", t("terminal.searchKeyword")],
      ["search <engine> <keyword>", t("terminal.searchEngineKeyword")],
      ["search add <name> <URL>", t("terminal.searchAdd")],
      ["search list", t("terminal.searchList")],
      ["search default <engine>", t("terminal.searchDefault")],
      ["search delete <engine>", t("terminal.searchDelete")],
      ["<direct input>", t("terminal.directInput")],
      ["ai <question>", t("terminal.aiQuestion")],
      ["ai config set <key> <val>", t("terminal.aiConfig")],
      ["ai clear", t("terminal.aiClear")],
      ["goto <name>", t("terminal.gotoName")],
      ["goto add <name> <URL>", t("terminal.gotoAdd")],
      ["goto list", t("terminal.gotoList")],
      ["goto edit <name> <URL>", t("terminal.gotoEdit")],
      ["goto delete <name>", t("terminal.gotoDelete")],
      ["config language <en|cn>", t("terminal.configLanguage")],
      ["config language list", t("terminal.configLanguageList")],
    ];
    cmds.forEach(([cmd, desc]) => {
      terminalStore.addOutput(`│  ${cmd.padEnd(30)} ${desc.padEnd(34)}│`, "info");
    });
    terminalStore.addOutput(
      "┌───────────────────────────────────────────────────────────────────┐",
      "info",
    );
    terminalStore.addOutput("", "output");
  };

  const handleSearch = (args: string[]) => {
    const { action, query, engineName, engineUrl } = parseSearchArgs(searchStore.engines, args);
    switch (action) {
      case "search": {
        if (engineName) {
          terminalStore.addOutput(
            t("messages.searching", { engine: engineName, query: query || "(空)" }),
            "info",
          );
          searchStore.doSearch(query || "", engineName);
        } else {
          terminalStore.addOutput(t("messages.searchingDefault", { query }), "info");
          searchStore.doSearch(query);
        }
        break;
      }
      case "add": {
        if (!engineName || !engineUrl) {
          terminalStore.addOutput(t("messages.searchAddUsage"), "warning");
          terminalStore.addOutput(t("messages.searchAddTip"), "output");
          return;
        }
        try {
          searchStore.addEngine({ name: engineName, url: engineUrl });
          terminalStore.addOutput(t("messages.searchAdded", { name: engineName }), "success");
        } catch (e) {
          terminalStore.addOutput(`✗ ${(e as Error).message}`, "error");
        }
        break;
      }
      case "list": {
        const engines = searchStore.engines;
        if (!engines.length) {
          terminalStore.addOutput(t("messages.noSearchEngines"), "warning");
          return;
        }
        terminalStore.addOutput(
          engines
            .map(
              e =>
                `  ${e.name.padEnd(14)} ${e.id === searchStore.defaultEngine ? "★ " : "  "}${e.url}`,
            )
            .join("\n"),
          "success",
        );
        break;
      }
      case "default": {
        if (!engineName) {
          terminalStore.addOutput(t("messages.searchDefaultUsage"), "warning");
          return;
        }
        const found = searchStore.engines.find(
          e =>
            e.name.toLowerCase() === engineName.toLowerCase() || e.id === engineName.toLowerCase(),
        );
        if (!found) {
          terminalStore.addOutput(
            t("messages.searchEngineNotFound", { name: engineName }),
            "error",
          );
          return;
        }
        searchStore.setDefaultEngine(found.id);
        terminalStore.addOutput(t("messages.searchDefaultSet", { name: found.name }), "success");
        break;
      }
      case "delete": {
        if (!engineName) {
          terminalStore.addOutput(t("messages.searchDeleteUsage"), "warning");
          return;
        }
        const found = searchStore.engines.find(
          e =>
            e.name.toLowerCase() === engineName.toLowerCase() || e.id === engineName.toLowerCase(),
        );
        if (!found) {
          terminalStore.addOutput(
            t("messages.searchEngineNotFound", { name: engineName }),
            "error",
          );
          return;
        }
        if (searchStore.engines.length <= 1) {
          terminalStore.addOutput(t("messages.atLeastOneEngine"), "error");
          return;
        }
        searchStore.removeEngine(found.id);
        terminalStore.addOutput(t("messages.searchDeleted", { name: found.name }), "success");
        break;
      }
    }
  };

  const handleTo = (args: string[]) => {
    const { action, name, url } = parseToArgs(args);
    switch (action) {
      case "list": {
        if (!shortcutsStore.shortcuts.length) {
          terminalStore.addOutput(t("messages.noShortcuts"), "warning");
          return;
        }
        terminalStore.addOutput(
          shortcutsStore.shortcuts.map(s => `  ${s.name.padEnd(16)} →  ${s.url}`).join("\n"),
          "success",
        );
        break;
      }
      case "add": {
        if (!name || !url) {
          terminalStore.addOutput(t("messages.gotoAddUsage"), "warning");
          return;
        }
        try {
          shortcutsStore.addShortcut(name, url);
          terminalStore.addOutput(t("messages.added", { name }), "success");
        } catch (e) {
          terminalStore.addOutput(`✗ ${(e as Error).message}`, "error");
        }
        break;
      }
      case "edit": {
        if (!name || !url) {
          terminalStore.addOutput(t("messages.gotoEditUsage"), "warning");
          return;
        }
        try {
          const sc = shortcutsStore.findShortcutByName(name);
          if (!sc) {
            terminalStore.addOutput(t("messages.shortcutNotFound", { name }), "warning");
            return;
          }
          shortcutsStore.updateShortcut(sc.id, name, url);
          terminalStore.addOutput(t("messages.updated", { name }), "success");
        } catch (e) {
          terminalStore.addOutput(`✗ ${(e as Error).message}`, "error");
        }
        break;
      }
      case "delete": {
        if (!name) {
          terminalStore.addOutput(t("messages.gotoDeleteUsage"), "warning");
          return;
        }
        try {
          const sc = shortcutsStore.findShortcutByName(name);
          if (!sc) {
            terminalStore.addOutput(t("messages.shortcutNotFound", { name }), "warning");
            return;
          }
          shortcutsStore.deleteShortcut(sc.id);
          terminalStore.addOutput(t("messages.deleted", { name }), "success");
        } catch (e) {
          terminalStore.addOutput(`✗ ${(e as Error).message}`, "error");
        }
        break;
      }
      case "execute": {
        if (!name) {
          terminalStore.addOutput(t("messages.gotoUsage"), "warning");
          return;
        }
        const ok = shortcutsStore.executeShortcut(name);
        if (ok) terminalStore.addOutput(`→ ${t("messages.opening", { name })}`, "info");
        else terminalStore.addOutput(t("messages.notFound", { name }), "error");
        break;
      }
    }
  };

  const handleAI = async (args: string[]) => {
    const { action, key, value, query } = parseAIArgs(args);
    switch (action) {
      case "config": {
        if (!key) {
          terminalStore.addOutput(t("messages.aiConfigUsage"), "warning");
          return;
        }
        try {
          aiStore.updateConfig(key as keyof typeof aiStore.config, value);
          terminalStore.addOutput(
            t("messages.aiConfigUpdated", { key, value: key === "apiKey" ? "••••••" : value }),
            "success",
          );
        } catch (e) {
          terminalStore.addOutput(`✗ ${(e as Error).message}`, "error");
        }
        break;
      }
      case "clear": {
        aiStore.clearMessages();
        terminalStore.addOutput(t("messages.aiHistoryCleared"), "success");
        break;
      }
      case "chat": {
        if (!query) {
          terminalStore.addOutput(t("messages.pleaseEnterQuestion"), "warning");
          return;
        }
        if (!aiStore.hasApiKey) {
          terminalStore.addOutput(t("messages.pleaseConfigApiKey"), "warning");
          return;
        }
        terminalStore.addOutput(t("messages.thinking"), "info");
        try {
          const res = await aiStore.sendMessageToAI(query);
          terminalStore.addOutput(res, "output");
        } catch (err) {
          terminalStore.addOutput(`✗ ${(err as Error).message}`, "error");
        }
        break;
      }
    }
  };

  const handleConfig = (args: string[]) => {
    const { module, action, key, value } = parseConfigArgs(args);
    if (module === "language") {
      if (action === "list") {
        terminalStore.addOutput(t("messages.configLanguageList"), "info");
        terminalStore.addOutput("  en - English", "output");
        terminalStore.addOutput("  cn - 中文", "output");
        return;
      }
      if (action === "set") {
        if (value === "en" || value === "cn") {
          setLocale(value === "cn" ? "zh" : "en");
          terminalStore.addOutput(t("messages.configLanguageSet", { value }), "success");
        } else {
          terminalStore.addOutput(t("messages.configLanguageInvalid", { value }), "error");
        }
        return;
      }
      terminalStore.addOutput(t("messages.configLanguageUsage"), "warning");
      return;
    }
    if (module === "set") {
      terminalStore.addOutput(t("messages.configDeprecatedSet"), "warning");
      return;
    }
    if (module === "search" && action === "set") {
      if (!key) {
        terminalStore.addOutput(t("messages.configSearchUsage"), "warning");
        return;
      }
      if (key === "defaultEngine") {
        if (!value) {
          terminalStore.addOutput(t("messages.enterSearchEngineId"), "warning");
          return;
        }
        searchStore.setDefaultEngine(value);
        terminalStore.addOutput(t("messages.defaultEngine", { value }), "success");
      } else {
        terminalStore.addOutput(t("messages.unknownConfig", { key }), "error");
      }
      return;
    }
    terminalStore.addOutput(t("messages.configGeneralUsage"), "warning");
  };

  const executeCommand = () => {
    const cmd = terminalStore.currentInput.trim();
    if (!cmd) return;
    terminalStore.executeCommand(cmd);
    const parsed = parseCommand(cmd);
    switch (parsed.type) {
      case "help":
        showHelp();
        break;
      case "clear":
        terminalStore.clearHistory();
        break;
      case "history": {
        const list = terminalStore.getCommandHistoryList();
        if (!list.length) terminalStore.addOutput(t("messages.noCommandHistory"), "warning");
        else
          terminalStore.addOutput(
            list.map(h => `  ${String(h.index).padStart(3)}  ${h.command}`).join("\n"),
            "info",
          );
        break;
      }
      case "search":
        handleSearch(parsed.args);
        break;
      case "ai":
        handleAI(parsed.args);
        break;
      case "goto":
        handleTo(parsed.args);
        break;
      case "config":
        handleConfig(parsed.args);
        break;
    }
  };

  const showWelcome = () => {
    const lines = [
      "    ██████╗ ██╗     ██╗    ██╗  ██╗ ██████╗ ███╗   ███╗███████╗",
      "   ██╔════╝ ██║     ██║    ██║  ██║██╔═══██╗████╗ ████║██╔════╝",
      "   ██║      ██║     ██║    ███████║██║   ██║██╔████╔██║█████╗  ",
      "   ██║      ██║     ██║    ██╔══██║██║   ██║██║╚██╔╝██║██╔══╝  ",
      "   ╚██████╗ ███████╗██║    ██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗",
      "    ╚═════╝ ╚══════╝╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝",
    ];
    lines.forEach(l => terminalStore.addOutput(l, "info"));
    terminalStore.addOutput("", "output");
    terminalStore.addOutput(`  CLI Home — Terminal Browser Home  v${__APP_VERSION__}`, "success");
    terminalStore.addOutput(t("messages.typeHelpForCommands"), "output");
    terminalStore.addOutput("", "output");
  };

  return {
    hints,
    executeCommand,
    handleTabComplete,
    showWelcome,
  };
}
