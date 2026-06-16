import { Layer, Stage } from "solid-konva";
import { FreeformInput } from "./freeform-input";
import { ShapeInput } from "./shape-input";
import { StraightLineInput } from "./straight-line-input";
import type { DrawingState, PropsWithDispatch } from "./types";

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
        <StraightLineInput
          drawingState={props.drawingState}
          dispatch={props.dispatch}
        />
      </Layer>
    </Stage>
  );
}
