import { createSignal } from "solid-js";
import type { Canvas } from "fabric";
import type { Command } from "../commands";

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

  return {
    history,
    undone,
    pushCommand,
    handleUndo,
    handleRedo,
    handleReset,
  };
}
