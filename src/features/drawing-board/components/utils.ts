import type { RgbColor } from "@irojs/iro-core";
import type { Point, Position, Size, Tool } from "./types";

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

export function normalizeBbox(
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(b.x - a.x),
    height: Math.abs(b.y - a.y),
  };
}

export const rgbaToString = ({ r, g, b, a = 1 }: RgbColor) =>
  a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;

export function normalizeToolName(tool: Tool) {
  const parts = tool.split("-");

  if (parts.length < 2) return tool;

  return parts.join(" ");
}
