import { Menu as BaseMenu } from "@ark-ui/solid";
import { splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { cn } from "../../utils/cn";

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
        "relative flex flex-col p-1 min-w-[max(var(--reference-width),10rem)] max-h-[min(var(--available-height,300px),300px)] bg-dropdown-background border border-neutral-300 rounded-lg shadow-md z-[calc(var(--popover-z-index)+var(--layer-index,0))] outline-none origin-(--transform-origin) data-[state=open]:animate-[scale-fade-in_0.15s_ease-out] data-[state=closed]:animate-[scale-fade-out_0.1s_ease-in]",
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
        "flex items-center gap-2 min-h-8 px-[0.725rem] text-sm leading-5 rounded select-none outline-none text-text-50 no-underline data-highlighted:bg-dropdown-hover-background data-disabled:text-text-100 data-disabled:opacity-50",
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
        "flex items-center justify-between gap-2 min-h-8 px-[0.725rem] text-sm leading-5 rounded select-none outline-none data-highlighted:bg-dropdown-hover-background after:content-['›'] after:text-base after:text-text-100",
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
        "flex items-center gap-2 p-2 text-sm leading-5 rounded select-none outline-none data-highlighted:bg-dropdown-hover-background data-[state=checked]:text-error-500 data-disabled:text-text-100 data-disabled:opacity-50",
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
        "flex items-center gap-2 p-2 text-sm leading-5 rounded select-none outline-none data-highlighted:bg-dropdown-hover-background data-[state=checked]:text-error-500 data-disabled:text-text-100 data-disabled:opacity-50",
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
      class={cn("h-px my-1 border-0 bg-dropdown-divider", props.class)}
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
        "flex items-center justify-center text-error-500 shrink-0 size-4 [&_svg]:size-3.5",
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
        "[--arrow-background:var(--dropdown-background)] [--arrow-shadow-color:var(--border)] -z-1",
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
      class={cn("border-t border-l border-border", props.class)}
      {...rest}
    />
  );
}

export const Menu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  ContextTrigger: BaseMenu.ContextTrigger,
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
