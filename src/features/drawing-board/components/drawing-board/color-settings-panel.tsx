import type { Size } from "@zag-js/rect-utils";
import {
  ArrowDownLeftIcon,
  GripVerticalIcon,
  MinusIcon,
  XIcon,
} from "lucide-solid";
import { SketchPicker } from "solid-color";
import { createSignal } from "solid-js";
import { FloatingPanel } from "~/features/shared/components/ui";
import { createPosition } from "./hooks";
import type {
  DrawingState,
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithDispatch,
} from "./types";

type ColorSettingsPanelsProps = PropsWithContainerRef &
  PropsWithDefaultPosition &
  PropsWithDispatch & {
    drawingState: DrawingState;
  };

export function ColorSettingsPanels(props: ColorSettingsPanelsProps) {
  const [size, setSize] = createSignal<Size>({ width: 250, height: 380 });
  const [position, setPosition] = createPosition(
    props.defaultPosition,
    () => props.containerRef,
    size,
  );

  let floatingPanelHeaderRef!: HTMLDivElement;
  let sketchPickerRef!: HTMLDivElement;

  // SketchPicker has horizontal padding of 10px on each side
  // 2px is total horizontal border width
  const sketchPickerWidth = () => size().width - 20 - 2;

  return (
    <FloatingPanel.Root
      defaultOpen
      strategy="absolute"
      position={position()}
      onPositionChange={(p) => setPosition(p.position)}
      size={size()}
      onSizeChange={(e) => {
        const height =
          floatingPanelHeaderRef.offsetHeight +
          sketchPickerRef.offsetHeight +
          5;

        if (e.size.width <= 250) {
          setSize({ ...e.size, width: 250, height });
        } else {
          setSize({ ...e.size, height });
        }
      }}
    >
      <FloatingPanel.Positioner>
        <FloatingPanel.Content>
          <FloatingPanel.DragTrigger>
            <FloatingPanel.Header ref={floatingPanelHeaderRef}>
              <FloatingPanel.Title class="capitalize">
                <GripVerticalIcon />
                Color Settings
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

          <FloatingPanel.Body
            class="p-0"
            ref={(el) => {
              sketchPickerRef = el.children.item(0) as HTMLDivElement;
            }}
          >
            <SketchPicker
              width={sketchPickerWidth()}
              color={props.drawingState.color}
              onChange={(result) => {
                props.dispatch({ type: "set_color", color: result.hex });
              }}
            />
          </FloatingPanel.Body>

          <FloatingPanel.ResizeTrigger axis="e" />
          <FloatingPanel.ResizeTrigger axis="w" />
          <FloatingPanel.ResizeTrigger axis="ne" />
          <FloatingPanel.ResizeTrigger axis="se" />
          <FloatingPanel.ResizeTrigger axis="sw" />
          <FloatingPanel.ResizeTrigger axis="nw" />
        </FloatingPanel.Content>
      </FloatingPanel.Positioner>
    </FloatingPanel.Root>
  );
}
