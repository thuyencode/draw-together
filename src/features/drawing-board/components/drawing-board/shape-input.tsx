import type Konva from "konva";
import { createEffect, For, onCleanup, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { useStage } from "solid-konva";
import type { DrawingCanvasProps } from "./drawing-canvas";
import { ShapeNode } from "./drawing-canvas";
import type { Point, Shape, ShapeInfo } from "./types";
import { normalizeBbox } from "./utils";

interface Drag {
  anchor: Point | null;
  livePointer: Point | null;
}

export function ShapeInput(props: DrawingCanvasProps) {
  const [shapes, setShapes] = createStore<ShapeInfo[]>([]);
  const [drag, setDrag] = createStore<Drag>({
    anchor: null,
    livePointer: null,
  });

  const stage = useStage();

  createEffect(() => {
    const currentStage = stage?.stage();
    if (!currentStage) return;

    const tool = props.drawingState.tool;
    const isShapeTool =
      tool === "circle" || tool === "rectangle" || tool === "ellipse";
    if (!isShapeTool) return;

    const onMouseDown = () => {
      props.dispatch({ type: "set_is_painting", isPainting: true });

      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      setDrag({
        anchor: { x: pos.x, y: pos.y },
        livePointer: { x: pos.x, y: pos.y },
      });
    };

    const onMouseUp = () => {
      const a = drag.anchor;
      const cur = drag.livePointer;
      if (a && cur) {
        const bbox = normalizeBbox(a, cur);

        if (bbox.width > 1 || bbox.height > 1) {
          setShapes((prev) => [
            ...prev,
            {
              tool: tool as Shape,
              ...bbox,
              strokeWidth: props.drawingState.strokeWidth,
              color: props.drawingState.color,
            },
          ]);
        }
      }

      setDrag({ anchor: null, livePointer: null });
      props.dispatch({ type: "set_is_painting", isPainting: false });
    };

    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      setDrag("livePointer", { x: pos.x, y: pos.y });

      if (!props.drawingState.isPainting) return;
      e.evt.preventDefault();
    };

    currentStage
      .on("mousedown touchstart", onMouseDown)
      .on("mousemove touchmove", onMouseMove)
      .on("mouseup touchend", onMouseUp);

    onCleanup(() => {
      currentStage
        .off("mousedown touchstart", onMouseDown)
        .off("mousemove touchmove", onMouseMove)
        .off("mouseup touchend", onMouseUp);
    });
  });

  const preview = (): ShapeInfo | null => {
    const a = drag.anchor;
    const cur = drag.livePointer;
    if (!a || !cur) return null;

    const bbox = normalizeBbox(a, cur);
    if (bbox.width < 1 && bbox.height < 1) return null;

    return {
      tool: props.drawingState.tool as Shape,
      ...bbox,
      strokeWidth: props.drawingState.strokeWidth,
      color: props.drawingState.color,
    };
  };

  return (
    <>
      <For each={shapes}>{(s) => <ShapeNode info={s} />}</For>
      <Show when={preview()}>{(p) => <ShapeNode info={p()} isPreview />}</Show>
    </>
  );
}
