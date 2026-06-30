import { createElementSize } from "@solid-primitives/resize-observer";
import { throttle } from "@solid-primitives/scheduled";
import { Canvas } from "fabric";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { Accessor } from "solid-js";
import type { CanvasOptions } from "fabric";

export function createCanvas(
  canvasElementRef: Accessor<HTMLCanvasElement | undefined>,
  containerRef: Accessor<HTMLElement | undefined>,
  options?: Partial<CanvasOptions>,
) {
  const [canvas, setCanvas] = createSignal<Canvas>();
  const size = createElementSize(containerRef);

  onMount(() => {
    const el = canvasElementRef();
    if (!el) return;

    const canvasInstance = new Canvas(el, options);
    setCanvas(canvasInstance);
  });

  onCleanup(() => {
    canvas()?.dispose();
    setCanvas(undefined);
  });

  const onResize = throttle(
    (canvasInstance: Canvas, width: number, height: number) =>
      canvasInstance.setDimensions({ width, height }),
    100,
  );

  createEffect(() => {
    const currentCanvas = canvas();
    if (!currentCanvas) return;

    onResize(currentCanvas, size.width ?? 100, size.height ?? 100);
  });

  return canvas;
}
