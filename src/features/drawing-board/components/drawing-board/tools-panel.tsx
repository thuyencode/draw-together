import type { Point, Size } from "@zag-js/rect-utils";
import type { LucideIcon } from "lucide-solid";
import { BrushIcon, EraserIcon, GripVerticalIcon, XIcon } from "lucide-solid";
import { createSignal, Index } from "solid-js";
import { Dynamic } from "solid-js/web";
import { FloatingPanel } from "~/features/shared/components/ui/floating-panel";
import { Tooltip } from "~/features/shared/components/ui/tooltip";
import { createPosition } from "./hooks";

import { ToolButton } from "./tool-button";
import type {
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithTool,
  SetToolFunc,
  Tool,
} from "./types";
import { getInitialPosition } from "./utils";

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
  PropsWithDefaultPosition & {
    setTool: SetToolFunc;
  };

export function ToolsPanel(props: ToolsPanelProps) {
  const [size, setSize] = createSignal<Size>({ width: 55, height: 240 });
  const [position, setPosition] = createSignal<Point>();

  const shouldBeVertical = () => size().width <= 100;

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
                    onClick={() => props.setTool(t().tool)}
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
