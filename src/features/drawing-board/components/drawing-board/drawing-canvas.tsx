import type Konva from "konva";
import {
  createEffect,
  createSignal,
  For,
  Match,
  onCleanup,
  Show,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  Circle,
  Ellipse,
  Layer,
  Line,
  Rect,
  Stage,
  useStage,
} from "solid-konva";
import type {
  DrawingState,
  LineInfo,
  PropsWithDispatch,
  Shape,
  ShapeInfo,
} from "./types";
import { normalizeBbox } from "./utils";

interface DrawingCanvasProps extends PropsWithDispatch {
  drawingState: DrawingState;
}

export function DrawingCanvas(props: DrawingCanvasProps) {
  return (
    <Stage class="h-full">
      <Layer>
        <FreeformInput
          drawingState={props.drawingState}
          dispatch={props.dispatch}
        />
        <ShapeInput
          drawingState={props.drawingState}
          dispatch={props.dispatch}
        />
      </Layer>
    </Stage>
  );
}

function FreeformInput(props: DrawingCanvasProps) {
  const [lines, setLines] = createStore<LineInfo[]>([]);
  const stage = useStage();

  createEffect(() => {
    const currentStage = stage?.stage();
    if (!currentStage) return;

    const tool = props.drawingState.tool;
    if (tool !== "brush" && tool !== "eraser") return;

    const onMouseDown = () => {
      props.dispatch({ type: "set_is_painting", isPainting: true });

      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      setLines((prev) => [
        ...prev,
        {
          tool,
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

function ShapeInput(props: DrawingCanvasProps) {
  const [shapes, setShapes] = createStore<ShapeInfo[]>([]);
  const [anchor, setAnchor] = createSignal<{ x: number; y: number } | null>(
    null,
  );
  const [livePointer, setLivePointer] = createSignal<{
    x: number;
    y: number;
  } | null>(null);
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

      setAnchor({ x: pos.x, y: pos.y });
      setLivePointer({ x: pos.x, y: pos.y });
    };

    const onMouseUp = () => {
      const a = anchor();
      const cur = livePointer();
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

      setAnchor(null);
      setLivePointer(null);
      props.dispatch({ type: "set_is_painting", isPainting: false });
    };

    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      setLivePointer({ x: pos.x, y: pos.y });

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
    const a = anchor();
    const cur = livePointer();
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

interface ShapeNodeProps {
  info: ShapeInfo;
  isPreview?: boolean;
}

function ShapeNode(props: ShapeNodeProps) {
  const s = () => props.info;

  return (
    <Switch>
      <Match when={s().tool === "rectangle"}>
        <Rect
          x={s().x}
          y={s().y}
          width={s().width}
          height={s().height}
          stroke={s().color}
          strokeWidth={s().strokeWidth}
          dash={props.isPreview ? [5, 5] : undefined}
        />
      </Match>
      <Match when={s().tool === "circle"}>
        <Circle
          x={s().x + s().width / 2}
          y={s().y + s().height / 2}
          radius={Math.min(s().width, s().height) / 2}
          stroke={s().color}
          strokeWidth={s().strokeWidth}
          dash={props.isPreview ? [5, 5] : undefined}
        />
      </Match>
      <Match when={s().tool === "ellipse"}>
        <Ellipse
          x={s().x + s().width / 2}
          y={s().y + s().height / 2}
          radiusX={s().width / 2}
          radiusY={s().height / 2}
          stroke={s().color}
          strokeWidth={s().strokeWidth}
          dash={props.isPreview ? [5, 5] : undefined}
        />
      </Match>
    </Switch>
  );
}
