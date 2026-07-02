export interface Command {
  undo: () => void | Promise<void>;
  execute: () => void | Promise<void>;
}

export * from "./add-command";
export * from "./modify-command";
export * from "./remove-command";

