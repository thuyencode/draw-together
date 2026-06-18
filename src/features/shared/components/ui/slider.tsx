import { Slider as BaseSlider } from "@ark-ui/solid";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type {
  SliderControlProps,
  SliderLabelProps,
  SliderMarkerGroupProps,
  SliderMarkerProps,
  SliderRangeProps,
  SliderRootProps,
  SliderThumbProps,
  SliderTrackProps,
  SliderValueTextProps,
} from "@ark-ui/solid";

function SliderRoot(_props: SliderRootProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSlider.Root
      class={cn(
        "flex w-64 max-w-[calc(100%-10px)] flex-col gap-6 font-sans data-disabled:cursor-not-allowed data-disabled:opacity-50",
        props.class,
      )}
      {...rest}
    />
  );
}

function SliderLabel(_props: SliderLabelProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseSlider.Label
      class={cn("text-text-50 text-sm font-medium", props.class)}
      {...rest}
    />
  );
}

function SliderValueText(_props: SliderValueTextProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseSlider.ValueText
      class={cn("text-tooltip-text text-sm", props.class)}
      {...rest}
    />
  );
}

function SliderControl(_props: SliderControlProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseSlider.Control
      class={cn(
        "group relative flex h-5 cursor-pointer items-center data-disabled:cursor-not-allowed",
        props.class,
      )}
      {...rest}
    />
  );
}

function SliderTrack(_props: SliderTrackProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseSlider.Track
      class={cn(
        "h-1.5 w-full rounded-full bg-(--border-color-base-50)",
        props.class,
      )}
      {...rest}
    />
  );
}

function SliderRange(_props: SliderRangeProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseSlider.Range
      class={cn("bg-primary-500 h-1.5 rounded-full", props.class)}
      {...rest}
    />
  );
}

function SliderThumb(_props: SliderThumbProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseSlider.Thumb
      class={cn(
        "border-primary-500 bg-white-100 size-5 rounded-full border-2 transition-shadow duration-150 outline-none",
        "hover:ring-primary-500/20 hover:cursor-grab hover:ring-4",
        "data-dragging:bg-primary-500 data-dragging:cursor-grabbing data-dragging:ring-0",
        "data-focus-visible:ring-primary-500/20 data-focus-visible:ring-4",
        "data-disabled:pointer-events-none data-disabled:border-(--border-color-base-300)",
        props.class,
      )}
      {...rest}
    />
  );
}

function SliderMarkerGroup(_props: SliderMarkerGroupProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseSlider.MarkerGroup
      class={cn("mt-2 flex justify-between", props.class)}
      {...rest}
    />
  );
}

function SliderMarker(_props: SliderMarkerProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseSlider.Marker
      class={cn(
        "text-text-100 flex flex-col items-center gap-0.5 text-xs leading-4",
        "before:block before:size-1 before:rounded-full before:bg-(--border-color-base-100)",
        "data-[state='under-value']:before:bg-primary-500 data-[state='at-value']:before:bg-primary-500",
        props.class,
      )}
      {...rest}
    />
  );
}

export const Slider = {
  Root: SliderRoot,
  Label: SliderLabel,
  ValueText: SliderValueText,
  Control: SliderControl,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
  MarkerGroup: SliderMarkerGroup,
  Marker: SliderMarker,
  HiddenInput: BaseSlider.HiddenInput,
};
