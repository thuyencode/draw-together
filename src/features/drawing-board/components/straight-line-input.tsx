import { For, Show, createEffect, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { KonvaLine } from "./shapes";
import { rgbaToString } from "./utils";
import type { DrawingCanvasProps } from "./drawing-canvas";
import type { Drag, PropsWithLayer, StraightLineInfo } from "./types";
import type Konva from "konva";

type StraightLineInputProps = DrawingCanvasProps & PropsWithLayer;

export function StraightLineInput(props: StraightLineInputProps) {
  const [drag, setDrag] = createStore<Drag>({
    anchor: null,
    livePointer: null,
  });

  createEffect(() => {
    const currentLayer = props.layer;
    if (!currentLayer) return;

    const stage = currentLayer.getStage();

    if (props.settings.tool !== "straight-line") return;

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
        props.commands.addStraightLine({
          tool: "straight-line",
          points: [a.x, a.y, cur.x, cur.y],
          strokeWidth: props.settings.strokeWidth,
          color: { ...props.settings.color },
        });
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

  const preview = (): StraightLineInfo | null => {
    const a = drag.anchor;
    const cur = drag.livePointer;
    if (!a || !cur) return null;

    return {
      tool: "straight-line",
      points: [a.x, a.y, cur.x, cur.y],
      color: { ...props.settings.color },
      strokeWidth: props.settings.strokeWidth,
    };
  };

  return (
    <>
      <For each={props.elements.straightLines}>
        {(line) => (
          <KonvaLine
            layer={props.layer}
            points={line.points}
            stroke={rgbaToString(line.color)}
            strokeWidth={line.strokeWidth}
            tension={0}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </For>
      <Show when={preview()}>
        {(p) => (
          <KonvaLine
            layer={props.layer}
            points={p().points}
            stroke={rgbaToString(p().color)}
            strokeWidth={p().strokeWidth}
            tension={0}
            lineCap="round"
            lineJoin="round"
            dash={[p().strokeWidth * 2, p().strokeWidth * 4]}
          />
        )}
      </Show>
    </>
  );
}
