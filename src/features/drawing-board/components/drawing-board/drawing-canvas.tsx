import { Layer, Stage } from "solid-konva";
import { FreeformInput } from "./freeform-input";
import { ShapeInput } from "./shape-input";
import { StraightLineInput } from "./straight-line-input";
import type {
  DrawingElements,
  DrawingSettings,
  PropsWithDispatch,
} from "./types";

export interface DrawingCanvasProps extends PropsWithDispatch {
  settings: DrawingSettings;
  elements: DrawingElements;
}

export function DrawingCanvas(props: DrawingCanvasProps) {
  return (
    <Stage class="h-full">
      <Layer>
        <FreeformInput
          settings={props.settings}
          elements={props.elements}
          dispatch={props.dispatch}
        />
        <ShapeInput
          settings={props.settings}
          elements={props.elements}
          dispatch={props.dispatch}
        />
        <StraightLineInput
          settings={props.settings}
          elements={props.elements}
          dispatch={props.dispatch}
        />
      </Layer>
    </Stage>
  );
}
