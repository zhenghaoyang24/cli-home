export interface Command {
  type: 'search' | 'ai' | 'to' | 'config' | 'help' | 'clear' | 'history' | 'unknown';
  args: string[];
  raw: string;
}

export interface OutputLine {
  id: string;
  type: 'input' | 'output' | 'success' | 'error' | 'warning' | 'info';
  content: string;
  timestamp: Date;
}

export interface SearchEngine {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

export interface SearchConfig {
  defaultEngine: string;
  engines: SearchEngine[];
}

export interface AIConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon?: string;
  createdAt: Date;
}

export interface TerminalHistoryItem {
  command: string;
  timestamp: Date;
}
