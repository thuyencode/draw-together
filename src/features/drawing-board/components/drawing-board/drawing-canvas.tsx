import type Konva from "konva";
import { createEffect, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { Layer, Line, Stage, useStage } from "solid-konva";
import type { DrawingState, LineInfo, PropsWithDispatch } from "./types";

interface DrawingCanvasProps extends PropsWithDispatch {
  drawingState: DrawingState;
}

export function DrawingCanvas(props: DrawingCanvasProps) {
  return (
    <Stage class="h-full">
      <Layer>
        <LineArt drawingState={props.drawingState} dispatch={props.dispatch} />
      </Layer>
    </Stage>
  );
}

function LineArt(props: DrawingCanvasProps) {
  const [lines, setLines] = createStore<LineInfo[]>([]);
  const stage = useStage();

  createEffect(() => {
    const currentStage = stage?.stage();
    if (!currentStage) return;

    const onMouseDown = () => {
      props.dispatch({ type: "set_is_painting", isPainting: true });

      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      setLines((prev) => [
        ...prev,
        {
          tool: props.drawingState.tool,
          points: [pos.x, pos.y, pos.x, pos.y],
          strokeWidth: props.drawingState.strokeWidth,
          color: props.drawingState.color,
        },
      ]);
    };

    const onMouseUp = () => {
      props.dispatch({ type: "set_is_painting", isPainting: false });
    };

    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!props.drawingState.isPainting) return;

      e.evt.preventDefault();

      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      const lastLineIdx = lines.length - 1;
      if (lastLineIdx === -1) return;

      setLines(lastLineIdx, "points", (prev) => [...prev, pos.x, pos.y]);
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
    <For each={lines}>
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
