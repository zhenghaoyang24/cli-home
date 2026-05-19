# CLI Home — Development Documentation

> CLI-style browser homepage built on Vue 3 · Terminal Emulator · Cyberpunk Dark Theme

---

## 1. Project Overview

CLI Home is a browser homepage leveraging a terminal emulator as its primary interaction interface. Users perform search, AI chat, and shortcut navigation through CLI commands. All data is persisted to `localStorage` via `pinia-plugin-persistedstate`.

---

## 2. Tech Stack

| Category         | Technology                          | Version         |
| ---------------- | ----------------------------------- | --------------- |
| Framework        | Vue                                 | ^3.4.21         |
| Language         | TypeScript                          | ^5.3.3          |
| Build Tool       | Vite                                | ^5.0.12         |
| State Management | Pinia + pinia-plugin-persistedstate | ^2.1.7 / ^4.2.0 |
| Styling          | TailwindCSS + CSS Variables         | ^3.4.1          |
| Icons            | Lucide Vue Next                     | ^0.31.0         |
| Package Manager  | pnpm                                | latest          |
| Linting          | ESLint 10 (flat config)             | ^10.4.0         |
| Formatting       | Prettier                            | 3.8.3           |

---

## 3. Project Structure

```
clihome/
├── .gitignore
├── .prettierrc
├── .prettierignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
├── src/
│   ├── main.ts                        # Entry point; registers Pinia + persistedstate plugin
│   ├── App.vue                        # Root component; terminal card layout + tab switching
│   ├── style.css                      # TailwindCSS directives + design tokens + base styles
│   ├── types/
│   │   └── index.ts                   # Global TypeScript type definitions
│   ├── utils/
│   │   └── commandParser.ts           # Command parser (dispatches input to actions)
│   ├── services/
│   │   ├── searchService.ts           # Pure search functions (URL builder, execution)
│   │   ├── aiService.ts               # Pure AI functions (send, stream, ID generation)
│   │   └── storageService.ts          # Legacy storage helpers (unused; kept for reference)
│   ├── stores/
│   │   ├── terminal.ts                # Output history, command history, input, typing engine
│   │   ├── search.ts                  # Search engine configuration
│   │   ├── ai.ts                      # AI config + chat messages
│   │   └── shortcuts.ts               # Shortcut management
│   └── components/
│       ├── Terminal/
│       │   ├── AppTerminal.vue        # Terminal main component (command dispatch, help, welcome)
│       │   ├── CommandInput.vue       # Command input (Tab / Enter / ↑↓ navigation)
│       │   ├── OutputLine.vue         # Single output line renderer (colored, typing indicator)
│       │   └── HintBox.vue            # Real-time command hint suggestions panel
│       ├── AI/
│       │   └── AIPanel.vue            # AI chat panel (streaming, bubbles)
│       ├── Config/
│       │   ├── ConfigPanel.vue        # Config shell (sidebar navigation)
│       │   ├── SearchConfig.vue       # Search engine settings
│       │   ├── AIConfig.vue           # AI parameter settings
│       │   └── ShortcutConfig.vue     # Shortcut CRUD management
│       ├── Layout/
│       │   └── TerminalShell.vue      # Terminal card shell (dots, title bar, body slot, footer)
│       └── Shortcuts/
│           └── ShortcutsList.vue      # Legacy shortcut list (unused; kept for reference)
```

---

## 4. Theme System — Design Tokens

All colors are defined as CSS custom properties in `:root` inside [`style.css`](src/style.css). Components reference them via Tailwind's arbitrary value syntax: `bg-[var(--bg-panel)]`, `text-[var(--accent)]`, etc.

### 4.1 Token Reference

| Token            | Value     | Usage                                             |
| ---------------- | --------- | ------------------------------------------------- |
| `--bg-page`      | `#050508` | Page background                                   |
| `--bg-panel`     | `#0c0c12` | Card / panel background                           |
| `--bg-surface`   | `#0f0f18` | Title bar / input area background                 |
| `--bg-hint`      | `#0a0a10` | Command hint panel background                     |
| `--bg-bubble`    | `#111118` | AI chat bubble (assistant side)                   |
| `--bg-active`    | `#1a1a30` | Active tab background                             |
| `--border-main`  | `#1c1c30` | Primary border color                              |
| `--text-body`    | `#f8f9ff` | Page-level base text                              |
| `--text-primary` | `#9aa5ce` | Panel body text                                   |
| `--text-input`   | `#a9b1d6` | Input field text                                  |
| `--text-label`   | `#4a527a` | Label / caption text                              |
| `--text-dim`     | `#565f89` | Inactive tab / icon color                         |
| `--text-dimmer`  | `#444b66` | Secondary dim text (URLs, empty states)           |
| `--text-hint`    | `#4a5070` | Command hint description                          |
| `--accent`       | `#7aa2f7` | Primary accent (active state, cursor, highlights) |
| `--success`      | `#9ece6a` | Success output                                    |
| `--error`        | `#f7768e` | Error output                                      |
| `--warning`      | `#e0af68` | Warning output                                    |

### 4.2 Visual Effects

| Class               | Effect                                                   |
| ------------------- | -------------------------------------------------------- |
| `body::before`      | CRT scanline overlay (repeating horizontal stripes)      |
| `.terminal-glow`    | Blue breathing glow-pulse animation on the terminal card |
| `.terminal-content` | Subtle CRT text flicker (10s cycle, 88–92% opacity)      |
| `.cursor-blink`     | Block cursor blink animation (1s cycle)                  |

---

## 5. Command System

### 5.1 Basic Commands

| Command   | Description     |
| --------- | --------------- |
| `help`    | Show help       |
| `clear`   | Clear terminal  |
| `history` | Command history |

### 5.2 Search Commands

| Command                            | Description                         | Example                                             |
| ---------------------------------- | ----------------------------------- | --------------------------------------------------- |
| `search <keyword>`                 | Search with default engine          | `search vue3`                                       |
| `search <engine> <keyword>`        | Search with a specific engine       | `search google vue3`                                |
| `search add <name> <URL template>` | Add a search engine                 | `search add GitHub https://github.com/search?q=${}` |
| `search list`                      | List all engines                    | —                                                   |
| `search default <engine>`          | Set the default engine              | `search default baidu`                              |
| `search delete <engine>`           | Remove an engine                    | `search delete bing`                                |
| `<unmatched input>`                | Falls back to default engine search | `vue3` → auto-search                                |

> URL placeholder formats supported: `${}`, `${query}`, `{query}`.

### 5.3 AI Commands

| Command                       | Description         | Example                      |
| ----------------------------- | ------------------- | ---------------------------- |
| `ai <question>`               | Start an AI chat    | `ai how to learn Vue3`       |
| `ai config set <key> <value>` | Configure AI params | `ai config set model gpt-4o` |
| `ai clear`                    | Clear chat history  | —                            |

> Config keys: `apiKey`, `apiUrl`, `model`, `temperature`, `maxTokens`.

### 5.4 Shortcut Commands (`to`)

| Command                | Description                   | Example                                |
| ---------------------- | ----------------------------- | -------------------------------------- |
| `to <name>`            | Execute a shortcut (open URL) | `to github`                            |
| `to add <name> <URL>`  | Add a shortcut                | `to add bilibili https://bilibili.com` |
| `to list`              | List all shortcuts            | —                                      |
| `to edit <name> <URL>` | Edit a shortcut               | —                                      |
| `to delete <name>`     | Delete a shortcut             | —                                      |

### 5.5 Interaction Features

- **Tab completion** — unique match completes fully; multiple matches complete common prefix
- **↑↓ history** — arrow keys scroll through previously executed commands
- **Real-time hints** — matching commands appear above the input line; typed portion is dim, remaining portion is bright
- **Typewriter animation** — output renders character-by-character from top to bottom like a vintage terminal

---

## 6. State Management

### 6.1 Persistence Strategy

Each store independently controls its persistence via the `persist` option:

| Store       | Strategy                                | What is saved                                    |
| ----------- | --------------------------------------- | ------------------------------------------------ |
| `search`    | `persist: true`                         | Full search engine configuration                 |
| `shortcuts` | `persist: true`                         | Full shortcuts list                              |
| `ai`        | `persist: { pick: ['config'] }`         | Only API config; chat messages are ephemeral     |
| `terminal`  | `persist: { pick: ['commandHistory'] }` | Only command history; output lines are ephemeral |

### 6.2 Search Store ([`src/stores/search.ts`](src/stores/search.ts))

```typescript
interface SearchConfig {
  defaultEngine: string;
  engines: SearchEngine[];
}

// Defaults: Bing, Google, Baidu
// Actions: setDefaultEngine, addEngine, removeEngine, findEngine, doSearch
```

### 6.3 AI Store ([`src/stores/ai.ts`](src/stores/ai.ts))

```typescript
interface AIConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

// Actions: updateConfig, addMessage, clearMessages, sendMessageToAI, sendMessageToAIStream
```

### 6.4 Shortcuts Store ([`src/stores/shortcuts.ts`](src/stores/shortcuts.ts))

```typescript
// Default shortcuts: bilibili, github, baidu, google
// Actions: addShortcut, updateShortcut, deleteShortcut, findShortcutByName, executeShortcut
```

### 6.5 Terminal Store ([`src/stores/terminal.ts`](src/stores/terminal.ts))

```typescript
// State: history (output lines with typing flag), currentInput, commandHistory, historyIndex
// Actions: addOutput (queues typing), addInput, executeCommand, clearHistory, navigateHistory
// Typing engine: TYPE_SPEED=1ms, TYPE_BATCH=10 chars, LINE_PAUSE=40ms between lines
```

---

## 7. Service Layer

All services are pure functions — they hold no state and never read/write localStorage directly.

### 7.1 searchService.ts

| Function                                               | Purpose                            |
| ------------------------------------------------------ | ---------------------------------- |
| `DEFAULT_SEARCH_CONFIG`                                | Default configuration constant     |
| `buildSearchUrl(engines, defaultId, engineId?, query)` | Build a search URL                 |
| `findEngineByName(engines, name)`                      | Locate an engine by name or ID     |
| `executeSearch(engines, defaultId, query, engineId?)`  | Open a new tab with the search URL |

### 7.2 aiService.ts

| Function                                       | Purpose                        |
| ---------------------------------------------- | ------------------------------ |
| `DEFAULT_AI_CONFIG`                            | Default configuration constant |
| `sendMessage(config, message)`                 | Non-streaming request          |
| `sendMessageStream(config, message, callback)` | SSE streaming request          |
| `generateMessageId()`                          | Generate a unique message ID   |

---

## 8. Typewriter Animation Engine

Located in [`terminal.ts`](src/stores/terminal.ts). Output is queued and rendered character-by-character:

| Constant     | Value | Effect                             |
| ------------ | ----- | ---------------------------------- |
| `TYPE_SPEED` | 1ms   | Interval between character batches |
| `TYPE_BATCH` | 10    | Characters revealed per tick       |
| `LINE_PAUSE` | 40ms  | Pause after a line completes       |

**Flow**: `addOutput(content, type)` → pushed to `typeQueue` → engine ticks through each line, expanding a reactive line's `content` field batch-by-batch. While typing, a blinking colored block cursor is shown at the line end via the `_typing` flag.

**Auto-scroll**: A `watch` on `history.map(h => h.content).join("")` in `AppTerminal.vue` fires on every content change, immediately setting the output container's `scrollTop = scrollHeight`.

---

## 9. Code Standards

### 9.1 ESLint (Flat Config)

```js
// eslint.config.js
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  { ignores: ["**/dist/**", "**/node_modules/**", "**/vendor/**"] },
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["error", { allow: ["error"] }],
    },
  },
  eslintConfigPrettier,
]);
```

### 9.2 Prettier

```jsonc
// .prettierrc
{
  "semi": true,
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid",
}
```

### 9.3 npm Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{vue,ts,tsx,js,jsx,css,json}\""
  }
}
```

---

## 10. Deployment

```bash
pnpm install
pnpm build          # Outputs to dist/
pnpm preview        # Preview the production build locally
```

Deploy the `dist/` directory to any static HTTP server (Vercel, Netlify, GitHub Pages, Nginx). No backend required.

---

## 11. Security

- API keys are stored only in the browser's `localStorage`, never transmitted elsewhere
- `apiKey` input uses `type="password"` for masked entry
- AI conversation history is not persisted; clearing the page clears all messages
- Shortcut URLs use `window.open` with no `eval` — JavaScript protocol links are naturally blocked by this approach
- Command parsing uses case-insensitive string matching only; no dynamic code execution
