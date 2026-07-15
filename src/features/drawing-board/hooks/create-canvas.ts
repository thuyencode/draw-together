import { Canvas } from "fabric";
import { createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import type { Accessor } from "solid-js";
import type { CanvasOptions } from "fabric";

export function createCanvas(
  canvasElementRef: Accessor<HTMLCanvasElement | undefined>,
  options?: Partial<CanvasOptions>,
) {
  const [canvas, setCanvas] = createSignal<Canvas>();

  onMount(() => {
    const el = canvasElementRef();
    if (!el) return;

    const canvasInstance = isServer ? undefined : new Canvas(el, options);
    canvasInstance?.renderAll();
    setCanvas(canvasInstance);
  });

  onCleanup(() => {
    canvas()?.dispose();
    setCanvas(undefined);
  });

  return canvas;
}
