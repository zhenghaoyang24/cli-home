import { defineStore } from "pinia";
import { ref } from "vue";
import type { OutputLine, TerminalHistoryItem } from "@/types";

const TYPE_SPEED = 10; // 每“批”字符之间的间隔时间
const TYPE_BATCH = 30; // 每“批”字符的数量
const LINE_PAUSE = 10; // 每个输出行之间的暂停时间

let typeTimer: ReturnType<typeof setTimeout> | null = null;

const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useTerminalStore = defineStore(
  "terminal",
  () => {
    const history = ref<OutputLine[]>([]);
    const currentInput = ref("");
    const commandHistory = ref<TerminalHistoryItem[]>([]);
    const historyIndex = ref(-1);
    const typeQueue = ref<Array<{ content: string; type: OutputLine["type"] }>>([]);

    const startTyping = () => {
      if (typeTimer) return;
      tick();
    };

    const tick = () => {
      if (!typeQueue.value.length) {
        typeTimer = null;
        return;
      }

      const item = typeQueue.value[0];
      const last = history.value[history.value.length - 1];
      let line: OutputLine;

      if (last && last._typing) {
        line = last;
      } else {
        line = {
          id: uid(),
          type: item.type,
          content: "",
          timestamp: new Date(),
          _typing: true,
        };
        history.value.push(line);
      }

      const pos = line.content.length;
      const nextPos = Math.min(pos + TYPE_BATCH, item.content.length);
      line.content = item.content.slice(0, nextPos);

      if (nextPos >= item.content.length) {
        line._typing = false;
        typeQueue.value.shift();
        typeTimer = setTimeout(tick, LINE_PAUSE);
      } else {
        typeTimer = setTimeout(tick, TYPE_SPEED);
      }
    };

    const addOutput = (content: string, type: OutputLine["type"] = "output") => {
      typeQueue.value.push({ content, type });
      startTyping();
    };

    const flushOutput = () => {
      while (typeQueue.value.length) {
        const item = typeQueue.value.shift()!;
        history.value.push({
          id: uid(),
          type: item.type,
          content: item.content,
          timestamp: new Date(),
        });
      }
      if (typeTimer) {
        clearTimeout(typeTimer);
        typeTimer = null;
      }
    };

    const addInput = (content: string) => {
      history.value.push({
        id: uid(),
        type: "input",
        content: `> ${content}`,
        timestamp: new Date(),
      });

      if (content.trim()) {
        const existing = commandHistory.value.findIndex(h => h.command === content);
        if (existing !== -1) commandHistory.value.splice(existing, 1);
        commandHistory.value.unshift({ command: content, timestamp: new Date() });
        if (commandHistory.value.length > 100) commandHistory.value.pop();
      }
    };

    const executeCommand = (command: string) => {
      addInput(command);
      currentInput.value = "";
      historyIndex.value = -1;
    };

    const clearHistory = () => {
      typeQueue.value = [];
      if (typeTimer) {
        clearTimeout(typeTimer);
        typeTimer = null;
      }
      history.value = [];
    };

    const navigateHistory = (direction: "up" | "down") => {
      if (!commandHistory.value.length) return;
      if (direction === "up") {
        if (historyIndex.value < commandHistory.value.length - 1) {
          historyIndex.value++;
          currentInput.value = commandHistory.value[historyIndex.value].command;
        }
      } else {
        if (historyIndex.value > 0) {
          historyIndex.value--;
          currentInput.value = commandHistory.value[historyIndex.value].command;
        } else {
          historyIndex.value = -1;
          currentInput.value = "";
        }
      }
    };

    const getCommandHistoryList = () => {
      return commandHistory.value.map((h, idx) => ({
        index: commandHistory.value.length - idx,
        ...h,
      }));
    };

    return {
      history,
      currentInput,
      commandHistory,
      historyIndex,
      addOutput,
      addInput,
      executeCommand,
      clearHistory,
      navigateHistory,
      getCommandHistoryList,
      flushOutput,
    };
  },
  {
    persist: {
      pick: ["commandHistory"],
    },
  },
);
