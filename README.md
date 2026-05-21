<div align="center">
<img width="734" alt="CLI Home" src="https://github.com/user-attachments/assets/2547eee0-57f0-4a3f-bca0-4fb24c167d11" />
</div>

<div align="center">

# CLI Home

**A browser homepage that brings the classic terminal experience to your new tab.**

[![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-06B6D4?logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## Overview

CLI Home transforms your browser's new tab page into a full-featured terminal interface. Instead of a static grid of bookmarks, you get a command-driven environment where every action happens through typed commands — just like the terminal you already know.

Review link: [https://cli-home.netlify.app/](https://cli-home.netlify.app/)

## Features

### Terminal Commands

- **`help`** — Display the full command reference
- **`clear`** — Clear the terminal output
- **`history`** — Browse previously executed commands
- **Tab completion** — Auto-complete commands and paths
- **Command history navigation** — Use arrow keys to recall past commands

### Search

- Search the web directly from the command line using `search <keyword>`
- Add and manage custom search engines with custom URL templates
- Set a default search engine for quick queries
- Supports engines like Google, Bing, DuckDuckGo, Baidu, and any custom endpoint

### Shortcuts (goto)

- Create named shortcuts for your favorite URLs with `goto add <name> <url>`
- Open shortcuts instantly with `goto <name>`
- List, edit, and delete shortcuts through terminal commands or the config panel
- Visual grid display in the Shortcuts tab

### AI Chat

- Built-in AI chat panel powered by configurable API endpoints
- Supports **DeepSeek**, **OpenAI**, **Anthropic (Claude)**, and **Google AI (Gemini)**
- Streaming responses with real-time token display
- Markdown rendering for formatted AI output
- Chat message history with clear functionality

### Multi-language Support

- English and Chinese (中文) interface
- Switch languages with `config language en` or `config language cn`
- Language preference is persisted across sessions

### Config Panel

- Visual configuration interface organized into three sections:
  - **Search** — Manage search engines and default engine
  - **Chat** — Configure AI provider, API key, endpoint URL, and model
  - **Shortcuts** — Add, edit, and delete URL shortcuts

## Technology Stack

| Layer                | Technology                            |
| -------------------- | ------------------------------------- |
| Framework            | Vue 3 (Composition API)               |
| Language             | TypeScript                            |
| Build Tool           | Vite 5                                |
| Styling              | TailwindCSS 4 + CSS Custom Properties |
| State Management     | Pinia with persisted state            |
| Internationalization | vue-i18n                              |
| AI Streaming         | Fetch API with ReadableStream         |
| Markdown Rendering   | marked                                |

## Requirements

- **Node.js** >= 18
- **pnpm** >= 8 (recommended) or npm / yarn

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cli-home.git

# Navigate to the project directory
cd cli-home

# Install dependencies
npm install
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
