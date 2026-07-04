import { createSignal } from "solid-js";
import { AddCommand, RemoveCommand } from "../commands";
import { getTargetOfSelection } from "../utils";
import type { Command } from "../commands";
import type { Canvas } from "fabric";

export function useCanvasHistory(canvas: () => Canvas | undefined) {
  const [history, setHistory] = createSignal<Command[]>([]);
  const [undone, setUndone] = createSignal<Command[]>([]);

  const pushCommand = (command: Command) => {
    setHistory((prev) => [...prev, command]);
    setUndone([]);
  };

  const handleUndo = () => {
    const h = [...history()];
    const command = h.pop();

    if (command) {
      command.undo();
      setUndone((prev) => [...prev, command]);
      setHistory(h);
    }
  };

  const handleRedo = () => {
    const u = [...undone()];
    const command = u.pop();

    if (command) {
      command.execute();
      setUndone(u);
      setHistory((prev) => [...prev, command]);
    }
  };

  const handleReset = () => {
    canvas()?.clear();
    setHistory([]);
    setUndone([]);
  };

  const handleDelete = () => {
    const c = canvas();

    if (!c) return;

    const target = getTargetOfSelection(c);
    const command = new RemoveCommand(c, target);
    command.execute();

    pushCommand(command);
  };

  return {
    history,
    undone,
    pushCommand,
    handleUndo,
    handleRedo,
    handleReset,
    handleDelete,
  };
}
