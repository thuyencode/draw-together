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
        "btn btn-ghost aria-[current=page]:btn-soft aria-[current=page]:hover:bg-primary/20 aria-[current=page]:btn-primary aria-[current=page]:hover:text-primary border-0 shadow-none",
        props.class,
      )}
      {...rest}
    />
  );
}
