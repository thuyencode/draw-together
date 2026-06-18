import { createElementSize } from "@solid-primitives/resize-observer";
import Konva from "konva";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { FreeformInput } from "./freeform-input";
import { ShapeInput } from "./shape-input";
import { StraightLineInput } from "./straight-line-input";
import type {
  DrawingElements,
  DrawingSettings,
  PropsWithDispatch,
} from "./types";

export type DrawingCanvasProps = PropsWithDispatch<{
  settings: DrawingSettings;
  elements: DrawingElements;
}>;

export default function DrawingCanvas(props: DrawingCanvasProps) {
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
  const size = createElementSize(containerRef);
  const [layer, setLayer] = createSignal<Konva.Layer>();
  const [stage, setStage] = createSignal<Konva.Stage>();

  onMount(() => {
    const ref = containerRef();
    if (!ref) return;

    const s = new Konva.Stage({
      width: size.width ?? undefined,
      height: size.height ?? undefined,
      container: ref,
    });

    const konvaLayer = new Konva.Layer();
    s.add(konvaLayer);

    setLayer(konvaLayer);
    setStage(s);
  });

  createEffect(() => {
    const s = stage();
    if (!s) return;

    s.setAttrs({
      width: size.width ?? undefined,
      height: size.height ?? undefined,
    });
  });

  onCleanup(() => {
    stage()?.destroy();
  });

  return (
    <div class="relative h-full">
      <div ref={setContainerRef} class="absolute inset-0" />
      <FreeformInput
        layer={layer()}
        settings={props.settings}
        elements={props.elements}
        dispatch={props.dispatch}
      />
      <ShapeInput
        layer={layer()}
        settings={props.settings}
        elements={props.elements}
        dispatch={props.dispatch}
      />
      <StraightLineInput
        layer={layer()}
        settings={props.settings}
        elements={props.elements}
        dispatch={props.dispatch}
      />
    </div>
  );
}
