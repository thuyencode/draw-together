import type { Canvas } from "fabric";
import type { SetStoreFunction } from "solid-js/store";

export type { Point, Size } from "@zag-js/rect-utils";

export type Tool =
  "shape" | "brush" | "eraser" | "straight-line" | "history" | "select";

export type ShapeVariant = "circle" | "rectangle";
export type BrushVariant = "plain" | "pressure";
type EraserVariant = "plain";
type HistoryVariant = "undo" | "redo" | "clear";
type SelectVariant = "select";

export type Variant =
  ShapeVariant | BrushVariant | EraserVariant | HistoryVariant | SelectVariant;

export type ToolConfig =
  | { tool: Extract<Tool, "shape">; variant: ShapeVariant }
  | { tool: Extract<Tool, "brush">; variant: BrushVariant }
  | { tool: Extract<Tool, "eraser">; variant: EraserVariant }
  | { tool: Extract<Tool, "history">; variant: HistoryVariant }
  | { tool: Extract<Tool, "select">; variant: SelectVariant };

export interface StrokeConfig {
  strokeWidth: number;
  color: string;
}

export type Settings = ToolConfig & StrokeConfig;

type CenteredPosition = "center";
type HorizontalPosition = "left" | "right";
type VerticalPosition = "top" | "bottom";
export type Position =
  | CenteredPosition
  | `${VerticalPosition}-${HorizontalPosition}`
  | `${VerticalPosition}-${CenteredPosition}`;

export type PropsWithCanvas<P = unknown> = P & {
  canvas: Canvas;
};

export type PropsWithSettings<P = unknown> = P & {
  settings: Settings;
  setSettings: SetStoreFunction<Settings>;
};

export type PropsWithContainerRef<P = unknown> = P & {
  containerRef: HTMLDivElement;
};

export type PropsWithDefaultPosition<P = unknown> = P & {
  defaultPosition: Position;
};
