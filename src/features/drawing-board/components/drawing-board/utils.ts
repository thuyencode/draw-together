import type { Point, Size } from "@zag-js/rect-utils";
import type { Position } from "./types";

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
