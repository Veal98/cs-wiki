import { Mermaid } from "mermaid";
import type { RevealOptions } from "reveal.js";
import type { CodeDemoOptions } from "./code-demo";

import "./declare";

export * from "./code-demo";
export * from "./locales";
export * from "./options";
export * from "./presentation";
export * from "./tasklist";

declare global {
  const CODE_DEMO_OPTIONS: CodeDemoOptions;
  const MARKDOWN_ENHANCE_ALIGN: boolean;
  const MARKDOWN_ENHANCE_CONTAINER: boolean;
  const MARKDOWN_ENHANCE_FOOTNOTE: boolean;
  const MARKDOWN_ENHANCE_TASKLIST: boolean;
  const MARKDOWN_ENHANCE_TEX: boolean;
  const MARKDOWN_ENHANCE_DELAY: number;
  const MERMAID_OPTIONS: Mermaid.mermaidAPI.Config;
  const REVEAL_CONFIG: Partial<RevealOptions>;
  const REVEAL_PLUGIN_HIGHLIGHT: boolean;
  const REVEAL_PLUGIN_MATH: boolean;
  const REVEAL_PLUGIN_NOTES: boolean;
  const REVEAL_PLUGIN_SEARCH: boolean;
  const REVEAL_PLUGIN_ZOOM: boolean;
}
