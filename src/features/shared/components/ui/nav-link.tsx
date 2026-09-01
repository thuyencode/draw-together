import { Link } from "@tanstack/solid-router";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type { ComponentProps } from "solid-js";
import type { LinkProps } from "@tanstack/solid-router";

type NavLinkProps = LinkProps & Omit<ComponentProps<"a">, keyof LinkProps>;

export function NavLink(_props: NavLinkProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <Link
      class={cn(
        "aria-[current=page]:menu-active is-drawer-close:tooltip is-drawer-close:tooltip-right h-9 content-center [&_svg]:size-4",
        props.class,
      )}
      {...rest}
    />
  );
}
