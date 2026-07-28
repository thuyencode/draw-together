import { createSignal, onCleanup } from "solid-js";
import type { Canvas } from "fabric";
import type { Command } from "../commands";

export function createCanvasHistory(canvas: () => Canvas | undefined) {
  const [history, setHistory] = createSignal<Command[]>([]);
  const [undone, setUndone] = createSignal<Command[]>([]);

  const MAX_HISTORY = 50;

  const pushCommand = (command: Command) => {
    setHistory((prev) => [...prev, command].slice(-MAX_HISTORY));
    setUndone([]);
  };

  const handleUndo = () => {
    const h = [...history()];
    const command = h.pop();

    if (command) {
      command.undo();
      setUndone((prev) => [...prev, command].slice(-MAX_HISTORY));
      setHistory(h);
    }
  };

  const handleRedo = () => {
    const u = [...undone()];
    const command = u.pop();

    if (command) {
      command.execute();
      setUndone(u);
      setHistory((prev) => [...prev, command].slice(-MAX_HISTORY));
    }
  };

  const handleReset = () => {
    setHistory([]);
    setUndone([]);

    const c = canvas();

    if (c) {
      const { backgroundColor } = c;
      c.clear();
      c.set({ backgroundColor });
    }
  };

  onCleanup(handleReset);

  return {
    history,
    undone,
    pushCommand,
    handleUndo,
    handleRedo,
    handleReset,
  };
}
