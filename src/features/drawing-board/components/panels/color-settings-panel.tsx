/* eslint-disable jsx-a11y/label-has-associated-control */
import { parseColor } from "@ark-ui/solid/color-picker";
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
import { ColorPicker, FloatingPanel } from "~/features/shared/components/ui";

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
              <FloatingPanel.Title>
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
              <ColorPicker.Area>
                <ColorPicker.AreaBackground />
                <ColorPicker.AreaThumb />
              </ColorPicker.Area>

              <div class="flex items-center gap-3">
                <ColorPicker.EyeDropperTrigger disabled={isPolyfillLoading()}>
                  <PipetteIcon />
                </ColorPicker.EyeDropperTrigger>

                <div class="flex flex-1 flex-col gap-2.5">
                  <ColorPicker.ChannelSlider channel="hue">
                    <ColorPicker.ChannelSliderTrack />
                    <ColorPicker.ChannelSliderThumb />
                  </ColorPicker.ChannelSlider>

                  <ColorPicker.ChannelSlider channel="alpha">
                    <ColorPicker.TransparencyGrid />
                    <ColorPicker.ChannelSliderTrack />
                    <ColorPicker.ChannelSliderThumb />
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
                  <ColorPicker.ChannelInput channel="css" />
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
