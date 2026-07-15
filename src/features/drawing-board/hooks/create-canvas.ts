import { Canvas, FabricObject } from "fabric";
import { createSignal, onCleanup, onMount } from "solid-js";
import type { CanvasOptions } from "fabric";
import type { Accessor } from "solid-js";

export function createCanvas(
  canvasElementRef: Accessor<HTMLCanvasElement | undefined>,
  options?: Accessor<Partial<CanvasOptions | undefined>>,
) {
  const [canvas, setCanvas] = createSignal<Canvas>();

  onMount(() => {
    const el = canvasElementRef();
    if (!el) return;

    FabricObject.customProperties = ["objectId", "erasable"];

    const opts = options?.();
    const canvasInstance = new Canvas(el, opts);

    canvasInstance.renderAll();
    setCanvas(canvasInstance);
  });

  onCleanup(() => {
    canvas()?.dispose();
    setCanvas(undefined);
  });

  return canvas;
}
