/* eslint-disable jsx-a11y/label-has-associated-control */
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
import {
  For,
  Index,
  Match,
  Show,
  Switch,
  createSignal,
  onMount,
} from "solid-js";
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

const MIN_WIDTH = 245;
const MIN_HEIGHT = 370;
const MIN_EXPANDED_HEIGHT = 470;
const DEFAULT_COLOR_FORMAT: ColorPickerColorFormat = "rgba";
const COLOR_FORMATS: ColorPickerColorFormat[] = ["rgba", "hsla", "rgba"];
const MAX_SWATCHES = 12;
const DEFAULT_SWATCHES = Array.from<string>({ length: MAX_SWATCHES }).fill(
  "#fff",
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
                Color Picker
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
                props.setSettings("colors", [
                  detail.valueAsString,
                  props.settings.colors[1],
                ]);
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

              <div class="flex min-h-13 flex-row gap-1">
                <button
                  class="relative aspect-square"
                  onClick={function handleOnSwapColorsBtnClick() {
                    props.swapColors();
                  }}
                >
                  <div
                    class="btn btn-square btn-sm absolute top-0 left-0 z-10 border-2 shadow-none"
                    style={{ "--btn-color": props.settings.colors[0] }}
                  />
                  <div
                    class="btn btn-square btn-sm absolute right-0 bottom-0 z-0 border-2 shadow-none"
                    style={{ "--btn-color": props.settings.colors[1] }}
                  />

                  <ArrowRightLeftIcon class="absolute bottom-0 left-0 size-3.5" />
                </button>

                <ColorPicker.SwatchGroup class="grid grid-cols-6 grid-rows-2 gap-1 *:self-center *:justify-self-end">
                  <For each={swatches()}>
                    {(color) => (
                      <ColorPicker.SwatchTrigger value={color} class="btn-xs">
                        <CheckIcon />
                      </ColorPicker.SwatchTrigger>
                    )}
                  </For>
                </ColorPicker.SwatchGroup>
              </div>

              <Show when={isExpaned()}>
                <div class="mt-2 space-y-3">
                  <label class="floating-label">
                    <span class="text-sm">Color format</span>
                    <select
                      class="select select-sm uppercase"
                      value={colorFormat()}
                      onChange={function handleColorFormatChange(e) {
                        setColorFormat(
                          e.target.value as ColorPickerColorFormat,
                        );
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
                      Reset
                    </button>
                    <button
                      type="button"
                      class="btn btn-soft btn-sm flex-1/2"
                      onClick={handleExpand}
                    >
                      Show less
                      <ArrowBigUpDash class="size-4" />
                    </button>
                  </div>
                </Match>

                <Match when={!isExpaned()}>
                  <button
                    type="button"
                    class="btn btn-soft btn-primary btn-sm"
                    onClick={handleExpand}
                  >
                    Show more
                    <ArrowBigDownDash class="size-4" />
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
