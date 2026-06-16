import type { Accessor } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import type { Point, Position, Size } from "./types";
import { getInitialPosition } from "./utils";

export function createPosition(
  defaultPosition: Position,
  containerRef: Accessor<HTMLDivElement>,
  elementSize: Accessor<Size>,
) {
  const [position, setPosition] = createSignal<Point>();

  createEffect(() => {
    const pos = getInitialPosition(
      defaultPosition,
      containerRef(),
      elementSize(),
    );
    if (pos) setPosition(pos);
  });

  return [position, setPosition] as const;
}
