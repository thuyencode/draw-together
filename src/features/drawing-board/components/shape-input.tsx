import { For, Match, Show, Switch, createEffect, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { KonvaCircle, KonvaRect } from "./shapes";
import { normalizeBbox, rgbaToString } from "./utils";
import type { DrawingCanvasProps } from "./drawing-canvas";
import type {
  Drag,
  Point,
  PropsWithLayer,
  ShapeInfo,
  ShapeVariant,
} from "./types";
import type Konva from "konva";

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

    if (props.settings.tool !== "shape") return;
    const variant = props.settings.variant;

    const onMouseDown = () => {
      props.commands.setIsPainting(true);

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

        if (variant === "circle") {
          const cx = bbox.x + bbox.width / 2;
          const cy = bbox.y + bbox.height / 2;
          const dx = cur.x - cx;
          const dy = cur.y - cy;
          const radius = Math.sqrt(dx * dx + dy * dy);
          if (radius > 1) {
            props.commands.addShape({
              tool: "circle",
              x: cx,
              y: cy,
              width: radius * 2,
              height: radius * 2,
              strokeWidth: props.settings.strokeWidth,
              color: { ...props.settings.color },
            });
          }
        } else {
          if (bbox.width > 1 || bbox.height > 1) {
            props.commands.addShape({
              tool: "rectangle",
              ...bbox,
              strokeWidth: props.settings.strokeWidth,
              color: { ...props.settings.color },
            });
          }
        }
      }

      setDrag({ anchor: null, livePointer: null });
      props.commands.setIsPainting(false);
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

    const variant = props.settings.variant;
    const bbox = normalizeBbox(a, cur);

    if (variant === "circle") {
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      const dx = cur.x - cx;
      const dy = cur.y - cy;
      const radius = Math.sqrt(dx * dx + dy * dy);
      if (radius < 1) return null;
      return {
        tool: "circle",
        x: cx,
        y: cy,
        width: radius * 2,
        height: radius * 2,
        strokeWidth: props.settings.strokeWidth,
        color: { ...props.settings.color },
      };
    }

    if (bbox.width < 1 && bbox.height < 1) return null;

    return {
      tool: variant as ShapeVariant,
      ...bbox,
      strokeWidth: props.settings.strokeWidth,
      color: { ...props.settings.color },
    };
  };

  return (
    <>
      <For each={props.elements.shapes}>
        {(s) => <ShapeRenderer info={s} layer={props.layer} />}
      </For>
      <Show when={preview()}>
        {(p) => (
          <ShapeRenderer
            info={p()}
            layer={props.layer}
            isPreview
            anchor={drag.anchor ?? undefined}
          />
        )}
      </Show>
    </>
  );
}

type ShapeRendererProps = PropsWithLayer<{
  isPreview?: boolean;
  info: ShapeInfo;
  anchor?: Point;
}>;

function ShapeRenderer(props: ShapeRendererProps) {
  const s = () => props.info;
  const dash = () =>
    props.isPreview ? [s().strokeWidth * 2, s().strokeWidth * 4] : undefined;

  return (
    <Switch>
      <Match when={s().tool === "rectangle"}>
        <KonvaRect
          layer={props.layer}
          x={s().x}
          y={s().y}
          width={s().width}
          height={s().height}
          stroke={rgbaToString(s().color)}
          strokeWidth={s().strokeWidth}
          dash={dash()}
        />
      </Match>
      <Match when={s().tool === "circle"}>
        <KonvaCircle
          layer={props.layer}
          x={s().x}
          y={s().y}
          radius={s().width / 2}
          stroke={rgbaToString(s().color)}
          strokeWidth={s().strokeWidth}
          dash={dash()}
        />
      </Match>
    </Switch>
  );
}
