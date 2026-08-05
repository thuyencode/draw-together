import {
  SelectContent as BaseSelectContent,
  SelectControl as BaseSelectControl,
  SelectIndicator as BaseSelectIndicator,
  SelectItem as BaseSelectItem,
  SelectItemGroup as BaseSelectItemGroup,
  SelectItemGroupLabel as BaseSelectItemGroupLabel,
  SelectItemIndicator as BaseSelectItemIndicator,
  SelectItemText as BaseSelectItemText,
  SelectPositioner as BaseSelectPositioner,
  SelectRoot as BaseSelectRoot,
  SelectTrigger as BaseSelectTrigger,
  SelectValueText as BaseSelectValueText,
} from "@ark-ui/solid/select";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type { Select as BaseSelect } from "@ark-ui/solid/select";

function SelectRoot<T>(_props: BaseSelect.RootProps<T>) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSelectRoot
      class={cn("text-base-content w-full", props.class)}
      {...rest}
    />
  );
}

function SelectControl(_props: BaseSelect.ControlProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSelectControl
      class={cn("relative flex w-full items-center gap-2", props.class)}
      {...rest}
    />
  );
}

function SelectTrigger(_props: BaseSelect.TriggerProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSelectTrigger
      class={cn(
        "input",
        "data-disabled:opacity-50 data-disabled:grayscale",
        "data-invalid:input-error",
        props.class,
      )}
      {...rest}
    />
  );
}

function SelectValueText(_props: BaseSelect.ValueTextProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSelectValueText
      class={cn(
        "text-base-content/60 data-[state=checked]:text-base-content overflow-hidden text-ellipsis whitespace-nowrap",
        props.class,
      )}
      {...rest}
    />
  );
}

function SelectIndicator(_props: BaseSelect.IndicatorProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSelectIndicator
      class={cn(
        "text-base-content/50 pointer-events-none absolute top-1/2 right-2 flex shrink-0 -translate-y-1/2 items-center justify-center [&_svg]:size-4",
        props.class,
      )}
      {...rest}
    />
  );
}

function SelectPositioner(_props: BaseSelect.PositionerProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSelectPositioner
      class={cn("isolate outline-none [--z-index:9999]", props.class)}
      {...rest}
    />
  );
}

function SelectContent(_props: BaseSelect.ContentProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSelectContent
      class={cn(
        "menu bg-base-100 border-base-content/30 rounded-box relative z-[calc(var(--z-index)+var(--layer-index,0))] max-h-[min(var(--available-height,300px),300px)] min-w-[max(var(--reference-width),10rem)] origin-(--transform-origin) overflow-y-auto border shadow-md",
        "data-[state=closed]:animate-[scale-fade-out_0.1s_ease-in] data-[state=open]:animate-[scale-fade-in_0.15s_ease-out]",
        props.class,
      )}
      {...rest}
    />
  );
}

function SelectItemGroupLabel(_props: BaseSelect.ItemGroupLabelProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSelectItemGroupLabel
      class={cn("menu-title pt-1", props.class)}
      {...rest}
    />
  );
}

function SelectItem(_props: BaseSelect.ItemProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <li>
      <BaseSelectItem
        class={cn(
          "data-highlighted:menu-active data-disabled:menu-disabled",
          props.class,
        )}
        {...rest}
      />
    </li>
  );
}

function SelectItemText(_props: BaseSelect.ItemTextProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSelectItemText
      class={cn("overflow-hidden text-ellipsis whitespace-nowrap", props.class)}
      {...rest}
    />
  );
}

function SelectItemIndicator(_props: BaseSelect.ItemIndicatorProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseSelectItemIndicator
      class={cn(
        "pointer-events-none [&_svg]:ml-auto [&_svg]:size-4",
        props.class,
      )}
      {...rest}
    />
  );
}

export const Select = {
  Root: SelectRoot,
  Control: SelectControl,
  Trigger: SelectTrigger,
  ValueText: SelectValueText,
  Indicator: SelectIndicator,
  Positioner: SelectPositioner,
  Content: SelectContent,
  ItemGroup: BaseSelectItemGroup,
  ItemGroupLabel: SelectItemGroupLabel,
  Item: SelectItem,
  ItemText: SelectItemText,
  ItemIndicator: SelectItemIndicator,
};
