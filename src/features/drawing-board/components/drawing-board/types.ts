import type { Point, Size } from "@zag-js/rect-utils";

export type Shape = "circle" | "rectangle" | "ellipse";
export type Freeform = "brush" | "eraser";
export type Tool = Freeform | Shape;

export type DrawingAction =
  | { type: "set_tool"; tool: Tool }
  | { type: "set_stroke_width"; strokeWidth: number }
  | { type: "set_color"; color: string }
  | { type: "set_is_painting"; isPainting: boolean };

export interface StrokeConfig {
  strokeWidth: number;
  color: string;
}

export interface DrawingState extends StrokeConfig {
  isPainting: boolean;
  tool: Tool;
}

export interface FreeformInfo extends StrokeConfig {
  tool: Freeform;
  points: number[];
}

export interface ShapeInfo extends StrokeConfig {
  tool: Shape;
  x: number;
  y: number;
  width: number;
  height: number;
}

type CenteredPosition = "center";
type HorizontalPosition = "left" | "right";
type VerticalPosition = "top" | "bottom";
export type Position =
  | CenteredPosition
  | `${VerticalPosition}-${HorizontalPosition}`
  | `${VerticalPosition}-${CenteredPosition}`;

export type PropsWithTool<P = unknown> = P & { tool: Tool };

export type PropsWithContainerRef<P = unknown> = P & {
  containerRef: HTMLDivElement;
};

export type PropsWithDefaultPosition<P = unknown> = P & {
  defaultPosition: Position;
};

export type PropsWithDispatch<P = unknown> = P & {
  dispatch: (action: DrawingAction) => void;
};

export type { Point, Size };
