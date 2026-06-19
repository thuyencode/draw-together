import {
  ArrowDownLeftIcon,
  BrushIcon,
  EraserIcon,
  GripVerticalIcon,
  MinusIcon,
  SlashIcon,
  XIcon,
} from "lucide-solid";
import { Index, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { createPosition } from "./hooks";
import { ShapeToolsMenu } from "./shape-tools-menu";
import { ToolButton } from "./tool-button";
import type { LucideIcon } from "lucide-solid";
import type {
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithDispatch,
  PropsWithTool,
  Size,
  Tool,
} from "./types";
import { FloatingPanel } from "~/features/shared/components/ui";

interface ToolItem {
  tool: Tool;
  label: string;
  icon: LucideIcon;
}

const tools: ToolItem[] = [
  { tool: "brush", label: "Brush", icon: BrushIcon },
  { tool: "eraser", label: "Eraser", icon: EraserIcon },
  { tool: "straight-line", label: "Straight line", icon: SlashIcon },
];

type ToolsPanelProps = PropsWithTool &
  PropsWithContainerRef &
  PropsWithDefaultPosition &
  PropsWithDispatch;

export function ToolsPanel(props: ToolsPanelProps) {
  const [size, setSize] = createSignal<Size>({ width: 54, height: 290 });
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
          setSize({ ...e.size, width: 54 });
        } else {
          setSize(e.size);
        }
      }}
    >
      <FloatingPanel.Positioner
        initialStyle={{
          "--x": "20px",
          "--y": "20px",
        }}
      >
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

          <FloatingPanel.Body class="flex-none flex-row flex-wrap">
            <Index each={tools}>
              {(t) => (
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
                >
                  <Dynamic component={t().icon} />
                  <span class="sr-only">{t().label}</span>
                </ToolButton>
              )}
            </Index>

            <ShapeToolsMenu
              tool={props.tool}
              dispatch={props.dispatch}
              isParentPanelVertical={shouldBeVertical()}
            />
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
