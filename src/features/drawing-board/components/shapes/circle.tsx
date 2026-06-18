import { createEffect, onCleanup, splitProps } from "solid-js";
import Konva from "konva";
import type { PropsWithLayer } from "../types";

type KonvaCircleProps = PropsWithLayer<Konva.CircleConfig>;

export function KonvaCircle(_props: KonvaCircleProps) {
  const [props, config] = splitProps(_props, ["layer"]);
  let node: Konva.Circle | undefined;

  createEffect(() => {
    const layer = props.layer;
    if (!layer) return;

    if (!node) {
      node = new Konva.Circle(config);
      layer.add(node);
    }

    node.setAttrs(config);
  });

  onCleanup(() => {
    node?.destroy();
  });

  return null;
}
