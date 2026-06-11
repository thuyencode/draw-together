import type { LucideIcon } from "lucide-solid";
import { BrushIcon, EraserIcon, GripVerticalIcon, XIcon } from "lucide-solid";
import { createSignal, Index } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";
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
import type { SetToolFunc, Tool } from "./types";

interface ToolItem {
  tool: Tool;
  label: string;
  icon: LucideIcon;
}

const tools: ToolItem[] = [
  { tool: "brush", label: "Brush", icon: BrushIcon },
  { tool: "eraser", label: "Eraser", icon: EraserIcon },
];

interface ToolsPanelProps {
  tool: Tool;
  setTool: SetToolFunc;
}

export function ToolsPanel(props: ToolsPanelProps) {
  const [size, setSize] = createSignal({ width: 55, height: 240 });

  const shouldBeVertical = () => size().width <= 100;

  return (
    <FloatingPanel
      defaultOpen
      size={size()}
      onSizeChange={(e) => {
        if (e.size.width <= 100) {
          setSize({ ...e.size, width: 55 });
        } else {
          setSize(e.size);
        }
      }}
    >
      <Portal>
        <FloatingPanelPositioner>
          <FloatingPanelContent>
            <FloatingPanelDragTrigger>
              <FloatingPanelHeader vertical={shouldBeVertical()}>
                <FloatingPanelTitle>
                  <GripVerticalIcon />
                  <span classList={{ "sr-only": shouldBeVertical() }}>
                    Tool
                  </span>
                </FloatingPanelTitle>

                <FloatingPanelControl>
                  <FloatingPanelCloseTrigger>
                    <XIcon />
                  </FloatingPanelCloseTrigger>
                </FloatingPanelControl>
              </FloatingPanelHeader>
            </FloatingPanelDragTrigger>

            <FloatingPanelBody class="gap-0.5 bg-background-50">
              <Index each={tools}>
                {(t) => (
                  <Tooltip positioning={{ placement: "right" }}>
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
      </Portal>
    </FloatingPanel>
  );
}
