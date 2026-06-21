import {
  ArrowDownLeftIcon,
  GripVerticalIcon,
  MinusIcon,
  XIcon,
} from "lucide-solid";
import { createSignal } from "solid-js";
import { createPosition } from "./hooks";
import type {
  DrawingSettings,
  PropsWithCommands,
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithTool,
  Size,
} from "./types";
import { FloatingPanel } from "~/features/shared/components/ui";

type ToolSettingsPanelsProps = PropsWithTool &
  PropsWithContainerRef &
  PropsWithDefaultPosition &
  PropsWithCommands & {
    settings: DrawingSettings;
  };

export function ToolSettingsPanels(props: ToolSettingsPanelsProps) {
  const [size, setSize] = createSignal<Size>({ width: 300, height: 240 });
  const [position, setPosition] = createPosition(
    props.defaultPosition,
    () => props.containerRef,
    size,
  );

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
      <FloatingPanel.Positioner
        initialStyle={{
          "--x": "20px",
          "--y": "20px",
        }}
      >
        <FloatingPanel.Content>
          <FloatingPanel.DragTrigger>
            <FloatingPanel.Header>
              <FloatingPanel.Title class="capitalize">
                <GripVerticalIcon />
                {props.variant} Settings
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

          <FloatingPanel.Body class="p-2">
            <label class="input">
              <span class="text-neutral-500">Stroke size</span>
              <input
                type="number"
                class="grow"
                min="1"
                step="1"
                value={props.settings.strokeWidth}
                onChange={(e) => {
                  props.commands.setStrokeWidth(
                    Number.parseInt(e.target.value, 10),
                  );
                }}
              />
              <span class="badge badge-info badge-xs">px</span>
            </label>
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
