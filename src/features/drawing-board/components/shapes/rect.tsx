import { createEffect, onCleanup, splitProps } from "solid-js";
import Konva from "konva";
import type { PropsWithLayer } from "../types";

export type KonvaRectProps = PropsWithLayer<Konva.RectConfig>;

export function KonvaRect(_props: KonvaRectProps) {
  const [props, config] = splitProps(_props, ["layer"]);
  let node: Konva.Rect | undefined;

  createEffect(() => {
    const layer = props.layer;
    if (!layer) return;

    if (!node) {
      node = new Konva.Rect(config);
      layer.add(node);
    }

    node.setAttrs(config);
  });

  onCleanup(() => {
    node?.destroy();
  });

  return null;
}
