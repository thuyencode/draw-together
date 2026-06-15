import type { Size } from "@zag-js/rect-utils";
import type { LucideIcon } from "lucide-solid";
import {
  ArrowDownLeftIcon,
  BrushIcon,
  EraserIcon,
  GripVerticalIcon,
  MinusIcon,
  XIcon,
} from "lucide-solid";
import { createSignal, Index } from "solid-js";
import { Dynamic } from "solid-js/web";
import { FloatingPanel, Tooltip } from "~/features/shared/components/ui";
import { createPosition } from "./hooks";

import { ToolButton } from "./tool-button";
import type {
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithDispatch,
  PropsWithTool,
  Tool,
} from "./types";

interface ToolItem {
  tool: Tool;
  label: string;
  icon: LucideIcon;
}

const tools: ToolItem[] = [
  { tool: "brush", label: "Brush", icon: BrushIcon },
  { tool: "eraser", label: "Eraser", icon: EraserIcon },
];

type ToolsPanelProps = PropsWithTool &
  PropsWithContainerRef &
  PropsWithDefaultPosition &
  PropsWithDispatch;

export function ToolsPanel(props: ToolsPanelProps) {
  const [size, setSize] = createSignal<Size>({ width: 55, height: 240 });
  const [position, setPosition] = createPosition(
    props.defaultPosition,
    () => props.containerRef,
    size,
  );

  const shouldBeVertical = () => size().width <= 100;

  return (
    <FloatingPanel.Root
      defaultOpen
      strategy="absolute"
      position={position()}
      onPositionChange={(p) => setPosition(p.position)}
      size={size()}
      onSizeChange={(e) => {
        if (e.size.width <= 100) {
          setSize({ ...e.size, width: 55 });
        } else {
          setSize(e.size);
        }
      }}
    >
      <FloatingPanel.Positioner>
        <FloatingPanel.Content>
          <FloatingPanel.DragTrigger>
            <FloatingPanel.Header vertical={shouldBeVertical()}>
              <FloatingPanel.Title>
                <GripVerticalIcon />
                <span classList={{ "sr-only": shouldBeVertical() }}>Tool</span>
              </FloatingPanel.Title>

              <FloatingPanel.Control>
                <FloatingPanel.StageTrigger stage="minimized">
                  <MinusIcon />
                </FloatingPanel.StageTrigger>
                <FloatingPanel.StageTrigger stage="default">
                  <ArrowDownLeftIcon />
                </FloatingPanel.StageTrigger>
                <FloatingPanel.CloseTrigger>
                  <XIcon />
                </FloatingPanel.CloseTrigger>
              </FloatingPanel.Control>
            </FloatingPanel.Header>
          </FloatingPanel.DragTrigger>

          <FloatingPanel.Body class="flex-row flex-wrap flex-none">
            <Index each={tools}>
              {(t) => (
                <Tooltip.Root
                  positioning={{
                    placement: shouldBeVertical() ? "right" : "top",
                  }}
                >
                  <ToolButton
                    iconOnly
                    type="button"
                    data-current-tool={t().tool === props.tool}
                    onClick={() =>
                      props.dispatch({
                        type: "set_tool",
                        tool: t().tool,
                      })
                    }
                    as={Tooltip.Trigger}
                  >
                    <Dynamic component={t().icon} />
                  </ToolButton>
                  <Tooltip.Positioner>
                    <Tooltip.Arrow>
                      <Tooltip.ArrowTip />
                    </Tooltip.Arrow>
                    <Tooltip.Content>{t().label}</Tooltip.Content>
                  </Tooltip.Positioner>
                </Tooltip.Root>
              )}
            </Index>
          </FloatingPanel.Body>

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
