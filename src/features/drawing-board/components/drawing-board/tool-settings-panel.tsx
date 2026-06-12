import type { Point, Size } from "@zag-js/rect-utils";
import { GripVerticalIcon, XIcon } from "lucide-solid";
import { createSignal, onMount } from "solid-js";
import {
  FloatingPanel,
  FloatingPanelBody,
  FloatingPanelCloseTrigger,
  FloatingPanelContent,
  FloatingPanelControl,
  FloatingPanelDragTrigger,
  FloatingPanelHeader,
  FloatingPanelPositioner,
  FloatingPanelResizeTrigger,
  FloatingPanelTitle,
} from "~/features/shared/components/ui/floating-panel";
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
    <FloatingPanel
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
      <FloatingPanelPositioner>
        <FloatingPanelContent>
          <FloatingPanelDragTrigger>
            <FloatingPanelHeader>
              <FloatingPanelTitle class="capitalize">
                <GripVerticalIcon />
                {props.tool} Settings
              </FloatingPanelTitle>

              <FloatingPanelControl>
                <FloatingPanelCloseTrigger>
                  <XIcon />
                </FloatingPanelCloseTrigger>
              </FloatingPanelControl>
            </FloatingPanelHeader>
          </FloatingPanelDragTrigger>

          <FloatingPanelBody class="flex-row flex-wrap flex-none" />

          <FloatingPanelResizeTrigger axis="n" />
          <FloatingPanelResizeTrigger axis="e" />
          <FloatingPanelResizeTrigger axis="w" />
          <FloatingPanelResizeTrigger axis="s" />
          <FloatingPanelResizeTrigger axis="ne" />
          <FloatingPanelResizeTrigger axis="se" />
          <FloatingPanelResizeTrigger axis="sw" />
          <FloatingPanelResizeTrigger axis="nw" />
        </FloatingPanelContent>
      </FloatingPanelPositioner>
    </FloatingPanel>
  );
}
