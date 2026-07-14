import {
  ArrowDownLeftIcon,
  EraserIcon,
  GripVerticalIcon,
  MousePointerIcon,
  RedoIcon,
  RotateCwIcon,
  UndoIcon,
  XIcon,
} from "lucide-solid";
import { Index, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { createPosition } from "../../hooks";
import { BrushToolMenu, ShapeToolMenu } from "../menu";
import { ToolButton } from "../ui";
import type {
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithSettings,
  Size,
  ToolConfig,
} from "../../types";
import type { LucideIcon } from "lucide-solid";
import { FloatingPanel } from "~/features/shared/components/ui";

const MIN_WIDTH = 45;
const MIN_HEIGHT = 320;
const MIN_WIDTH_THRESHOLD = 100;

type ToolItem = ToolConfig & {
  label: string;
  icon: LucideIcon;
};

const tools: ToolItem[] = [
  {
    tool: "select",
    variant: "select",
    label: "Select",
    icon: MousePointerIcon,
  },
  {
    tool: "eraser",
    variant: "plain",
    label: "Eraser",
    icon: EraserIcon,
  },
];

type ToolsPanelProps = PropsWithSettings &
  PropsWithContainerRef &
  PropsWithDefaultPosition & {
    isUndoAvailable: boolean;
    isRedoAvailable: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onReset: () => void;
  };

export function ToolsPanel(props: ToolsPanelProps) {
  const [size, setSize] = createSignal<Size>({
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
  });
  const [position, setPosition] = createPosition(
    props.defaultPosition,
    () => props.containerRef,
    size,
  );

  const shouldBeVertical = () => size().width <= MIN_WIDTH_THRESHOLD;

  return (
    <FloatingPanel.Root
      defaultOpen
      strategy="absolute"
      position={position()}
      onPositionChange={function handlePositionChange(p) {
        setPosition(p.position);
      }}
      size={size()}
      onSizeChange={function handleSizeChange(e) {
        const isVertical = e.size.width <= MIN_WIDTH_THRESHOLD;
        setSize({
          width: isVertical ? MIN_WIDTH : e.size.width,
          height: isVertical
            ? Math.max(e.size.height, MIN_HEIGHT)
            : e.size.height,
        });
      }}
    >
      <FloatingPanel.Positioner
        ssrStyle={{
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
                <FloatingPanel.StageTrigger stage="default">
                  <ArrowDownLeftIcon />
                </FloatingPanel.StageTrigger>
                <FloatingPanel.CloseTrigger>
                  <XIcon />
                </FloatingPanel.CloseTrigger>
              </FloatingPanel.Control>
            </FloatingPanel.Header>
          </FloatingPanel.DragTrigger>

          <FloatingPanel.Body
            class="flex-none flex-row flex-wrap gap-1"
            classList={{ "justify-center": shouldBeVertical() }}
          >
            <Index each={tools}>
              {(t) => (
                <ToolButton
                  type="button"
                  data-current-tool={
                    t().tool === props.settings.tool &&
                    t().variant === props.settings.variant
                  }
                  onClick={() =>
                    // @ts-ignore - The ToolConfig type is already satisfied but the TS compiler doesn't know that
                    // eslint-disable-next-line solid/reactivity
                    props.setSettings((prev) => ({
                      ...prev,
                      tool: t().tool,
                      variant: t().variant,
                    }))
                  }
                >
                  <Dynamic component={t().icon} />
                  <span class="sr-only">{t().label}</span>
                </ToolButton>
              )}
            </Index>

            <BrushToolMenu
              settings={props.settings}
              setSettings={props.setSettings}
              isParentPanelVertical={shouldBeVertical()}
            />

            <ShapeToolMenu
              settings={props.settings}
              setSettings={props.setSettings}
              isParentPanelVertical={shouldBeVertical()}
            />

            <ToolButton
              type="button"
              disabled={!props.isUndoAvailable}
              onClick={props.onUndo}
            >
              <UndoIcon />
              <span class="sr-only">Undo</span>
            </ToolButton>

            <ToolButton
              type="button"
              disabled={!props.isRedoAvailable}
              onClick={props.onRedo}
            >
              <RedoIcon />
              <span class="sr-only">Redo</span>
            </ToolButton>

            <ToolButton type="button" onClick={props.onReset}>
              <RotateCwIcon />
              <span class="sr-only">Clear</span>
            </ToolButton>
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
