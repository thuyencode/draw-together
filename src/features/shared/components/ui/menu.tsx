import {
  MenuContent as BaseMenuContent,
  MenuItem as BaseMenuItem,
  MenuPositioner as BaseMenuPositioner,
  MenuRoot as BaseMenuRoot,
  MenuTrigger as BaseMenuTrigger,
} from "@ark-ui/solid/menu";
import { splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { cn } from "../../utils/cn";
import type { Menu as BaseMenu } from "@ark-ui/solid/menu";

function MenuPositioner(_props: BaseMenu.PositionerProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <Portal>
      <BaseMenuPositioner
        class={cn("isolate z-50 outline-none", props.class)}
        {...rest}
      />
    </Portal>
  );
}

function MenuContent(_props: BaseMenu.ContentProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseMenuContent
      class={cn(
        "bg-base-100 relative z-[calc(var(--z-index)+var(--layer-index,0))] flex max-h-[min(var(--available-height,300px),300px)] min-w-[max(var(--reference-width),10rem)] origin-(--transform-origin) flex-col gap-0.5 rounded-lg border border-neutral-300 p-1 shadow-md outline-none data-[state=closed]:animate-[scale-fade-out_0.1s_ease-in] data-[state=open]:animate-[scale-fade-in_0.15s_ease-out]",
        props.class,
      )}
      {...rest}
    />
  );
}

function MenuItem(_props: BaseMenu.ItemProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return <BaseMenuItem class={cn("btn btn-ghost", props.class)} {...rest} />;
}

export const Menu = {
  Root: BaseMenuRoot,
  Trigger: BaseMenuTrigger,
  Positioner: MenuPositioner,
  Content: MenuContent,
  Item: MenuItem,
};
