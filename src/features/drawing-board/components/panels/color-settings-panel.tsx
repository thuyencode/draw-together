/* eslint-disable jsx-a11y/label-has-associated-control */
import { ColorPicker, parseColor } from "@ark-ui/solid/color-picker";
import {
  ArrowDownLeftIcon,
  GripVerticalIcon,
  MinusIcon,
  PipetteIcon,
  XIcon,
} from "lucide-solid";
import { Index, createSignal, onMount } from "solid-js";
import { createPosition } from "../../hooks";
import type { ColorPickerColorFormat } from "@ark-ui/solid/color-picker";
import type {
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithSettings,
  Size,
} from "../../types";
import { FloatingPanel } from "~/features/shared/components/ui";

type ColorSettingsPanelsProps = PropsWithContainerRef &
  PropsWithDefaultPosition &
  PropsWithSettings;

const MIN_WIDTH = 250;
const MIN_HEIGHT = 375;
const DEFAULT_COLOR_FORMAT = "rgba" as const satisfies ColorPickerColorFormat;
const COLOR_FORMATS: ColorPickerColorFormat[] = ["rgba", "hsla", "hsba"];

export function ColorSettingsPanels(props: ColorSettingsPanelsProps) {
  const [isPolyfillLoading, setIsPolyfillLoading] = createSignal(true);
  const [size, setSize] = createSignal<Size>({
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
  });
  const [position, setPosition] = createPosition(
    props.defaultPosition,
    () => props.containerRef,
    size,
  );
  const [colorFormat, setColorFormat] =
    createSignal<ColorPickerColorFormat>(DEFAULT_COLOR_FORMAT);

  onMount(() => {
    setIsPolyfillLoading(true);

    if ("EyeDropper" in window) {
      setIsPolyfillLoading(false);
      return;
    }

    import("eyedropper-polyfill")
      .then(() => setIsPolyfillLoading(false))
      .catch((error) => console.error(error));
  });

  return (
    <FloatingPanel.Root
      defaultOpen
      strategy="absolute"
      position={position()}
      onPositionChange={(p) => setPosition(p.position)}
      size={size()}
      onSizeChange={function handleSizeChange(detail) {
        const width =
          detail.size.width <= MIN_WIDTH ? MIN_WIDTH : detail.size.width;
        const height =
          detail.size.height <= MIN_HEIGHT ? MIN_HEIGHT : detail.size.height;
        setSize({ width, height });
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
            <FloatingPanel.Header>
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

          <FloatingPanel.Body>
            <ColorPicker.Root
              class="text-base-content flex w-full flex-col gap-5 p-2"
              inline
              value={parseColor(props.settings.color)}
              onValueChange={function handleColorChange(detail) {
                props.setSettings((prev) => ({
                  ...prev,
                  color: detail.valueAsString,
                }));
              }}
              format={colorFormat()}
            >
              <ColorPicker.HiddenInput />

              <ColorPicker.Area class="relative h-40 touch-none overflow-hidden rounded-md">
                <ColorPicker.AreaBackground class="rounded-inherit h-full w-full" />
                <ColorPicker.AreaThumb class="size-3 translate-x-[-50%] translate-y-[-50%] rounded-full shadow-[0_0_0_2px_white,0_0_0_3px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.15)] outline-none focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_oklch(var(--p)),0_1px_3px_rgba(0,0,0,0.15)]" />
              </ColorPicker.Area>

              <div class="flex items-center gap-3">
                <ColorPicker.EyeDropperTrigger
                  class="btn btn-sm btn-square [&_svg]:size-4"
                  disabled={isPolyfillLoading()}
                >
                  <PipetteIcon />
                </ColorPicker.EyeDropperTrigger>

                <div class="flex flex-1 flex-col gap-2.5">
                  <ColorPicker.ChannelSlider
                    class="relative h-2.5 flex-1 rounded"
                    channel="hue"
                  >
                    <ColorPicker.ChannelSliderTrack class="h-2.5 rounded" />
                    <ColorPicker.ChannelSliderThumb class="size-3 translate-x-[-50%] translate-y-[-50%] rounded-full shadow-[0_0_0_2px_white,0_0_0_3px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.15)] outline-none focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_oklch(var(--p)),0_1px_3px_rgba(0,0,0,0.15)]" />
                  </ColorPicker.ChannelSlider>

                  <ColorPicker.ChannelSlider
                    class="relative h-2.5 flex-1 rounded"
                    channel="alpha"
                  >
                    <ColorPicker.TransparencyGrid class="rounded-inherit h-full w-full" />
                    <ColorPicker.ChannelSliderTrack class="h-2.5 rounded" />
                    <ColorPicker.ChannelSliderThumb class="size-3 translate-x-[-50%] translate-y-[-50%] rounded-full shadow-[0_0_0_2px_white,0_0_0_3px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.15)] outline-none focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_oklch(var(--p)),0_1px_3px_rgba(0,0,0,0.15)]" />
                  </ColorPicker.ChannelSlider>
                </div>
              </div>

              <div class="space-y-3">
                <label class="floating-label">
                  <span class="text-sm">Color format</span>
                  <select
                    class="select select-sm uppercase"
                    value={colorFormat()}
                    onChange={function handleColorFormatChange(e) {
                      setColorFormat(e.target.value as ColorPickerColorFormat);
                    }}
                  >
                    <option disabled>Pick a format</option>
                    <Index each={COLOR_FORMATS}>
                      {(format) => (
                        <option value={format()}>
                          {format().toUpperCase()}
                        </option>
                      )}
                    </Index>
                  </select>
                </label>

                <label class="floating-label">
                  <span class="text-sm">Color</span>
                  <ColorPicker.ChannelInput
                    class="input input-sm"
                    channel="css"
                  />
                </label>
              </div>
            </ColorPicker.Root>
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
