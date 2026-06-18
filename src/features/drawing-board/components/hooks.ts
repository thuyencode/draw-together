import { createEffect, createSignal } from "solid-js";
import { getInitialPosition } from "./utils";
import type { Accessor } from "solid-js";
import type { Point, Position, Size } from "./types";

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
