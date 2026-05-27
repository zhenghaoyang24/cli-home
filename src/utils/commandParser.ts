import type { Command, SearchEngine } from "@/types";
import { findEngineByName } from "@/services/searchService";

export function parseCommand(input: string): Command {
  const trimmed = input.trim();
  if (!trimmed) {
    return { type: "unknown", args: [], raw: input };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case "help":
      return { type: "help", args, raw: input };
    case "about":
      return { type: "about", args, raw: input };
    case "clear":
      return { type: "clear", args, raw: input };
    case "history":
      return { type: "history", args, raw: input };
    case "search":
      return { type: "search", args, raw: input };
    case "chat":
      return { type: "chat", args, raw: input };
    case "calc":
      return { type: "calc", args, raw: input };
    case "goto":
      return { type: "goto", args, raw: input };
    case "config":
      return { type: "config", args, raw: input };
    case "date":
      return { type: "date", args, raw: input };
    case "ping":
      return { type: "ping", args, raw: input };
    case "sysinfo":
      return { type: "sysinfo", args, raw: input };
    default:
      return { type: "search", args: [command, ...args], raw: input };
  }
}

export function parseSearchArgs(
  engines: SearchEngine[],
  args: string[],
): {
  action: string;
  query: string;
  engineName?: string;
  engineUrl?: string;
} {
  if (args.length === 0) {
    return { action: "search", query: "" };
  }

  const sub = args[0];

  switch (sub) {
    case "add":
      return {
        action: "add",
        query: "",
        engineName: args[1],
        engineUrl: args.slice(2).join(" "),
      };
    case "list":
      return { action: "list", query: "" };
    case "default":
      return { action: "default", query: "", engineName: args[1] };
    case "delete":
    case "remove":
      return { action: "delete", query: "", engineName: args[1] };
  }

  const maybeEngine = findEngineByName(engines, sub);
  if (maybeEngine) {
    return {
      action: "search",
      query: args.slice(1).join(" "),
      engineName: maybeEngine.id,
    };
  }

  return { action: "search", query: args.join(" ") };
}

export function parseToArgs(args: string[]): {
  action: string;
  name?: string;
  url?: string;
} {
  if (args.length === 0) {
    return { action: "execute", name: "" };
  }

  const subcommand = args[0];

  switch (subcommand) {
    case "list":
      return { action: "list" };
    case "add":
      if (args.length >= 3) {
        return { action: "add", name: args[1], url: args.slice(2).join(" ") };
      }
      return { action: "add" };
    case "edit":
      if (args.length >= 3) {
        return { action: "edit", name: args[1], url: args.slice(2).join(" ") };
      }
      return { action: "edit" };
    case "delete":
    case "remove":
      return { action: "delete", name: args[1] };
    default:
      return { action: "execute", name: args[0] };
  }
}

export function parseChatArgs(args: string[]): {
  action: "chat" | "config" | "clear";
  key?: string;
  url?: string;
  model?: string;
  query: string;
} {
  if (args.length === 0) {
    return { action: "chat", query: "" };
  }

  if (args[0] === "set" && args.length >= 4) {
    return {
      action: "config",
      key: args[1],
      url: args[2],
      model: args[3],
      query: "",
    };
  }

  if (args[0] === "clear") {
    return { action: "clear", query: "" };
  }

  return { action: "chat", query: args.join(" ") };
}

export function parseConfigArgs(args: string[]): {
  module: string;
  action: string | undefined;
  key?: string;
  value?: string;
} {
  if (args.length === 0) {
    return { module: "", action: "" };
  }

  if (args[0] === "language") {
    if (args.length === 1) {
      return { module: "language", action: "" };
    }
    if (args[1] === "list") {
      return { module: "language", action: "list" };
    }
    return { module: "language", action: "set", value: args[1] };
  }

  if (args[0] === "set") {
    return {
      module: "set",
      action: undefined,
      key: args[1],
      value: args.slice(2).join(" "),
    };
  }

  return {
    module: args[0],
    action: args[1],
    key: args[2],
    value: args.slice(3).join(" "),
  };
}
