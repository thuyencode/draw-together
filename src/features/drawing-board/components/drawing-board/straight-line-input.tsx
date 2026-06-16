import type Konva from "konva";
import { createEffect, For, onCleanup, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Line, useStage } from "solid-konva";
import type { DrawingCanvasProps } from "./drawing-canvas";
import type { Drag, StraightLineInfo } from "./types";

export function StraightLineInput(props: DrawingCanvasProps) {
  const [lines, setLines] = createStore<StraightLineInfo[]>([]);
  const [drag, setDrag] = createStore<Drag>({
    anchor: null,
    livePointer: null,
  });
  const stage = useStage();

  createEffect(() => {
    const currentStage = stage?.stage();
    if (!currentStage) return;

    const tool = props.drawingState.tool;
    if (tool !== "straight-line") return;

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
        setLines(lines.length, {
          tool: "straight-line",
          points: [a.x, a.y, cur.x, cur.y],
          strokeWidth: props.drawingState.strokeWidth,
          color: props.drawingState.color,
        });
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

  const preview = (): StraightLineInfo | null => {
    const a = drag.anchor;
    const cur = drag.livePointer;

    if (!a || !cur) return null;

    return {
      tool: "straight-line",
      points: [a.x, a.y, cur.x, cur.y],
      color: props.drawingState.color,
      strokeWidth: props.drawingState.strokeWidth,
    };
  };

  return (
    <>
      <For each={lines}>{(line) => <StraightLineNode info={line} />}</For>
      <Show when={preview()}>
        {(p) => <StraightLineNode info={p()} isPreview />}
      </Show>
    </>
  );
}

interface StraightLineNodeProps {
  info: StraightLineInfo;
  isPreview?: boolean;
}

function StraightLineNode(props: StraightLineNodeProps) {
  return (
    <Line
      points={props.info.points}
      stroke={props.info.color}
      strokeWidth={props.info.strokeWidth}
      tension={0}
      lineCap="round"
      lineJoin="round"
      dash={props.isPreview ? [10, 10] : undefined}
    />
  );
}
