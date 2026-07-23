import type { Canvas } from "fabric";
import type { SetStoreFunction } from "solid-js/store";

export type { Point, Size } from "@zag-js/rect-utils";

export type Tool =
  | "shape"
  | "brush"
  | "drag"
  | "eraser"
  | "straight-line"
  | "history"
  | "select"
  | "text";

export type ShapeVariant = "circle" | "rectangle";
export type BrushVariant = "plain" | "pressure";
type DragVariant = "drag";
type EraserVariant = "plain";
type HistoryVariant = "undo" | "redo" | "clear";
type TextVariant = "text";
type SelectVariant = "select";

export type Variant =
  | ShapeVariant
  | BrushVariant
  | DragVariant
  | EraserVariant
  | HistoryVariant
  | SelectVariant
  | TextVariant;

export type ToolConfig =
  | { tool: Extract<Tool, "shape">; variant: ShapeVariant }
  | { tool: Extract<Tool, "brush">; variant: BrushVariant }
  | { tool: Extract<Tool, "drag">; variant: DragVariant }
  | { tool: Extract<Tool, "eraser">; variant: EraserVariant }
  | { tool: Extract<Tool, "history">; variant: HistoryVariant }
  | { tool: Extract<Tool, "select">; variant: SelectVariant }
  | { tool: Extract<Tool, "text">; variant: TextVariant };

export interface StrokeConfig {
  strokeWidth: number;
  /** [primary, reserved] — primary is the active canvas color, reserved is swapped in on `Mod`+`X` */
  colors: [string, string];
}

export interface TextSettings {
  fontSize: number;
  fontFamily: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  underline: boolean;
}

export type ShapeFill = "outline" | "solid" | "secondary";

interface ShapeSettings {
  shapeFill: ShapeFill;
}

export interface DragAndZoomSettings {
  zoom: number;
}

export type Settings = ToolConfig &
  StrokeConfig &
  TextSettings &
  ShapeSettings &
  DragAndZoomSettings;

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
