import type { RgbColor } from "@irojs/iro-core";
import type { Point, Position, Size, Tool } from "./types";
import type { CircleProps, FabricObjectProps, RectProps } from "fabric";

const GAP = 20;

export function getInitialPosition(
  position: Position,
  container: HTMLDivElement,
  elementSize: Size,
): Point | undefined {
  const rect = container.getBoundingClientRect();

  const containerWidth = rect.width;
  const containerHeight = rect.height;

  switch (position) {
    case "top-left":
      return {
        x: GAP,
        y: GAP,
      };

    case "top-right":
      return {
        x: containerWidth - elementSize.width - GAP,
        y: GAP,
      };

    case "top-center":
      return {
        x: (containerWidth - elementSize.width) / 2,
        y: GAP,
      };

    case "bottom-left":
      return {
        x: GAP,
        y: containerHeight - elementSize.height - GAP,
      };

    case "bottom-right":
      return {
        x: containerWidth - elementSize.width - GAP,
        y: containerHeight - elementSize.height - GAP,
      };

    case "bottom-center":
      return {
        x: (containerWidth - elementSize.width) / 2,
        y: containerHeight - elementSize.height - GAP,
      };

    case "center":
      return {
        x: (containerWidth - elementSize.width) / 2,
        y: (containerHeight - elementSize.height) / 2,
      };

    default:
      return undefined;
  }
}

export const rgbaToString = ({ r, g, b, a = 1 }: RgbColor) =>
  a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;

export const normalizeToolName = (tool: Tool) => tool.replace(/-/g, " ");

export function getRectFromPoints(
  initial: Point,
  current: Point,
): Pick<RectProps, "left" | "top" | "width" | "height"> {
  const width = Math.abs(current.x - initial.x);
  const height = Math.abs(current.y - initial.y);
  const left =
    (Math.min(initial.x, current.x) + Math.max(initial.x, current.x)) / 2;
  const top =
    (Math.min(initial.y, current.y) + Math.max(initial.y, current.y)) / 2;

  return { left, top, width, height };
}

export function getCircleFromPoints(
  initial: Point,
  current: Point,
): Pick<CircleProps, "left" | "top" | "radius"> {
  const radius =
    Math.max(Math.abs(current.x - initial.x), Math.abs(current.y - initial.y)) /
    2;
  const left =
    (Math.min(initial.x, current.x) + Math.max(initial.x, current.x)) / 2;
  const top =
    (Math.min(initial.y, current.y) + Math.max(initial.y, current.y)) / 2;

  return { left, top, radius };
}
