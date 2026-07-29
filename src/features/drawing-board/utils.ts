import { SHORTCUTS } from "./constants";
import type { RgbColor } from "@irojs/iro-core";
import type {
  ActiveSelection,
  Canvas,
  CircleProps,
  FabricObject,
  RectProps,
} from "fabric";
import type {
  Point,
  Position,
  ShortcutId,
  Size,
  StrokeConfig,
  Tool,
} from "./types";

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

export function getTargetOfSelection(canvas: Canvas) {
  const activeObjects = canvas.getActiveObjects();
  /*
   * If no objects is selected, get all objects on canvas for removal
   * If there is more than one object selected, get the ActiveSelection object instead
   * Otherwise, get array of selected objects, it only has one item
   */
  const target = (
    activeObjects.length === 0
      ? canvas.getObjects()
      : activeObjects.length > 1
        ? canvas.getActiveObject()
        : activeObjects
  ) as FabricObject[] | ActiveSelection;

  return target;
}

/**
 * Get relevant style values for the given element
 * @see https://stackoverflow.com/a/64654744/13221239
 */
export function getSvgCursor(
  svg: string,
  strokeWidth: StrokeConfig["strokeWidth"],
) {
  return `url(data:image/svg+xml;base64,${window.btoa(svg)}) ${strokeWidth} ${strokeWidth}, auto`;
}

export function getTransformVals(el: HTMLElement) {
  const style = window.getComputedStyle(el);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    scaleX: matrix.m11,
    scaleY: matrix.m22,
    translateX: matrix.m41,
    translateY: matrix.m42,
    width: el.getBoundingClientRect().width,
    height: el.getBoundingClientRect().height,
  };
}

/**
 * Posted by Anatoliy, modified by community. See post 'Timeline' for change history
 * Retrieved 2026-07-22, License - CC BY-SA 3.0
 * @see https://stackoverflow.com/a/1484514
 */
export function generateRandomColor() {
  let color = "#";
  const letters = "0123456789ABCDEF";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getShortcut(id: ShortcutId) {
  const entry = SHORTCUTS.get(id);
  if (!entry) throw new Error(`Missing shortcut: ${id}`);
  return entry;
}
