import {
  ColorPickerArea as BaseColorPickerArea,
  ColorPickerAreaBackground as BaseColorPickerAreaBackground,
  ColorPickerAreaThumb as BaseColorPickerAreaThumb,
  ColorPickerChannelInput as BaseColorPickerChannelInput,
  ColorPickerChannelSlider as BaseColorPickerChannelSlider,
  ColorPickerChannelSliderThumb as BaseColorPickerChannelSliderThumb,
  ColorPickerChannelSliderTrack as BaseColorPickerChannelSliderTrack,
  ColorPickerEyeDropperTrigger as BaseColorPickerEyeDropperTrigger,
  ColorPickerRoot as BaseColorPickerRoot,
  ColorPickerSwatchGroup as BaseColorPickerSwatchGroup,
  ColorPickerSwatchTrigger as BaseColorPickerSwatchTrigger,
  ColorPickerTransparencyGrid as BaseColorPickerTransparencyGrid,
} from "@ark-ui/solid/color-picker";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type { ColorPicker as BaseColorPicker } from "@ark-ui/solid/color-picker";

function ColorPickerRoot(_props: BaseColorPicker.RootProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseColorPickerRoot
      class={cn(
        "text-base-content flex w-full flex-col gap-3 p-2",
        props.class,
      )}
      {...rest}
    />
  );
}

function ColorPickerArea(_props: BaseColorPicker.AreaProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseColorPickerArea
      class={cn(
        "relative h-40 touch-none overflow-hidden rounded-md",
        props.class,
      )}
      {...rest}
    />
  );
}

function ColorPickerAreaBackground(
  _props: BaseColorPicker.AreaBackgroundProps,
) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseColorPickerAreaBackground
      class={cn("rounded-inherit h-full w-full", props.class)}
      {...rest}
    />
  );
}

function ColorPickerAreaThumb(_props: BaseColorPicker.AreaThumbProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseColorPickerAreaThumb
      class={cn(
        "size-3 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full shadow-[0_0_0_2px_white,0_0_0_3px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.15)] outline-none focus-visible:shadow-[0_0_0_2px_white,0_0_0_3px_var(--color-info-content),0_1px_3px_rgba(0,0,0,0.15)]",
        props.class,
      )}
      {...rest}
    />
  );
}

function ColorPickerChannelSlider(_props: BaseColorPicker.ChannelSliderProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseColorPickerChannelSlider
      class={cn("relative h-2.5 flex-1 rounded", props.class)}
      {...rest}
    />
  );
}

function ColorPickerChannelSliderTrack(
  _props: BaseColorPicker.ChannelSliderTrackProps,
) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseColorPickerChannelSliderTrack
      class={cn("h-2.5 rounded", props.class)}
      {...rest}
    />
  );
}

function ColorPickerChannelSliderThumb(
  _props: BaseColorPicker.ChannelSliderThumbProps,
) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseColorPickerChannelSliderThumb
      class={cn(
        "size-3 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full shadow-[0_0_0_2px_white,0_0_0_3px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.15)] outline-none focus-visible:shadow-[0_0_0_2px_white,0_0_0_3px_var(--color-info-content),0_1px_3px_rgba(0,0,0,0.15)]",
        props.class,
      )}
      {...rest}
    />
  );
}

function ColorPickerChannelInput(_props: BaseColorPicker.ChannelInputProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseColorPickerChannelInput
      class={cn("input input-sm", props.class)}
      {...rest}
    />
  );
}

function ColorPickerTransparencyGrid(
  _props: BaseColorPicker.TransparencyGridProps,
) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseColorPickerTransparencyGrid
      class={cn("rounded-inherit text-base-content h-full w-full", props.class)}
      {...rest}
    />
  );
}

function ColorPickerEyeDropperTrigger(
  _props: BaseColorPicker.EyeDropperTriggerProps,
) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseColorPickerEyeDropperTrigger
      class={cn("btn btn-sm btn-square [&_svg]:size-4", props.class)}
      {...rest}
    />
  );
}

function ColorPickerSwatchTrigger(_props: BaseColorPicker.SwatchTriggerProps) {
  const [props, rest] = splitProps(_props, ["class", "value"]);

  return (
    <BaseColorPickerSwatchTrigger
      class={cn(
        "btn btn-square btn-neutral border-2 [&_svg]:size-3 data-[state=unchecked]:[&_svg]:hidden",
        props.class,
      )}
      style={{ "--btn-color": props.value.toString() }}
      value={props.value}
      {...rest}
    />
  );
}

export const ColorPicker = {
  Root: ColorPickerRoot,
  Area: ColorPickerArea,
  AreaBackground: ColorPickerAreaBackground,
  AreaThumb: ColorPickerAreaThumb,
  ChannelSlider: ColorPickerChannelSlider,
  ChannelSliderTrack: ColorPickerChannelSliderTrack,
  ChannelSliderThumb: ColorPickerChannelSliderThumb,
  ChannelInput: ColorPickerChannelInput,
  TransparencyGrid: ColorPickerTransparencyGrid,
  EyeDropperTrigger: ColorPickerEyeDropperTrigger,
  SwatchGroup: BaseColorPickerSwatchGroup,
  SwatchTrigger: ColorPickerSwatchTrigger,
};
