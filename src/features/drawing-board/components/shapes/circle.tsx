import "konva/lib/Core";
import { Circle } from "konva/lib/shapes/Circle";

import { createEffect, onCleanup, splitProps } from "solid-js";
import type { CircleConfig } from "konva/lib/shapes/Circle";
import type { PropsWithLayer } from "../types";

type KonvaCircleProps = PropsWithLayer<CircleConfig>;

export function KonvaCircle(_props: KonvaCircleProps) {
  const [props, config] = splitProps(_props, ["layer"]);
  let node: Circle | undefined;

  createEffect(() => {
    const layer = props.layer;
    if (!layer) return;

    if (!node) {
      node = new Circle(config);
      layer.add(node);
    }

    node.setAttrs(config);
  });

  onCleanup(() => {
    node?.destroy();
  });

  return null;
}
