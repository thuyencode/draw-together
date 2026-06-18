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
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithDispatch,
  PropsWithTool,
  Size,
} from "./types";
import { Field, FloatingPanel } from "~/features/shared/components/ui";

type ToolSettingsPanelsProps = PropsWithTool &
  PropsWithContainerRef &
  PropsWithDefaultPosition &
  PropsWithDispatch & {
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
      <FloatingPanel.Positioner>
        <FloatingPanel.Content>
          <FloatingPanel.DragTrigger>
            <FloatingPanel.Header>
              <FloatingPanel.Title class="capitalize">
                <GripVerticalIcon />
                {props.tool} Settings
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
            <Field.Root>
              <Field.Label>Stroke size</Field.Label>
              <Field.Input
                class="rounded py-1"
                type="number"
                min="1"
                step="1"
                value={props.settings.strokeWidth}
                onInput={(e) => {
                  props.dispatch({
                    type: "set_stroke_width",
                    strokeWidth: Number.parseInt(e.target.value, 10),
                  });
                }}
              />
            </Field.Root>
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
