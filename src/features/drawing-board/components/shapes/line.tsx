import { createEffect, onCleanup, splitProps } from "solid-js";
import Konva from "konva";
import type { PropsWithLayer } from "../types";

type KonvaLineProps = PropsWithLayer<Konva.LineConfig>;

export function KonvaLine(_props: KonvaLineProps) {
  const [props, config] = splitProps(_props, ["layer"]);
  let node: Konva.Line | undefined;

  createEffect(() => {
    const layer = props.layer;
    if (!layer) return;

    if (!node) {
      node = new Konva.Line(config);
      layer.add(node);
    }

    node.setAttrs(config);
  });

  onCleanup(() => {
    node?.destroy();
  });

  return null;
}
