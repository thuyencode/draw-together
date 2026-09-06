import { parseColor } from "@ark-ui/solid/color-picker";
import {
  ArrowBigDownDash,
  ArrowBigUpDash,
  ArrowDownLeftIcon,
  ArrowRightLeftIcon,
  CheckIcon,
  GripVerticalIcon,
  PipetteIcon,
  XIcon,
} from "lucide-solid";
import { Index, Match, Show, Switch, createSignal, onMount } from "solid-js";
import { DEFAULT_COLORS } from "../../constants";
import { createPosition } from "../../hooks";
import { generateRandomColor } from "../../utils";
import type { ColorPickerColorFormat } from "@ark-ui/solid/color-picker";
import type {
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithSettings,
  Size,
} from "../../types";
import { ColorPicker, FloatingPanel } from "~/features/shared/components/ui";
import { m } from "~/paraglide/messages";

type ColorSettingsPanelsProps = PropsWithContainerRef &
  PropsWithDefaultPosition &
  PropsWithSettings & {
    swapColors: () => void;
  };

const MIN_WIDTH = 245;
const MIN_HEIGHT = 370;
const MIN_EXPANDED_HEIGHT = 470;
const DEFAULT_COLOR_FORMAT: ColorPickerColorFormat = "rgba";
const COLOR_FORMATS: ColorPickerColorFormat[] = ["rgba", "hsla", "rgba"];
const MAX_SWATCHES = 12;
const DEFAULT_SWATCHES = Array.from({ length: MAX_SWATCHES }).map(
  generateRandomColor,
);

export function ColorPanels(props: ColorSettingsPanelsProps) {
  const [isPolyfillLoading, setIsPolyfillLoading] = createSignal(true);
  const [colorFormat, setColorFormat] =
    createSignal<ColorPickerColorFormat>(DEFAULT_COLOR_FORMAT);
  const [swatches, setSwatches] = createSignal(DEFAULT_SWATCHES);

  const [isExpaned, setIsExpaned] = createSignal(false);
  const minHeight = () => (isExpaned() ? MIN_EXPANDED_HEIGHT : MIN_HEIGHT);

  const [size, setSize] = createSignal<Size>({
    width: MIN_WIDTH,
    height: minHeight(),
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

  const handleExpand = () => {
    const expanded = !isExpaned();
    const height = expanded ? MIN_EXPANDED_HEIGHT : MIN_HEIGHT;
    setIsExpaned(expanded);
    setSize((prev) => ({ ...prev, height }));
  };

  return (
    <FloatingPanel.Root
      defaultOpen
      minSize={{
        width: MIN_WIDTH,
        height: minHeight(),
      }}
      strategy="absolute"
      position={position()}
      onPositionChange={function handlePositionChange(detail) {
        setPosition(detail.position);
      }}
      size={size()}
      onSizeChange={function handleSizeChange(detail) {
        setSize(detail.size);
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
                {m.colorPicker_title()}
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
              value={parseColor(props.settings.colors[0])}
              onValueChange={function handleColorChange(detail) {
                props.setSettings("colors", 0, detail.valueAsString);
              }}
              onValueChangeEnd={function handleColorChangeEnded(detail) {
                const color = detail.valueAsString;
                if (swatches().includes(color)) return;
                setSwatches((prev) => [color, ...prev].slice(0, MAX_SWATCHES));
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

              <div class="flex min-h-13 flex-row gap-1">
                <button
                  class="relative aspect-square"
                  onClick={function handleOnSwapColorsBtnClick() {
                    props.swapColors();
                  }}
                >
                  <Index each={props.settings.colors}>
                    {(color, index) => (
                      <div
                        class="btn btn-square btn-sm border-base-content absolute border shadow-none"
                        classList={{
                          "top-0 left-0": index === 0,
                          "right-0 bottom-0": index === 1,
                        }}
                        style={{ "--btn-color": color() }}
                      />
                    )}
                  </Index>

                  <ArrowRightLeftIcon class="absolute bottom-0 left-0 size-3.5" />
                </button>

                <ColorPicker.SwatchGroup class="grid grid-cols-6 grid-rows-2 gap-1 *:self-center *:justify-self-end">
                  <Index each={swatches()}>
                    {(color) => (
                      <ColorPicker.SwatchTrigger value={color()} class="btn-xs">
                        <CheckIcon />
                      </ColorPicker.SwatchTrigger>
                    )}
                  </Index>
                </ColorPicker.SwatchGroup>
              </div>

              <Show when={isExpaned()}>
                <div class="mt-2 space-y-3">
                  <label class="floating-label">
                    <span class="text-sm">{m.colorPicker_colorFormat()}</span>
                    <select
                      class="select select-sm uppercase"
                      value={colorFormat()}
                      onChange={function handleColorFormatChange(e) {
                        setColorFormat(
                          e.target.value as ColorPickerColorFormat,
                        );
                      }}
                    >
                      <option disabled>{m.colorPicker_pickFormat()}</option>
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
                    <span class="text-sm">{m.colorPicker_color()}</span>
                    <ColorPicker.ChannelInput channel="css" />
                  </label>
                </div>
              </Show>

              <Switch>
                <Match when={isExpaned()}>
                  <div class="flex gap-1">
                    <button
                      type="button"
                      class="btn btn-soft btn-primary btn-sm flex-1/2"
                      onClick={function handleResetColors() {
                        setSwatches(DEFAULT_SWATCHES);
                        props.setSettings("colors", DEFAULT_COLORS);
                      }}
                    >
                      {m.colorPicker_reset()}
                    </button>
                    <button
                      type="button"
                      class="btn btn-soft btn-sm flex-1/2"
                      onClick={handleExpand}
                    >
                      {m.colorPicker_showLess()}
                      <ArrowBigUpDash />
                    </button>
                  </div>
                </Match>

                <Match when={!isExpaned()}>
                  <button
                    type="button"
                    class="btn btn-soft btn-primary btn-sm"
                    onClick={handleExpand}
                  >
                    {m.colorPicker_showMore()}
                    <ArrowBigDownDash />
                  </button>
                </Match>
              </Switch>
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
