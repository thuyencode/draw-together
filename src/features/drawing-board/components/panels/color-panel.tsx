/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  ColorPickerSwatchGroup,
  ColorPickerSwatchTrigger,
  parseColor,
} from "@ark-ui/solid/color-picker";
import {
  ArrowDownLeftIcon,
  ArrowRightLeftIcon,
  CheckIcon,
  GripVerticalIcon,
  PipetteIcon,
  XIcon,
} from "lucide-solid";
import { For, Index, createSignal, onMount } from "solid-js";
import { DEFAULT_COLORS } from "../../constants";
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
  PropsWithSettings & {
    swapColors: () => void;
  };

const MIN_WIDTH = 250;
const MIN_HEIGHT = 485;
const DEFAULT_COLOR_FORMAT: ColorPickerColorFormat = "rgba";
const COLOR_FORMATS: ColorPickerColorFormat[] = ["rgba", "hsla", "rgba"];
const MAX_SWATCHES = 12;

export function ColorPanels(props: ColorSettingsPanelsProps) {
  const [isPolyfillLoading, setIsPolyfillLoading] = createSignal(true);
  const [colorFormat, setColorFormat] =
    createSignal<ColorPickerColorFormat>(DEFAULT_COLOR_FORMAT);
  const [swatches, setSwatches] = createSignal<string[]>([]);
  const [size, setSize] = createSignal<Size>({
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
  });
  const [position, setPosition] = createPosition(
    props.defaultPosition,
    () => props.containerRef,
    size,
  );

  onMount(() => {
    setIsPolyfillLoading(true);

    if ("EyeDropper" in window) {
      setIsPolyfillLoading(false);
      return;
    }

    import("eyedropper-polyfill")
      .then(() => setIsPolyfillLoading(false))
      .catch((error) => {
        console.error(error);
        setIsPolyfillLoading(true);
      });
  });

  return (
    <FloatingPanel.Root
      defaultOpen
      strategy="absolute"
      position={position()}
      onPositionChange={function handlePositionChange(p) {
        setPosition(p.position);
      }}
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
              class=""
              value={parseColor(props.settings.colors[0])}
              onValueChange={function handleColorChange(detail) {
                props.setSettings((prev) => ({
                  ...prev,
                  colors: [detail.valueAsString, prev.colors[1]],
                }));
              }}
              onValueChangeEnd={function handleColorChangeEnded() {
                setSwatches((prev) => {
                  const lastColor = props.settings.colors[0];
                  if (prev.includes(lastColor)) {
                    return prev;
                  }

                  return [lastColor, ...prev].slice(0, MAX_SWATCHES);
                });
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

              <div class="flex min-h-13 flex-row place-content-between">
                <button
                  class="relative aspect-square"
                  onClick={function handleOnSwapColorsBtnClick() {
                    props.swapColors();
                  }}
                >
                  <div
                    class="btn btn-square btn-sm absolute top-0 left-0 z-10 shadow-none"
                    style={{ "--btn-color": props.settings.colors[0] }}
                  />
                  <div
                    class="btn btn-square btn-sm absolute right-0 bottom-0 z-0 shadow-none"
                    style={{ "--btn-color": props.settings.colors[1] }}
                  />

                  <ArrowRightLeftIcon class="absolute bottom-0 left-0 size-3.5" />
                </button>

                <ColorPickerSwatchGroup class="grid grid-cols-6 grid-rows-2 gap-1">
                  <For each={swatches()}>
                    {(color) => (
                      <ColorPicker.SwatchTrigger value={color} class="btn-xs">
                        <CheckIcon />
                      </ColorPicker.SwatchTrigger>
                    )}
                  </For>
                </ColorPickerSwatchGroup>
              </div>

              <div class="mt-2 space-y-3">
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

              <button
                type="button"
                class="btn btn-soft btn-secondary"
                onClick={function resetColors() {
                  setSwatches([]);
                  props.setSettings((prev) => ({
                    ...prev,
                    colors: DEFAULT_COLORS,
                  }));
                }}
              >
                Reset
              </button>
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
