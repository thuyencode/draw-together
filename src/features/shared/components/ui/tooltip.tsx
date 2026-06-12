import { Tooltip as BaseTooltip } from "@ark-ui/solid";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";

function TooltipPositioner(_props: BaseTooltip.PositionerProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return <BaseTooltip.Positioner class={cn("z-50", props.class)} {...rest} />;
}

function TooltipArrow(_props: BaseTooltip.ArrowProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseTooltip.Arrow
      class={cn(
        "fill-background-100 [&>path:last-of-type]:stroke-tooltip-border",
        props.class,
      )}
      {...rest}
    />
  );
}

function TooltipArrowTip(_props: BaseTooltip.ArrowTipProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseTooltip.ArrowTip
      class={cn("fill-background-100", props.class)}
      {...rest}
    />
  );
}

function TooltipContent(_props: BaseTooltip.ContentProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseTooltip.Content
      class={cn(
        "relative max-w-80 z-50 bg-background-100 text-tooltip-text px-3 py-2 rounded-lg border border-tooltip-border font-medium text-xs leading-5 shadow-md data-[state='open']:animate-[scale-fade-in_0.15s_ease-out] data-[state='closed']:animate-[scale-fade-out_0.1s_ease-in] transform-origin-[var(--transform-origin)]",
        props.class,
      )}
      {...rest}
    />
  );
}

export const Tooltip = {
  Root: BaseTooltip.Root,
  Trigger: BaseTooltip.Trigger,
  Positioner: TooltipPositioner,
  Arrow: TooltipArrow,
  ArrowTip: TooltipArrowTip,
  Content: TooltipContent,
};
