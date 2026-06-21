import type { RgbColor } from "@irojs/iro-core";
import type { Point, Size } from "@zag-js/rect-utils";
import type Konva from "konva";

export type Tool = "shape" | "brush" | "eraser" | "straight-line";

export type ShapeVariant = "circle" | "rectangle";
type BrushVariant = "plain";
type EraserVariant = "plain";
type StraightLineVariant = "plain";

export type Variant =
  | ShapeVariant
  | BrushVariant
  | EraserVariant
  | StraightLineVariant;

export type ToolSettings =
  | { tool: Extract<Tool, "shape">; variant: ShapeVariant }
  | { tool: Extract<Tool, "brush">; variant: BrushVariant }
  | { tool: Extract<Tool, "eraser">; variant: EraserVariant }
  | { tool: Extract<Tool, "straight-line">; variant: StraightLineVariant };

export interface StrokeConfig {
  strokeWidth: number;
  color: RgbColor;
}

export type DrawingSettings = ToolSettings &
  StrokeConfig & { isPainting: boolean };

export interface DrawingElements {
  freeformLines: FreeformInfo[];
  shapes: ShapeInfo[];
  straightLines: StraightLineInfo[];
}

export interface FreeformInfo extends StrokeConfig {
  tool: Extract<Tool, "brush" | "eraser">;
  points: number[];
}

export interface ShapeInfo extends StrokeConfig {
  tool: ShapeVariant;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StraightLineInfo extends StrokeConfig {
  tool: Extract<Tool, "straight-line">;
  points: [number, number, number, number];
}

type CenteredPosition = "center";
type HorizontalPosition = "left" | "right";
type VerticalPosition = "top" | "bottom";
export type Position =
  | CenteredPosition
  | `${VerticalPosition}-${HorizontalPosition}`
  | `${VerticalPosition}-${CenteredPosition}`;

export interface Drag {
  anchor: Point | null;
  livePointer: Point | null;
}

export interface Commands {
  setTool: (settings: ToolSettings) => void;
  setStrokeWidth: (strokeWidth: number) => void;
  setColor: (color: RgbColor) => void;
  setIsPainting: (isPainting: boolean) => void;
  addFreeformLine: (line: FreeformInfo) => void;
  appendFreeformPoint: (point: [number, number]) => void;
  addShape: (shape: ShapeInfo) => void;
  addStraightLine: (line: StraightLineInfo) => void;
}

export type PropsWithTool<P = unknown> = P & {
  tool: Tool;
  variant: Variant;
};

export type PropsWithContainerRef<P = unknown> = P & {
  containerRef: HTMLDivElement;
};

export type PropsWithDefaultPosition<P = unknown> = P & {
  defaultPosition: Position;
};

export type PropsWithLayer<P = unknown> = P & {
  layer: Konva.Layer | undefined;
};

export type PropsWithCommands<P = unknown> = P & {
  commands: Commands;
};

export type { Point, Size };
