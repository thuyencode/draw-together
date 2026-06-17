import type Konva from "konva";
import { createEffect, For, Match, onCleanup, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { Circle, Rect, useStage } from "solid-konva";
import type { DrawingCanvasProps } from "./drawing-canvas";
import type { Drag, Shape, ShapeInfo } from "./types";
import { normalizeBbox, rgbaToString } from "./utils";

export function ShapeInput(props: DrawingCanvasProps) {
  const [drag, setDrag] = createStore<Drag>({
    anchor: null,
    livePointer: null,
  });

  const stage = useStage();

  createEffect(() => {
    const currentStage = stage?.stage();
    if (!currentStage) return;

    const tool = props.settings.tool;
    const isShapeTool = tool === "circle" || tool === "rectangle";
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
          props.dispatch({
            type: "add_shape",
            shape: {
              tool: tool as Shape,
              ...bbox,
              strokeWidth: props.settings.strokeWidth,
              color: { ...props.settings.color },
            },
          });
        }
      }

      setDrag({ anchor: null, livePointer: null });
      props.dispatch({ type: "set_is_painting", isPainting: false });
    };

    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      setDrag("livePointer", { x: pos.x, y: pos.y });

      if (!props.settings.isPainting) return;
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
      tool: props.settings.tool as Shape,
      ...bbox,
      strokeWidth: props.settings.strokeWidth,
      color: { ...props.settings.color },
    };
  };

  return (
    <>
      <For each={props.elements.shapes}>{(s) => <ShapeNode info={s} />}</For>
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

  const getDashSize = () => {
    return props.isPreview
      ? [s().strokeWidth * 2, s().strokeWidth * 4]
      : undefined;
  };

  return (
    <Switch>
      <Match when={s().tool === "rectangle"}>
        <Rect
          x={s().x}
          y={s().y}
          width={s().width}
          height={s().height}
          stroke={rgbaToString(s().color)}
          strokeWidth={s().strokeWidth}
          dash={getDashSize()}
        />
      </Match>
      <Match when={s().tool === "circle"}>
        <Circle
          x={s().x + s().width / 2}
          y={s().y + s().height / 2}
          radius={Math.min(s().width, s().height) / 2}
          stroke={rgbaToString(s().color)}
          strokeWidth={s().strokeWidth}
          dash={getDashSize()}
        />
      </Match>
    </Switch>
  );
}
