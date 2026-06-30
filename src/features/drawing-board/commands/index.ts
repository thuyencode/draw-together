export interface Command {
  execute: () => void | Promise<void>;
  undo: () => void | Promise<void>;
}

export * from "./add-command";
export * from "./remove-command";
