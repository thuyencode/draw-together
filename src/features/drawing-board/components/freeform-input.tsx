import { For, createEffect, onCleanup } from "solid-js";
import { KonvaLine } from "./shapes";
import { rgbaToString } from "./utils";
import type Konva from "konva";
import type { DrawingCanvasProps } from "./drawing-canvas";
import type { PropsWithLayer } from "./types";

type FreeformInputProps = DrawingCanvasProps & PropsWithLayer;

export function FreeformInput(props: FreeformInputProps) {
  createEffect(() => {
    const currentLayer = props.layer;
    if (!currentLayer) return;

    const stage = currentLayer.getStage();

    const tool = props.settings.tool;
    if (tool !== "brush" && tool !== "eraser") return;

    const onMouseDown = () => {
      props.dispatch({ type: "set_is_painting", isPainting: true });

      const pos = stage.getPointerPosition();
      if (!pos) return;

      props.dispatch({
        type: "add_freeform_line",
        line: {
          tool,
          points: [pos.x, pos.y, pos.x, pos.y],
          strokeWidth: props.settings.strokeWidth,
          color: { ...props.settings.color },
        },
      });
    };

    const onMouseUp = () => {
      props.dispatch({ type: "set_is_painting", isPainting: false });
    };

    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!props.settings.isPainting) return;
      e.evt.preventDefault();

      const pos = stage.getPointerPosition();
      if (!pos) return;

      props.dispatch({
        type: "append_freeform_point",
        point: [pos.x, pos.y],
      });
    };

    stage
      .on("mousedown touchstart", onMouseDown)
      .on("mousemove touchmove", onMouseMove)
      .on("mouseup touchend", onMouseUp);

    onCleanup(() => {
      stage
        .off("mousedown touchstart", onMouseDown)
        .off("mousemove touchmove", onMouseMove)
        .off("mouseup touchend", onMouseUp);
    });
  });

  return (
    <For each={props.elements.freeformLines}>
      {(line) => (
        <KonvaLine
          layer={props.layer}
          points={line.points}
          stroke={rgbaToString(
            line.tool === "eraser" ? { ...line.color, a: 1 } : line.color,
          )}
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
