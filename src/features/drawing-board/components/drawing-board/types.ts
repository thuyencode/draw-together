export type Tool = "brush" | "eraser";

export type SetToolFunc = (tool: Tool) => void;

export interface DrawingState {
  isPainting: boolean;
  tool: Tool;
  strokeWidth: number;
  color: string;
}

export interface LineInfo {
  tool: Tool;
  points: number[];
  strokeWidth: number;
  color: string;
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
