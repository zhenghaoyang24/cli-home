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
  parseChatArgs,
  parseConfigArgs,
} from "@/utils/commandParser";
import { setLocale } from "@/i18n";
import { useBgEffect, ALL_EFFECTS } from "./useBgEffect";
import { uid } from "@/utils/id";

export function useCommands() {
  const { t } = useI18n();
  const terminalStore = useTerminalStore();
  const searchStore = useSearchStore();
  const aiStore = useAIStore();
  const shortcutsStore = useShortcutsStore();
  const { setEffect } = useBgEffect();

  const hints = computed(() => {
    const input = terminalStore.currentInput;
    if (!input) return [];
    const lower = input.toLowerCase();
    const allHints: HintItem[] = [
      { command: "help", desc: t("terminal.help") },
      { command: "about", desc: t("terminal.about") },
      { command: "clear", desc: t("terminal.clear") },
      { command: "history", desc: t("terminal.history") },
      { command: "search <keyword>", desc: t("terminal.searchKeyword") },
      { command: "search <engine> <keyword>", desc: t("terminal.searchEngineKeyword") },
      { command: "search add <name> <URL+{}>", desc: t("terminal.searchAdd") },
      { command: "search list", desc: t("terminal.searchList") },
      { command: "search default <engine>", desc: t("terminal.searchDefault") },
      { command: "search delete <engine>", desc: t("terminal.searchDelete") },
      { command: "chat <question>", desc: t("terminal.chatQuestion") },
      { command: "chat set <key> <url> <model>", desc: t("terminal.chatConfig") },
      { command: "chat clear", desc: t("terminal.chatClear") },
      { command: "goto <name>", desc: t("terminal.gotoName") },
      { command: "goto add <name> <URL>", desc: t("terminal.gotoAdd") },
      { command: "goto list", desc: t("terminal.gotoList") },
      { command: "goto edit <name> <URL>", desc: t("terminal.gotoEdit") },
      { command: "goto delete <name>", desc: t("terminal.gotoDelete") },
      { command: "config language <en|cn>", desc: t("terminal.configLanguage") },
      { command: "config language list", desc: t("terminal.configLanguageList") },
      { command: "config bg <effect>", desc: t("terminal.configBg") },
      { command: "config bg list", desc: t("terminal.configBgList") },
      { command: "date", desc: t("terminal.date") },
      { command: "ping <url>", desc: t("terminal.ping") },
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
      ["about", t("terminal.about")],
      ["clear", t("terminal.clear")],
      ["history", t("terminal.history")],
      ["search <keyword>", t("terminal.searchKeyword")],
      ["search <engine> <keyword>", t("terminal.searchEngineKeyword")],
      ["search add <name> <URL>", t("terminal.searchAdd")],
      ["search list", t("terminal.searchList")],
      ["search default <engine>", t("terminal.searchDefault")],
      ["search delete <engine>", t("terminal.searchDelete")],
      ["<direct input>", t("terminal.directInput")],
      ["chat <question>", t("terminal.chatQuestion")],
      ["chat set <key> <url> <model>", t("terminal.chatConfig")],
      ["chat clear", t("terminal.chatClear")],
      ["goto <name>", t("terminal.gotoName")],
      ["goto add <name> <URL>", t("terminal.gotoAdd")],
      ["goto list", t("terminal.gotoList")],
      ["goto edit <name> <URL>", t("terminal.gotoEdit")],
      ["goto delete <name>", t("terminal.gotoDelete")],
      ["config language <en|cn>", t("terminal.configLanguage")],
      ["config language list", t("terminal.configLanguageList")],
      ["config bg <effect>", t("terminal.configBg")],
      ["config bg list", t("terminal.configBgList")],
      ["date", t("terminal.date")],
      ["ping <url>", t("terminal.ping")],
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

  function isValidUrl(str: string): boolean {
    const pattern = /^https?:\/\/[\w.-]+(\.[\w-]+)+(\/[\w.~/?%#&=+\-@!$'()*,:;]*)*$/i;
    return pattern.test(
      str.startsWith("http://") || str.startsWith("https://") ? str : `https://${str}`,
    );
  }

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
          terminalStore.addOutput(t("messages.searchAddTip", ["{}", "{query}"]), "output");
          return;
        }
        if (!isValidUrl(engineUrl)) {
          terminalStore.addOutput(t("messages.invalidUrl", { url: engineUrl }), "error");
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
        if (!isValidUrl(url)) {
          terminalStore.addOutput(t("messages.invalidUrl", { url }), "error");
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
        if (!isValidUrl(url)) {
          terminalStore.addOutput(t("messages.invalidUrl", { url }), "error");
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

  const handleChat = async (args: string[]) => {
    const { action, key, url, model, query } = parseChatArgs(args);
    switch (action) {
      case "config": {
        if (!key) {
          terminalStore.addOutput(t("messages.chatConfigUsage"), "warning");
          return;
        }
        aiStore.updateConfig("apiKey", key);
        aiStore.updateConfig("apiUrl", url);
        aiStore.updateConfig("model", model);
        terminalStore.addOutput(t("messages.chatConfigUpdated"), "success");
        break;
      }
      case "clear": {
        aiStore.clearMessages();
        terminalStore.addOutput(t("messages.chatHistoryCleared"), "success");
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
        terminalStore.flushOutput();
        terminalStore.addOutput(t("messages.thinking"), "info");
        terminalStore.flushOutput();
        const streamLineId = uid();
        terminalStore.history.push({
          id: streamLineId,
          content: "",
          timestamp: new Date(),
          type: "output" as const,
        });
        try {
          let fullContent = "";
          const idx = () => terminalStore.history.findIndex(l => l.id === streamLineId);
          await aiStore.sendMessageToAIStream(query, chunk => {
            fullContent += chunk;
            if (idx() !== -1) terminalStore.history[idx()].content = fullContent;
          });
          if (idx() !== -1) terminalStore.history[idx()].content = fullContent;
          const userMsg = aiStore.createUserMessage(query);
          const asstMsg = aiStore.createAssistantMessage(fullContent);
          aiStore.addMessage(userMsg);
          aiStore.addMessage(asstMsg);
        } catch (err) {
          const idx = terminalStore.history.findIndex(l => l.id === streamLineId);
          if (idx !== -1) terminalStore.history[idx].content = `✗ ${(err as Error).message}`;
        }
        break;
      }
    }
  };

  const handleDate = () => {
    const now = new Date();
    const str =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      " " +
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0") +
      ":" +
      String(now.getSeconds()).padStart(2, "0");
    terminalStore.addOutput(t("messages.dateTime", { datetime: str }), "success");
  };

  const handlePing = async (args: string[]) => {
    const target = args[0];
    if (!target) {
      terminalStore.addOutput(t("messages.pingUsage"), "warning");
      return;
    }
    const url =
      target.startsWith("http://") || target.startsWith("https://") ? target : `https://${target}`;
    if (!isValidUrl(url)) {
      terminalStore.addOutput(t("messages.invalidUrl", { url: target }), "error");
      return;
    }
    terminalStore.addOutput(t("messages.pinging", { target }), "info");
    terminalStore.flushOutput();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const start = performance.now();
    try {
      await fetch(url, { signal: controller.signal, mode: "no-cors" });
      const elapsed = (performance.now() - start).toFixed(0);
      terminalStore.addOutput(t("messages.pingSuccess", { target, time: elapsed }), "success");
    } catch {
      const elapsed = (performance.now() - start).toFixed(0);
      terminalStore.addOutput(t("messages.pingTimeout", { target, time: elapsed }), "error");
    } finally {
      clearTimeout(timeout);
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
    if (module === "bg") {
      if (action === "list") {
        terminalStore.addOutput(t("messages.bgEffectList"), "info");
        const listOrder = ["orb", "dither", "fater", "galaxy", "letter", "plasma", "soft"];
        listOrder.forEach((name, i) => {
          const desc = t(`messages.bgEffectDesc.${name}`);
          terminalStore.addOutput(
            `  ${String(i + 1).padStart(2)}  ${name.padEnd(8)} ${desc}`,
            "success",
          );
        });
        return;
      }
      if (action && ALL_EFFECTS.includes(action)) {
        setEffect(action);
        terminalStore.addOutput(t("messages.bgEffectSet", { effect: action }), "success");
      } else if (action) {
        terminalStore.addOutput(t("messages.bgEffectNotFound", { effect: action }), "error");
      } else {
        terminalStore.addOutput(t("messages.configBgUsage"), "warning");
      }
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
      case "about": {
        terminalStore.addOutput("", "output");
        terminalStore.addOutput(`  ${__APP_NAME__}  v${__APP_VERSION__}`, "success");
        terminalStore.addOutput(`  ${__APP_DESCRIPTION__}`, "output");
        terminalStore.addOutput("", "output");
        terminalStore.addOutput(`  Author:  ${__APP_AUTHOR__}`, "info");
        terminalStore.addOutput(`  License: ${__APP_LICENSE__}`, "info");
        terminalStore.addOutput(`  Repo:    ${__APP_REPOSITORY__}`, "info");
        terminalStore.addOutput("", "output");
        break;
      }
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
      case "chat":
        handleChat(parsed.args);
        break;
      case "goto":
        handleTo(parsed.args);
        break;
      case "config":
        handleConfig(parsed.args);
        break;
      case "date":
        handleDate();
        break;
      case "ping":
        handlePing(parsed.args);
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
