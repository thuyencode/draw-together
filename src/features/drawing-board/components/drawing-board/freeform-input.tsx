import type Konva from "konva";
import { createEffect, For, onCleanup } from "solid-js";
import { Line, useStage } from "solid-konva";
import type { DrawingCanvasProps } from "./drawing-canvas";

export function FreeformInput(props: DrawingCanvasProps) {
  const stage = useStage();

  createEffect(() => {
    const currentStage = stage?.stage();
    if (!currentStage) return;

    const tool = props.settings.tool;
    if (tool !== "brush" && tool !== "eraser") return;

    const onMouseDown = () => {
      props.dispatch({ type: "set_is_painting", isPainting: true });

      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      props.dispatch({
        type: "add_freeform_line",
        line: {
          tool,
          points: [pos.x, pos.y, pos.x, pos.y],
          strokeWidth: props.settings.strokeWidth,
          color: props.settings.color,
        },
      });
    };

    const onMouseUp = () => {
      props.dispatch({ type: "set_is_painting", isPainting: false });
    };

    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!props.settings.isPainting) return;
      e.evt.preventDefault();

      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      props.dispatch({
        type: "append_freeform_point",
        point: [pos.x, pos.y],
      });
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

  return (
    <For each={props.elements.freeformLines}>
      {(line) => (
        <Line
          points={line.points}
          stroke={line.color}
          strokeWidth={line.strokeWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={
            line.tool === "eraser" ? "destination-out" : "source-over"
          }
        />
      )}
    </For>
  );
}
