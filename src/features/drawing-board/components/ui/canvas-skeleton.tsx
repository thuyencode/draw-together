import { Show } from "solid-js";
import type { CanvasOptions } from "fabric";
import { useIsClient } from "~/features/shared/hooks";

interface CanvasSkeletonProps {
  options?: Pick<
    Partial<CanvasOptions>,
    "backgroundColor" | "width" | "height"
  >;
}

export function CanvasSkeleton(props: CanvasSkeletonProps) {
  const isClient = useIsClient();

  return (
    <Show when={!isClient()}>
      <div
        class="absolute inset-0 m-auto"
        style={{
          "background-color": props.options?.backgroundColor
            ? props.options.backgroundColor.toString()
            : undefined,
          width: props.options?.width ? `${props.options.width}px` : undefined,
          height: props.options?.height
            ? `${props.options.height}px`
            : undefined,
        }}
      />
    </Show>
  );
}
