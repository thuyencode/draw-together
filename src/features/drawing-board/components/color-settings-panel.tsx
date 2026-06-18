import iro from "@jaames/iro";
import {
  ArrowDownLeftIcon,
  GripVerticalIcon,
  MinusIcon,
  XIcon,
} from "lucide-solid";
import { createSignal, onMount } from "solid-js";
import { createPosition } from "./hooks";
import type { FloatingPanelSizeChangeDetails } from "@ark-ui/solid";
import type {
  DrawingSettings,
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithDispatch,
  Size,
} from "./types";
import { FloatingPanel } from "~/features/shared/components/ui";

type ColorSettingsPanelsProps = PropsWithContainerRef &
  PropsWithDefaultPosition &
  PropsWithDispatch &
  Pick<DrawingSettings, "color">;

export function ColorSettingsPanels(props: ColorSettingsPanelsProps) {
  const [size, setSize] = createSignal<Size>({ width: 225, height: 350 });
  const [position, setPosition] = createPosition(
    props.defaultPosition,
    () => props.containerRef,
    size,
  );

  let floatingPanelBodyRef!: HTMLDivElement;
  let floatingPanelHeaderRef!: HTMLDivElement;
  let colorPicker: iro.ColorPicker;

  onMount(() => {
    colorPicker = iro.ColorPicker(floatingPanelBodyRef, {
      color: props.color,
      width: size().width - 8 - 1,
      layout: [
        { component: iro.ui.Wheel },
        { component: iro.ui.Slider },
        {
          component: iro.ui.Slider,
          options: { sliderType: "alpha" },
        },
      ],
    });

    const onColorChange = (color: iro.Color) => {
      props.dispatch({
        type: "set_color",
        color: color.rgba,
      });
    };

    colorPicker.on("input:end", onColorChange);
  });

  const handleSizeChange = (e: FloatingPanelSizeChangeDetails) => {
    const height =
      floatingPanelHeaderRef.offsetHeight +
      (colorPicker.base as HTMLDivElement).offsetHeight +
      12;

    const width = e.size.width <= 225 ? 225 : e.size.width;

    setSize({ width, height });

    // Total value of horizontal padding of floating panel body is 8px
    // That 1px is to prevent overflow
    colorPicker.resize(width - 8 - 1);
  };

  return (
    <FloatingPanel.Root
      defaultOpen
      strategy="absolute"
      position={position()}
      onPositionChange={(p) => setPosition(p.position)}
      size={size()}
      onSizeChange={handleSizeChange}
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

          <FloatingPanel.Body ref={floatingPanelBodyRef} />

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
