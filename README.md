<div align="center">
<pre style="color: #7aa2f7; font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.2; display: inline-block;">
    ██████╗ ██╗     ██╗    ██╗  ██╗ ██████╗ ███╗   ███╗███████╗
   ██╔════╝ ██║     ██║    ██║  ██║██╔═══██╗████╗ ████║██╔════╝
   ██║      ██║     ██║    ███████║██║   ██║██╔████╔██║█████╗
   ██║      ██║     ██║    ██╔══██║██║   ██║██║╚██╔╝██║██╔══╝
   ╚██████╗ ███████╗██║    ██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗
    ╚═════╝ ╚══════╝╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
</pre>
</div>

<div align="center">

**CLI Home — Terminal Browser Home**

A browser homepage that brings the classic terminal experience to your new tab.

[![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwind-css)](https://tailwindcss.com)

</div>

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Steps](#steps)
- [Usage](#usage)
  - [Commands](#commands)
  - [Tab Completion](#tab-completion)
  - [Keyboard Navigation](#keyboard-navigation)
- [Configuration](#configuration)
  - [Search Engines](#search-engines)
  - [AI Chat](#ai-chat)
  - [Shortcuts](#shortcuts)
- [Command Reference](#command-reference)
  - [search](#search)
  - [ai](#ai)
  - [shortcuts](#shortcuts-1)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Terminal Interface** — Full terminal emulation with command history, autocomplete, and typewriter output animation
- **Multiple Search Engines** — Support for Google, Bing, DuckDuckGo, and custom search engines
- **AI Chat Integration** — Direct access to AI chat services from the terminal
- **Shortcut Management** — Customizable shortcuts for quick navigation
- **Theme System** — CSS variable-based theming with cohesive dark color scheme
- **Persistent State** — All settings and data persist across sessions via localStorage
- **Tab Completion** — Press `Tab` to autocomplete commands and arguments
- **Command Hints** — Real-time command suggestions as you type

---

## Tech Stack

| Technology        | Purpose                                 |
| ----------------- | --------------------------------------- |
| Vue 3             | Frontend framework with Composition API |
| TypeScript        | Type-safe JavaScript                    |
| Pinia             | State management with persistence       |
| Vue Router        | Client-side routing                     |
| Vite              | Build tool and dev server               |
| TailwindCSS       | Utility-first CSS framework             |
| ESLint + Prettier | Code linting and formatting             |

---

## Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Steps

```bash
# Clone the repository
git clone <repository-url>
cd clihome

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## Usage

### Commands

Type commands directly into the terminal. Here are some examples:

| Command                     | Description                   |
| --------------------------- | ----------------------------- |
| `help`                      | Display available commands    |
| `search <query>`            | Search using default engine   |
| `search google <query>`     | Search using Google           |
| `search bing <query>`       | Search using Bing             |
| `search ddg <query>`        | Search using DuckDuckGo       |
| `search engines`            | List available search engines |
| `search default`            | Show current default engine   |
| `search default <name>`     | Set default search engine     |
| `search delete <name>`      | Delete a search engine        |
| `ai <message>`              | Send message to AI chat       |
| `ai set <url>`              | Set AI chat API endpoint      |
| `config`                    | Open configuration panel      |
| `clear`                     | Clear terminal output         |
| `goto <shortcut>`           | Navigate to shortcut URL      |
| `shortcuts`                 | List all shortcuts            |
| `shortcut add <name> <url>` | Add a new shortcut            |

### Tab Completion

Press `Tab` while typing a command to autocomplete. Press `Tab` again to cycle through suggestions.

### Keyboard Navigation

| Key        | Action                   |
| ---------- | ------------------------ |
| `Enter`    | Execute command          |
| `Tab`      | Autocomplete             |
| `↑` / `↓`  | Navigate command history |
| `Ctrl + L` | Clear terminal           |

---

## Configuration

### Search Engines

Configure search engines through the terminal:

```bash
# Add custom search engine
search add myengine https://myengine.com/search?q=%s

# Set as default
search default myengine

# Delete engine
search delete myengine
```

### AI Chat

Set up AI chat integration:

```bash
# Set API endpoint
ai set https://your-api.com/chat

# Test connection
ai Hello, world!
```

### Shortcuts

Manage navigation shortcuts:

```bash
# Add shortcut
shortcut add github https://github.com

# List shortcuts
shortcuts

# Navigate
goto github
```

---

## Command Reference

### search

```
search <query>              Search using default engine
search google <query>       Search using Google
search bing <query>         Search using Bing
search ddg <query>          Search using DuckDuckGo
search engines              List all engines
search default              Show default engine
search default <name>       Set default engine
search add <name> <url>     Add custom engine
search delete <name>        Delete an engine
```

### ai

```
ai <message>                Send message to AI
ai set <url>                Set API endpoint
ai clear                    Clear chat history
```

### shortcuts

```
shortcuts                   List all shortcuts
shortcut add <name> <url>   Add shortcut
shortcut delete <name>      Delete shortcut
goto <name>                 Navigate to shortcut URL
```

---

## Project Structure

```
clihome/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Layout/
│   │   │   └── TerminalShell.vue
│   │   └── Terminal/
│   │       ├── AppTerminal.vue
│   │       ├── OutputLine.vue
│   │       └── CommandInput.vue
│   ├── stores/
│   │   ├── terminal.ts
│   │   ├── search.ts
│   │   ├── ai.ts
│   │   └── shortcuts.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── commandParser.ts
│   ├── App.vue
│   ├── main.ts
│   ├── router.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── tailwind.config.js
└── README.md
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes linting and formatting before submitting.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
