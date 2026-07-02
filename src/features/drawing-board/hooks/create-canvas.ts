import { createElementSize } from "@solid-primitives/resize-observer";
import { throttle } from "@solid-primitives/scheduled";
import { Canvas } from "fabric";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";
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

    const canvasInstance = isServer ? undefined : new Canvas(el, options);
    setCanvas(canvasInstance);
  });

  const onResize = throttle(
    (canvasInstance: Canvas, width: number, height: number) =>
      canvasInstance.setDimensions({ width, height }),
    100,
  );

  onCleanup(() => {
    canvas()?.dispose();
    setCanvas(undefined);
    onResize.clear();
  });

  createEffect(() => {
    const currentCanvas = canvas();
    if (!currentCanvas) return;

    onResize(currentCanvas, size.width ?? 100, size.height ?? 100);
  });

  return canvas;
}
