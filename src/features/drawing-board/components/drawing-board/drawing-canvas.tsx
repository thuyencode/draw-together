import { Match, Switch } from "solid-js";
import { Circle, Ellipse, Layer, Rect, Stage } from "solid-konva";
import { FreeformInput } from "./freeform-input";
import { ShapeInput } from "./shape-input";
import type { DrawingState, PropsWithDispatch, ShapeInfo } from "./types";

export interface DrawingCanvasProps extends PropsWithDispatch {
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

interface ShapeNodeProps {
  info: ShapeInfo;
  isPreview?: boolean;
}

export function ShapeNode(props: ShapeNodeProps) {
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
