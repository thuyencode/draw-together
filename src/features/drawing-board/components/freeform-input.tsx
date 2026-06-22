import { For, createEffect, onCleanup } from "solid-js";
import { getStroke } from "perfect-freehand";
import { KonvaLine } from "./shapes";
import { rgbaToString } from "./utils";
import type { StrokeOptions } from "perfect-freehand";
import type Konva from "konva";
import type { DrawingCanvasProps } from "./drawing-canvas";
import type { FreeformInfo, PropsWithLayer, Tool, Variant } from "./types";

type FreeformInputProps = PropsWithLayer<DrawingCanvasProps>;

export function FreeformInput(props: FreeformInputProps) {
  createEffect(() => {
    const currentLayer = props.layer;
    if (!currentLayer) return;

    const stage = currentLayer.getStage();
    const tool = props.settings.tool;
    const variant = props.settings.variant;

    if (!isFreeformTool(tool) || !isFreeformVariant(variant)) return;

    // Local buffer: [[x, y, pressure], [x, y, pressure], ...]
    let rawPoints: [x: number, y: number, pressure: number][] = [];

    const strokeOptions: StrokeOptions = {
      size: props.settings.strokeWidth,
      thinning: 0.7,
      smoothing: 0.5,
      streamline: 0.5,
      simulatePressure: false,
    };

    const onPointerDown = () => {
      props.commands.setIsPainting(true);

      const pos = stage.getPointerPosition();
      if (!pos) return;

      const pressure = 0.5;
      rawPoints = [
        [pos.x, pos.y, pressure],
        [pos.x, pos.y, pressure],
      ];

      if (variant === "ink") {
        const outline = getStroke(rawPoints, { ...strokeOptions, last: false });

        props.commands.addFreeformLine({
          tool,
          variant,
          points: outline.flat(),
          strokeWidth: props.settings.strokeWidth,
          color: { ...props.settings.color },
        });
      } else {
        props.commands.addFreeformLine({
          tool,
          variant,
          points: [pos.x, pos.y, pos.x, pos.y],
          strokeWidth: props.settings.strokeWidth,
          color: { ...props.settings.color },
        });
      }
    };

    const onPointerUp = () => {
      props.commands.setIsPainting(false);

      if (variant === "ink") {
        const lastIdx = props.elements.freeformLines.length - 1;
        if (lastIdx === -1) return;

        const outline = getStroke(rawPoints, { ...strokeOptions, last: true });

        props.commands.setFreeformLinePoints(lastIdx, outline.flat());
      }

      rawPoints = [];
    };

    const onPointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (!props.settings.isPainting) return;
      e.evt.preventDefault();

      const pos = stage.getPointerPosition();
      if (!pos) return;

      const pressure = e.evt.pressure * 5;
      rawPoints.push([pos.x, pos.y, pressure]);

      if (variant === "ink") {
        const lastIdx = props.elements.freeformLines.length - 1;
        if (lastIdx === -1) return;

        const outline = getStroke(rawPoints, { ...strokeOptions, last: false });

        props.commands.setFreeformLinePoints(lastIdx, outline.flat());
      } else {
        props.commands.appendFreeformPoint([pos.x, pos.y]);
      }
    };

    stage
      .on("pointerdown", onPointerDown)
      .on("pointermove", onPointerMove)
      .on("pointerup pointercancel", onPointerUp);

    onCleanup(() => {
      stage
        .off("pointerdown", onPointerDown)
        .off("pointermove", onPointerMove)
        .off("pointerup pointercancel", onPointerUp);
    });
  });

  return (
    <For each={props.elements.freeformLines}>
      {(line) => {
        const isEraser = line.tool === "eraser";
        const isInk = line.variant === "ink";

        return (
          <KonvaLine
            layer={props.layer}
            points={line.points}
            fill={isInk ? rgbaToString(line.color) : undefined}
            stroke={
              isInk
                ? "transparent"
                : rgbaToString(isEraser ? { ...line.color, a: 1 } : line.color)
            }
            strokeWidth={isInk ? 0 : line.strokeWidth}
            closed={isInk ? true : undefined}
            tension={0.5}
            lineCap={isInk ? undefined : "round"}
            lineJoin={isInk ? undefined : "round"}
            globalCompositeOperation={
              isEraser ? "destination-out" : "source-over"
            }
          />
        );
      }}
    </For>
  );
}

type FreeformTool = FreeformInfo["tool"];
type FreeformVariant = FreeformInfo["variant"];

const freeformTools: FreeformTool[] = ["brush", "eraser"];
const freeformVariants: FreeformVariant[] = ["plain", "ink"];

const isFreeformTool = (tool: Tool): tool is FreeformTool =>
  freeformTools.includes(tool as FreeformTool);

const isFreeformVariant = (variant: Variant): variant is FreeformVariant =>
  freeformVariants.includes(variant as FreeformVariant);
