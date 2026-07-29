import type { ShortcutEntry, ShortcutId, StrokeConfig } from "./types";

export const DEFAULT_COLORS: StrokeConfig["colors"] = [
  "rgba(1, 0, 0, 1)",
  "rgba(255, 255, 255, 1)",
];
export const DEFAULT_FONT_SIZE = 24;
export const ZOOM_MAX = 3;

export const SHORTCUTS = new Map<ShortcutId, ShortcutEntry>([
  [
    "delete-object",
    {
      hotkey: "Delete",
      description: "Delete selected object(s)",
      category: "Tools",
    },
  ],
  [
    "edit-text",
    { hotkey: "Enter", description: "Edit selected text", category: "Tools" },
  ],
  [
    "swap-colors",
    {
      hotkey: "Shift+X",
      description: "Swap primary/secondary colors",
      category: "Tools",
    },
  ],
  [
    "select-all",
    { hotkey: "Mod+A", description: "Select all objects", category: "Tools" },
  ],
  ["undo", { hotkey: "Mod+Z", description: "Undo", category: "History" }],
  ["redo", { hotkey: "Mod+Shift+Z", description: "Redo", category: "History" }],
  [
    "reset",
    { hotkey: "Mod+Delete", description: "Reset canvas", category: "History" },
  ],
  [
    "zoom-to-100",
    { hotkey: "Mod+0", description: "Reset zoom to 100%", category: "View" },
  ],
  [
    "fit-to-view",
    { hotkey: "Mod+1", description: "Fit canvas to view", category: "View" },
  ],
  [
    "show-shortcuts",
    {
      hotkey: "H",
      description: "Toggle keyboard shortcuts modal",
      category: "View",
    },
  ],
  [
    "export",
    { hotkey: "Mod+S", description: "Export as PNG", category: "Export" },
  ],
]);
