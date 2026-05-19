<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import OutputLine from "./OutputLine.vue";
import CommandInput from "./CommandInput.vue";
import HintBox from "./HintBox.vue";
import type { HintItem } from "./HintBox.vue";
import { useTerminalStore } from "@/stores/terminal";
import { useSearchStore } from "@/stores/search";
import { useAIStore } from "@/stores/ai";
import { useShortcutsStore } from "@/stores/shortcuts";
import {
  parseCommand,
  parseSearchArgs,
  parseToArgs,
  parseAIArgs,
  parseConfigArgs,
} from "@/utils/commandParser";

const terminalStore = useTerminalStore();
const searchStore = useSearchStore();
const aiStore = useAIStore();
const shortcutsStore = useShortcutsStore();
const outputRef = ref<HTMLElement | null>(null);

const ALL_HINTS: HintItem[] = [
  { command: "help", desc: "显示此帮助" },
  { command: "clear", desc: "清空终端" },
  { command: "history", desc: "命令历史" },
  { command: "search <关键词>", desc: "默认引擎搜索" },
  { command: "search <引擎> <关键词>", desc: "指定引擎搜索" },
  { command: "search add <名称> <URL+{}>", desc: "添加搜索引擎" },
  { command: "search list", desc: "列出搜索引擎" },
  { command: "search default <引擎>", desc: "设置默认引擎" },
  { command: "search delete <引擎>", desc: "删除搜索引擎" },
  { command: "ai <问题>", desc: "发起 AI 对话" },
  { command: "ai config set <key> <value>", desc: "配置 AI 参数" },
  { command: "ai clear", desc: "清空对话历史" },
  { command: "to <指令名>", desc: "执行快捷指令" },
  { command: "to add <名称> <URL>", desc: "添加快捷指令" },
  { command: "to list", desc: "列出快捷指令" },
  { command: "to edit <名称> <URL>", desc: "修改快捷指令" },
  { command: "to delete <名称>", desc: "删除快捷指令" },
];

const hints = computed(() => {
  const input = terminalStore.currentInput;
  if (!input) return [];
  const lower = input.toLowerCase();
  return ALL_HINTS.filter(h => h.command.toLowerCase().startsWith(lower))
    .map(h => ({ item: h, matchLen: input.length }))
    .slice(0, 8);
});

const handleTabComplete = () => {
  const input = terminalStore.currentInput;
  if (!input) return;
  const lower = input.toLowerCase();
  const matches = ALL_HINTS.filter(h => h.command.toLowerCase().startsWith(lower));
  if (matches.length === 1) {
    terminalStore.currentInput = matches[0].command;
    return;
  }
  if (matches.length > 1) {
    const commonPrefix = findCommonPrefix(matches.map(m => m.command));
    if (commonPrefix.length > input.length) {
      terminalStore.currentInput = commonPrefix;
    }
  }
};

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

const scrollToBottom = () => {
  if (outputRef.value) outputRef.value.scrollTop = outputRef.value.scrollHeight;
};

watch(
  () => terminalStore.history.map(h => h.content).join(""),
  () => {
    if (outputRef.value) outputRef.value.scrollTop = outputRef.value.scrollHeight;
  },
);

const showHelp = () => {
  terminalStore.addOutput("", "output");
  terminalStore.addOutput("┌─────────────────────────────────────────────┐", "info");
  terminalStore.addOutput("│            CLI HOME 命令参考                  │", "info");
  terminalStore.addOutput("├─────────────────────────────────────────────┤", "info");
  terminalStore.addOutput("│  help            显示此帮助                  │", "info");
  terminalStore.addOutput("│  clear           清空终端                    │", "info");
  terminalStore.addOutput("│  history         命令历史                    │", "info");
  terminalStore.addOutput("│  search <关键词>              默认引擎搜索   │", "info");
  terminalStore.addOutput("│  search <引擎> <关键词>      指定引擎搜索   │", "info");
  terminalStore.addOutput("│  search add <名称> <URL+{}>     添加搜索引擎   │", "info");
  terminalStore.addOutput("│  search list                  列出搜索引擎   │", "info");
  terminalStore.addOutput("│  search default <引擎>       设置默认引擎   │", "info");
  terminalStore.addOutput("│  search delete <引擎>        删除搜索引擎   │", "info");
  terminalStore.addOutput("│  <直接输入内容>              默认引擎搜索   │", "info");
  terminalStore.addOutput("│  ai <问题>                    发起 AI 对话   │", "info");
  terminalStore.addOutput("│  ai config set <key> <val>   配置 AI 参数    │", "info");
  terminalStore.addOutput("│  to <指令名>                 执行快捷指令    │", "info");
  terminalStore.addOutput("│  to add <名称> <URL>         添加快捷指令    │", "info");
  terminalStore.addOutput("│  to list                     列出快捷指令    │", "info");
  terminalStore.addOutput("│  to delete <名称>            删除快捷指令    │", "info");
  terminalStore.addOutput("└─────────────────────────────────────────────┘", "info");
  terminalStore.addOutput("", "output");
};

const handleSearch = (args: string[]) => {
  const { action, query, engineName, engineUrl } = parseSearchArgs(searchStore.engines, args);
  switch (action) {
    case "search": {
      if (engineName) {
        terminalStore.addOutput(`🔍 搜索中 [${engineName}]: ${query || "(空)"}`, "info");
        searchStore.doSearch(query || "", engineName);
      } else {
        terminalStore.addOutput(`🔍 搜索中: ${query}`, "info");
        searchStore.doSearch(query);
      }
      break;
    }
    case "add": {
      if (!engineName || !engineUrl) {
        terminalStore.addOutput("用法: search add <引擎名> <URL模板>", "warning");
        terminalStore.addOutput("  URL 中使用 ${} / ${query} / {query} 表示搜索词", "output");
        return;
      }
      try {
        searchStore.addEngine({ name: engineName, url: engineUrl });
        terminalStore.addOutput(`✓ 已添加搜索引擎: ${engineName}`, "success");
      } catch (e) {
        terminalStore.addOutput(`✗ ${(e as Error).message}`, "error");
      }
      break;
    }
    case "list": {
      const engines = searchStore.engines;
      if (!engines.length) {
        terminalStore.addOutput("暂无搜索引擎", "warning");
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
        terminalStore.addOutput("用法: search default <引擎名>", "warning");
        return;
      }
      const engine = searchStore.engines.find(
        e => e.name.toLowerCase() === engineName.toLowerCase() || e.id === engineName.toLowerCase(),
      );
      if (!engine) {
        terminalStore.addOutput(`✗ 搜索引擎不存在: ${engineName}`, "error");
        return;
      }
      searchStore.setDefaultEngine(engine.id);
      terminalStore.addOutput(`✓ 默认搜索引擎已设置为: ${engine.name}`, "success");
      break;
    }
    case "delete": {
      if (!engineName) {
        terminalStore.addOutput("用法: search delete <引擎名>", "warning");
        return;
      }
      const engine = searchStore.engines.find(
        e => e.name.toLowerCase() === engineName.toLowerCase() || e.id === engineName.toLowerCase(),
      );
      if (!engine) {
        terminalStore.addOutput(`✗ 搜索引擎不存在: ${engineName}`, "error");
        return;
      }
      if (searchStore.engines.length <= 1) {
        terminalStore.addOutput("✗ 至少保留一个搜索引擎", "error");
        return;
      }
      searchStore.removeEngine(engine.id);
      terminalStore.addOutput(`✓ 已删除搜索引擎: ${engine.name}`, "success");
      break;
    }
  }
};

const handleTo = (args: string[]) => {
  const { action, name, url } = parseToArgs(args);
  switch (action) {
    case "list": {
      if (!shortcutsStore.shortcuts.length) {
        terminalStore.addOutput("暂无快捷指令", "warning");
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
        terminalStore.addOutput("用法: to add <名称> <URL>", "warning");
        return;
      }
      try {
        shortcutsStore.addShortcut(name, url);
        terminalStore.addOutput(`✓ 已添加: ${name}`, "success");
      } catch (e) {
        terminalStore.addOutput(`✗ ${(e as Error).message}`, "error");
      }
      break;
    }
    case "edit": {
      if (!name || !url) {
        terminalStore.addOutput("用法: to edit <名称> <URL>", "warning");
        return;
      }
      try {
        const sc = shortcutsStore.findShortcutByName(name);
        if (!sc) {
          terminalStore.addOutput(`✗ 指令不存在: ${name}`, "warning");
          return;
        }
        shortcutsStore.updateShortcut(sc.id, name, url);
        terminalStore.addOutput(`✓ 已更新: ${name}`, "success");
      } catch (e) {
        terminalStore.addOutput(`✗ ${(e as Error).message}`, "error");
      }
      break;
    }
    case "delete": {
      if (!name) {
        terminalStore.addOutput("用法: to delete <名称>", "warning");
        return;
      }
      try {
        const sc = shortcutsStore.findShortcutByName(name);
        if (!sc) {
          terminalStore.addOutput(`✗ 指令不存在: ${name}`, "warning");
          return;
        }
        shortcutsStore.deleteShortcut(sc.id);
        terminalStore.addOutput(`✓ 已删除: ${name}`, "success");
      } catch (e) {
        terminalStore.addOutput(`✗ ${(e as Error).message}`, "error");
      }
      break;
    }
    case "execute": {
      if (!name) {
        terminalStore.addOutput("用法: to <指令名>", "warning");
        return;
      }
      const ok = shortcutsStore.executeShortcut(name);
      if (ok) terminalStore.addOutput(`→ 打开: ${name}`, "info");
      else terminalStore.addOutput(`✗ 未找到: ${name}\n  输入 to list 查看所有指令`, "error");
      break;
    }
  }
};

const handleAI = (args: string[]) => {
  const { action, key, value, query } = parseAIArgs(args);
  switch (action) {
    case "config": {
      if (!key) {
        terminalStore.addOutput("用法: ai config set <key> <value>", "warning");
        return;
      }
      try {
        aiStore.updateConfig(key as keyof typeof aiStore.config, value);
        terminalStore.addOutput(
          `✓ AI 配置已更新: ${key} = ${key === "apiKey" ? "••••••" : value}`,
          "success",
        );
      } catch (e) {
        terminalStore.addOutput(`✗ ${(e as Error).message}`, "error");
      }
      break;
    }
    case "clear": {
      aiStore.clearMessages();
      terminalStore.addOutput("✓ AI 对话历史已清空", "success");
      break;
    }
    case "chat": {
      if (!query) {
        terminalStore.addOutput("请输入问题", "warning");
        return;
      }
      if (!aiStore.hasApiKey) {
        terminalStore.addOutput(
          "⚠ 请先配置 API 密钥:\n  ai config set apiKey <your_key>",
          "warning",
        );
        return;
      }
      terminalStore.addOutput("🤖 思考中...", "info");
      aiStore
        .sendMessageToAI(query)
        .then(res => terminalStore.addOutput(res, "output"))
        .catch(err => terminalStore.addOutput(`✗ ${err.message}`, "error"));
      break;
    }
  }
};

const handleConfig = (args: string[]) => {
  const { module, action, key, value } = parseConfigArgs(args);
  if (module === "search" && action === "set") {
    if (!key) {
      terminalStore.addOutput("用法: config search set <key> <value>", "warning");
      return;
    }
    if (key === "defaultEngine") {
      if (!value) {
        terminalStore.addOutput("请输入搜索引擎 ID", "warning");
        return;
      }
      searchStore.setDefaultEngine(value);
      terminalStore.addOutput(`✓ 默认搜索引擎: ${value}`, "success");
    } else {
      terminalStore.addOutput(`✗ 未知配置项: ${key}`, "error");
    }
  } else {
    terminalStore.addOutput("✗ 用法: config search set <key> <value>", "warning");
  }
};

const executeCommand = () => {
  const cmd = terminalStore.currentInput.trim();
  if (!cmd) return;
  terminalStore.executeCommand(cmd);
  scrollToBottom();
  const parsed = parseCommand(cmd);
  switch (parsed.type) {
    case "help":
      showHelp();
      break;
    case "clear":
      terminalStore.clearHistory();
      scrollToBottom();
      break;
    case "history": {
      const list = terminalStore.getCommandHistoryList();
      if (!list.length) terminalStore.addOutput("暂无命令历史", "warning");
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
    case "to":
      handleTo(parsed.args);
      break;
    case "config":
      handleConfig(parsed.args);
      break;
  }
};

const handleNavigate = (dir: "up" | "down") => terminalStore.navigateHistory(dir);
declare const __APP_VERSION__: string;
const showWelcome = () => {
  [
    "    ██████╗ ██╗     ██╗    ██╗  ██╗ ██████╗ ███╗   ███╗███████╗",
    "   ██╔════╝ ██║     ██║    ██║  ██║██╔═══██╗████╗ ████║██╔════╝",
    "   ██║      ██║     ██║    ███████║██║   ██║██╔████╔██║█████╗  ",
    "   ██║      ██║     ██║    ██╔══██║██║   ██║██║╚██╔╝██║██╔══╝  ",
    "   ╚██████╗ ███████╗██║    ██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗",
    "    ╚═════╝ ╚══════╝╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝",
  ].forEach(l => terminalStore.addOutput(l, "info"));
  terminalStore.addOutput("", "output");
  terminalStore.addOutput(`  CLI Home — Terminal Browser Home  v${__APP_VERSION__}`, "success");
  terminalStore.addOutput("  输入 help 查看可用命令", "output");
  terminalStore.addOutput("", "output");
};

onMounted(() => {
  if (terminalStore.history.length === 0) {
    showWelcome();
  }
});
</script>

<template>
  <div class="h-full w-full flex flex-col bg-(--bg-panel)">
    <div
      ref="outputRef"
      class="output-area flex-1 overflow-y-scroll overflow-x-hidden px-5 py-4 font-mono text-[13px] leading-relaxed space-y-0.5"
    >
      <OutputLine v-for="line in terminalStore.history" :key="line.id" :line="line" />
    </div>
    <HintBox :hints="hints" />
    <div class="px-5 py-3 border-t border-(--border-main) bg-(--bg-surface)">
      <CommandInput
        v-model="terminalStore.currentInput"
        @submit="executeCommand"
        @navigate="handleNavigate"
        @tab="handleTabComplete"
      />
    </div>
  </div>
</template>
