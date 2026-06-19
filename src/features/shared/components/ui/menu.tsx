import { Menu as BaseMenu } from "@ark-ui/solid/menu";
import { splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { cn } from "../../utils/cn";

function MenuIndicator(_props: BaseMenu.IndicatorProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.Indicator
      class={cn(
        "inline-flex items-center justify-center [&_svg]:size-4",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuPositioner(_props: BaseMenu.PositionerProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <Portal>
      <BaseMenu.Positioner
        class={cn("isolate z-50 outline-none", props.class)}
        {...rest}
      />
    </Portal>
  );
}

function MenuContent(_props: BaseMenu.ContentProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.Content
      class={cn(
        "bg-dropdown-background relative z-[calc(var(--z-index)+var(--layer-index,0))] flex max-h-[min(var(--available-height,300px),300px)] min-w-[max(var(--reference-width),10rem)] origin-(--transform-origin) flex-col rounded-lg border border-neutral-300 p-1 shadow-md outline-none data-[state=closed]:animate-[scale-fade-out_0.1s_ease-in] data-[state=open]:animate-[scale-fade-in_0.15s_ease-out]",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuItem(_props: BaseMenu.ItemProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.Item
      class={cn(
        "text-text-50 data-highlighted:bg-dropdown-hover-background data-disabled:text-text-100 flex min-h-8 items-center gap-2 rounded px-[0.725rem] text-sm leading-5 no-underline outline-none select-none data-disabled:opacity-50",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuItemGroupLabel(_props: BaseMenu.ItemGroupLabelProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.ItemGroupLabel
      class={cn(
        "text-text-100 px-1.5 py-1 text-xs font-medium data-inset:pl-7",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuItemGroup(_props: BaseMenu.ItemGroupProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.ItemGroup
      class={cn("flex flex-col [&+&]:mt-2", props.class)}
      {...rest}
    />
  );
}

function MenuTriggerItem(_props: BaseMenu.TriggerItemProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.TriggerItem
      class={cn(
        "data-highlighted:bg-dropdown-hover-background after:text-text-100 flex min-h-8 items-center justify-between gap-2 rounded px-[0.725rem] text-sm leading-5 outline-none select-none after:text-base after:content-['›']",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuCheckboxItem(_props: BaseMenu.CheckboxItemProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.CheckboxItem
      class={cn(
        "data-highlighted:bg-dropdown-hover-background data-[state=checked]:text-primary-500 data-disabled:text-text-100 flex items-center gap-2 rounded p-2 text-sm leading-5 outline-none select-none data-disabled:opacity-50",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuRadioItemGroup(_props: BaseMenu.RadioItemGroupProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.RadioItemGroup
      class={cn("flex flex-col [&+&]:mt-2", props.class)}
      {...rest}
    />
  );
}

function MenuRadioItem(_props: BaseMenu.RadioItemProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.RadioItem
      class={cn(
        "data-highlighted:bg-dropdown-hover-background data-[state=checked]:text-primary-500 data-disabled:text-text-100 flex items-center gap-2 rounded p-2 text-sm leading-5 outline-none select-none data-disabled:opacity-50",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuSeparator(_props: BaseMenu.SeparatorProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.Separator
      class={cn("bg-dropdown-divider my-1 h-px border-0", props.class)}
      {...rest}
    />
  );
}

function MenuItemText(_props: BaseMenu.ItemTextProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.ItemText
      class={cn(
        "flex-1 overflow-hidden text-ellipsis whitespace-nowrap",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuItemIndicator(_props: BaseMenu.ItemIndicatorProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.ItemIndicator
      class={cn(
        "text-primary-500 flex size-4 shrink-0 items-center justify-center [&_svg]:size-3.5",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuArrow(_props: BaseMenu.ArrowProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.Arrow
      class={cn(
        "-z-1 [--arrow-background:var(--dropdown-background)] [--arrow-shadow-color:var(--border)]",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuArrowTip(_props: BaseMenu.ArrowTipProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenu.ArrowTip
      class={cn("border-border border-t border-l", props.class)}
      {...rest}
    />
  );
}

export const Menu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  ContextTrigger: BaseMenu.ContextTrigger,
  Indicator: MenuIndicator,
  Positioner: MenuPositioner,
  Content: MenuContent,
  Item: MenuItem,
  ItemGroup: MenuItemGroup,
  ItemGroupLabel: MenuItemGroupLabel,
  ItemText: MenuItemText,
  ItemIndicator: MenuItemIndicator,
  TriggerItem: MenuTriggerItem,
  CheckboxItem: MenuCheckboxItem,
  RadioItemGroup: MenuRadioItemGroup,
  RadioItem: MenuRadioItem,
  Separator: MenuSeparator,
  Arrow: MenuArrow,
  ArrowTip: MenuArrowTip,
};
