import "konva/lib/Core";
import { Rect } from "konva/lib/shapes/Rect";

import { createEffect, onCleanup, splitProps } from "solid-js";
import type { RectConfig } from "konva/lib/shapes/Rect";
import type { PropsWithLayer } from "../types";

export type KonvaRectProps = PropsWithLayer<RectConfig>;

export function KonvaRect(_props: KonvaRectProps) {
  const [props, config] = splitProps(_props, ["layer"]);
  let node: Rect | undefined;

  createEffect(() => {
    const layer = props.layer;
    if (!layer) return;

    if (!node) {
      node = new Rect(config);
      layer.add(node);
    }

    node.setAttrs(config);
  });

  onCleanup(() => {
    node?.destroy();
  });

  return null;
}
