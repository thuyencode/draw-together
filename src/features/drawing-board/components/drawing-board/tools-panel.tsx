import type { Point, Size } from "@zag-js/rect-utils";
import type { LucideIcon } from "lucide-solid";
import { BrushIcon, EraserIcon, GripVerticalIcon, XIcon } from "lucide-solid";
import { createSignal, Index, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";
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
import {
  Tooltip,
  TooltipArrow,
  TooltipArrowTip,
  TooltipContent,
  TooltipPositioner,
  TooltipTrigger,
} from "~/features/shared/components/ui/tooltip";
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
    <FloatingPanel
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
      <FloatingPanelPositioner>
        <FloatingPanelContent>
          <FloatingPanelDragTrigger>
            <FloatingPanelHeader vertical={shouldBeVertical()}>
              <FloatingPanelTitle>
                <GripVerticalIcon />
                <span classList={{ "sr-only": shouldBeVertical() }}>Tool</span>
              </FloatingPanelTitle>

              <FloatingPanelControl>
                <FloatingPanelCloseTrigger>
                  <XIcon />
                </FloatingPanelCloseTrigger>
              </FloatingPanelControl>
            </FloatingPanelHeader>
          </FloatingPanelDragTrigger>

          <FloatingPanelBody class="flex-row flex-wrap flex-none">
            <Index each={tools}>
              {(t) => (
                <Tooltip
                  positioning={{
                    placement: shouldBeVertical() ? "right" : "top",
                  }}
                >
                  <ToolButton
                    iconOnly
                    type="button"
                    data-current-tool={t().tool === props.tool}
                    onClick={() => props.setTool(t().tool)}
                    as={TooltipTrigger}
                  >
                    <Dynamic component={t().icon} />
                  </ToolButton>
                  <TooltipPositioner>
                    <TooltipArrow>
                      <TooltipArrowTip />
                    </TooltipArrow>
                    <TooltipContent>{t().label}</TooltipContent>
                  </TooltipPositioner>
                </Tooltip>
              )}
            </Index>
          </FloatingPanelBody>

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
