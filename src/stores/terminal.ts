import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { OutputLine, TerminalHistoryItem } from '@/types';
import { saveCommandHistory, loadCommandHistory } from '@/services/storageService';

export const useTerminalStore = defineStore('terminal', () => {
  const history = ref<OutputLine[]>([]);
  const currentInput = ref('');
  const commandHistory = ref<TerminalHistoryItem[]>([]);
  const historyIndex = ref(-1);

  const loadCommandHistoryFromStorage = () => {
    commandHistory.value = loadCommandHistory<TerminalHistoryItem[]>([]);
  };

  const saveCommandHistoryToStorage = () => {
    saveCommandHistory(commandHistory.value);
  };

  const addOutput = (content: string, type: OutputLine['type'] = 'output') => {
    history.value.push({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      type,
      content,
      timestamp: new Date(),
    });
  };

  const addInput = (content: string) => {
    history.value.push({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      type: 'input',
      content: `> ${content}`,
      timestamp: new Date(),
    });

    if (content.trim()) {
      const existingIndex = commandHistory.value.findIndex(h => h.command === content);
      if (existingIndex !== -1) {
        commandHistory.value.splice(existingIndex, 1);
      }
      commandHistory.value.unshift({ command: content, timestamp: new Date() });
      if (commandHistory.value.length > 100) {
        commandHistory.value.pop();
      }
      saveCommandHistoryToStorage();
    }
  };

  const executeCommand = (command: string) => {
    addInput(command);
    currentInput.value = '';
    historyIndex.value = -1;
  };

  const clearHistory = () => {
    history.value = [];
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (commandHistory.value.length === 0) return;

    if (direction === 'up') {
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
        currentInput.value = '';
      }
    }
  };

  const getCommandHistoryList = () => {
    return commandHistory.value.map((h, index) => ({
      index: commandHistory.value.length - index,
      ...h
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
    loadCommandHistoryFromStorage,
    getCommandHistoryList,
  };
});
