import type { Point, Size } from "@zag-js/rect-utils";
import { GripVerticalIcon, XIcon } from "lucide-solid";
import { createSignal } from "solid-js";
import { FloatingPanel } from "~/features/shared/components/ui/floating-panel";
import { createPosition } from "./hooks";
import type {
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithTool,
} from "./types";
import { getInitialPosition } from "./utils";

type ToolSettingsPanelsProps = PropsWithTool &
  PropsWithContainerRef &
  PropsWithDefaultPosition;

export function ToolSettingsPanels(props: ToolSettingsPanelsProps) {
  const [size, setSize] = createSignal<Size>({ width: 300, height: 240 });
  const [position, setPosition] = createSignal<Point>();

  onMount(() => {
    const pos = getInitialPosition(
      props.defaultPosition,
      props.containerRef,
      size(),
    );
    if (pos) setPosition(pos);
  });

  return (
    <FloatingPanel.Root
      defaultOpen
      strategy="absolute"
      position={position()}
      onPositionChange={(p) => setPosition(p.position)}
      size={size()}
      onSizeChange={(e) => {
        if (e.size.width <= 300) {
          setSize({ ...e.size, width: 300 });
        } else {
          setSize(e.size);
        }
      }}
    >
      <FloatingPanel.Positioner>
        <FloatingPanel.Content>
          <FloatingPanel.DragTrigger>
            <FloatingPanel.Header>
              <FloatingPanel.Title class="capitalize">
                <GripVerticalIcon />
                {props.tool} Settings
              </FloatingPanel.Title>

              <FloatingPanel.Control>
                <FloatingPanel.CloseTrigger>
                  <XIcon />
                </FloatingPanel.CloseTrigger>
              </FloatingPanel.Control>
            </FloatingPanel.Header>
          </FloatingPanel.DragTrigger>

          <FloatingPanel.Body class="flex-row flex-wrap flex-none" />

          <FloatingPanel.ResizeTrigger axis="n" />
          <FloatingPanel.ResizeTrigger axis="e" />
          <FloatingPanel.ResizeTrigger axis="w" />
          <FloatingPanel.ResizeTrigger axis="s" />
          <FloatingPanel.ResizeTrigger axis="ne" />
          <FloatingPanel.ResizeTrigger axis="se" />
          <FloatingPanel.ResizeTrigger axis="sw" />
          <FloatingPanel.ResizeTrigger axis="nw" />
        </FloatingPanel.Content>
      </FloatingPanel.Positioner>
    </FloatingPanel.Root>
  );
}
