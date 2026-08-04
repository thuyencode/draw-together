import {
  MenuArrow as BaseMenuArrow,
  MenuArrowTip as BaseMenuArrowTip,
  MenuContent as BaseMenuContent,
  MenuItem as BaseMenuItem,
  MenuItemGroup as BaseMenuItemGroup,
  MenuItemGroupLabel as BaseMenuItemGroupLabel,
  MenuItemIndicator as BaseMenuItemIndicator,
  MenuItemText as BaseMenuItemText,
  MenuPositioner as BaseMenuPositioner,
  MenuRadioItem as BaseMenuRadioItem,
  MenuRadioItemGroup as BaseMenuRadioItemGroup,
  MenuRoot as BaseMenuRoot,
  MenuSeparator as BaseMenuSeparator,
  MenuTrigger as BaseMenuTrigger,
} from "@ark-ui/solid/menu";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type { Menu as BaseMenu } from "@ark-ui/solid/menu";

function MenuPositioner(_props: BaseMenu.PositionerProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuPositioner
      class={cn("isolate outline-none [--z-index:99]", props.class)}
      {...rest}
    />
  );
}

function MenuContent(_props: BaseMenu.ContentProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuContent
      class={cn(
        "bg-base-100 rounded-box border-neutral/30 relative z-[calc(var(--z-index)+var(--layer-index,0))] flex max-h-[min(var(--available-height,300px),300px)] min-w-[max(var(--reference-width),10rem)] origin-(--transform-origin) flex-col gap-0.5 border p-1 shadow-lg outline-none data-[state=closed]:animate-[scale-fade-out_0.1s_ease-in] data-[state=open]:animate-[scale-fade-in_0.15s_ease-out]",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuItem(_props: BaseMenu.ItemProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuItem
      class={cn(
        "btn btn-ghost btn-sm data-disabled:btn-disabled data-highlighted:btn-active border-none text-sm font-light text-ellipsis [&_svg]:size-4",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuSeparator(_props: BaseMenu.SeparatorProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuSeparator
      class={cn("bg-base-content/25 my-1 h-px border-none", props.class)}
      {...rest}
    />
  );
}

function MenuItemGroup(_props: BaseMenu.ItemGroupProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuItemGroup
      class={cn("flex flex-col [&+&]:mt-1", props.class)}
      {...rest}
    />
  );
}

function MenuItemGroupLabel(_props: BaseMenu.ItemGroupLabelProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuItemGroupLabel
      class={cn(
        "menu-title px-2 py-1.5 text-xs font-semibold tracking-wide",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuItemText(_props: BaseMenu.ItemTextProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuItemText
      class={cn(
        "flex-1 overflow-hidden text-left text-sm font-light text-ellipsis whitespace-nowrap",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuArrow(_props: BaseMenu.ArrowProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseMenuArrow
      class={cn(
        "-z-1 mb-px [--arrow-background:var(--color-base-100)] [--arrow-shadow-color:color-mix(in_oklab,var(--color-neutral)_30%,transparent)] [--arrow-size:10px]",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuArrowTip(_props: BaseMenu.ArrowTipProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseMenuArrowTip
      class={cn("border-neutral/30 border-t border-l", props.class)}
      {...rest}
    />
  );
}

function MenuRadioItemGroup(_props: BaseMenu.RadioItemGroupProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuRadioItemGroup
      class={cn("flex flex-col [&+&]:mt-1", props.class)}
      {...rest}
    />
  );
}

function MenuRadioItem(_props: BaseMenu.RadioItemProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuRadioItem
      class={cn(
        "btn btn-ghost btn-sm data-disabled:btn-disabled data-highlighted:btn-active border-none text-sm font-light text-ellipsis [&_svg]:size-4",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuItemIndicator(_props: BaseMenu.ItemIndicatorProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuItemIndicator
      class={cn(
        "text-base-content/50 pointer-events-none [&_svg]:size-3",
        props.class,
      )}
      {...rest}
    />
  );
}

export const Menu = {
  Root: BaseMenuRoot,
  Trigger: BaseMenuTrigger,
  Positioner: MenuPositioner,
  Content: MenuContent,
  Item: MenuItem,
  ItemText: MenuItemText,
  ItemGroup: MenuItemGroup,
  ItemGroupLabel: MenuItemGroupLabel,
  Separator: MenuSeparator,
  Arrow: MenuArrow,
  ArrowTip: MenuArrowTip,
  RadioItemGroup: MenuRadioItemGroup,
  RadioItem: MenuRadioItem,
  ItemIndicator: MenuItemIndicator,
};
