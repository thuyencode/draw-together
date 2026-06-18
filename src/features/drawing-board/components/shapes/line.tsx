import "konva/lib/Core";
import { Line } from "konva/lib/shapes/Line";

import { createEffect, onCleanup, splitProps } from "solid-js";
import type { LineConfig } from "konva/lib/shapes/Line";
import type { PropsWithLayer } from "../types";

type KonvaLineProps = PropsWithLayer<LineConfig>;

export function KonvaLine(_props: KonvaLineProps) {
  const [props, config] = splitProps(_props, ["layer"]);
  let node: Line | undefined;

  createEffect(() => {
    const layer = props.layer;
    if (!layer) return;

    if (!node) {
      node = new Line(config);
      layer.add(node);
    }

    node.setAttrs(config);
  });

  onCleanup(() => {
    node?.destroy();
  });

  return null;
}
