import { For, Match, Show, Switch, createEffect, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { KonvaCircle, KonvaRect } from "./shapes";
import { normalizeBbox, rgbaToString } from "./utils";
import type Konva from "konva";
import type { DrawingCanvasProps } from "./drawing-canvas";
import type { Drag, PropsWithLayer, Shape, ShapeInfo } from "./types";

type ShapeInputProps = DrawingCanvasProps & PropsWithLayer;

export function ShapeInput(props: ShapeInputProps) {
  const [drag, setDrag] = createStore<Drag>({
    anchor: null,
    livePointer: null,
  });

  createEffect(() => {
    const currentLayer = props.layer;
    if (!currentLayer) return;

    const stage = currentLayer.getStage();

    const tool = props.settings.tool;
    const isShapeTool = tool === "circle" || tool === "rectangle";
    if (!isShapeTool) return;

    const onMouseDown = () => {
      props.dispatch({ type: "set_is_painting", isPainting: true });

      const pos = stage.getPointerPosition();
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
              tool: tool,
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
      const pos = stage.getPointerPosition();
      if (!pos) return;

      setDrag("livePointer", { x: pos.x, y: pos.y });

      if (!props.settings.isPainting) return;
      e.evt.preventDefault();
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
      <For each={props.elements.shapes}>
        {(s) => (
          <Switch>
            <Match when={s.tool === "rectangle"}>
              <KonvaRect
                layer={props.layer}
                x={s.x}
                y={s.y}
                width={s.width}
                height={s.height}
                stroke={rgbaToString(s.color)}
                strokeWidth={s.strokeWidth}
              />
            </Match>
            <Match when={s.tool === "circle"}>
              <KonvaCircle
                layer={props.layer}
                x={s.x + s.width / 2}
                y={s.y + s.height / 2}
                radius={Math.min(s.width, s.height) / 2}
                stroke={rgbaToString(s.color)}
                strokeWidth={s.strokeWidth}
              />
            </Match>
          </Switch>
        )}
      </For>
      <Show when={preview()}>
        {(p) => (
          <Switch>
            <Match when={p().tool === "rectangle"}>
              <KonvaRect
                layer={props.layer}
                x={p().x}
                y={p().y}
                width={p().width}
                height={p().height}
                stroke={rgbaToString(p().color)}
                strokeWidth={p().strokeWidth}
                dash={[p().strokeWidth * 2, p().strokeWidth * 4]}
              />
            </Match>
            <Match when={p().tool === "circle"}>
              <KonvaCircle
                layer={props.layer}
                x={p().x + p().width / 2}
                y={p().y + p().height / 2}
                radius={Math.min(p().width, p().height) / 2}
                stroke={rgbaToString(p().color)}
                strokeWidth={p().strokeWidth}
                dash={[p().strokeWidth * 2, p().strokeWidth * 4]}
              />
            </Match>
          </Switch>
        )}
      </Show>
    </>
  );
}
