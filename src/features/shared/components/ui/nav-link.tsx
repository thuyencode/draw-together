import { Link as BaseLink } from "@tanstack/solid-router";
import { cva } from "class-variance-authority";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type { VariantProps } from "class-variance-authority";
import type { LinkProps as BaseLinkProps } from "@tanstack/solid-router";

export const navLinkStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors no-underline outline-none text-foreground-soft-500 hover:bg-background-soft-100 hover:text-foreground-soft-200 data-[status=active]:bg-primary-500/10 data-[status=active]:text-primary-600",
  {
    variants: {
      size: {
        xs: "text-xs [&>svg]:size-4",
        sm: "text-sm [&>svg]:size-4",
        md: "[&>svg]:size-5",
        lg: "[&>svg]:size-5",
      },
      iconOnly: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        iconOnly: true,
        size: "xs",
        className: "size-8",
      },
      {
        iconOnly: true,
        size: "sm",
        className: "size-10",
      },
      {
        iconOnly: false,
        size: ["xs", "sm"],
        className: "px-3.5",
      },
      {
        iconOnly: true,
        size: "md",
        className: "size-11",
      },
      {
        iconOnly: false,
        size: "md",
        className: "px-4",
      },
      {
        iconOnly: true,
        size: "lg",
        className: "size-12",
      },
      {
        iconOnly: false,
        size: "lg",
        className: "px-5",
      },
      {
        iconOnly: false,
        className: "py-2.5",
      },
    ],
    defaultVariants: {
      size: "md",
      iconOnly: false,
    },
  },
);

type NavLinkStyleProps = VariantProps<typeof navLinkStyles>;
type NavLinkProps = NavLinkStyleProps &
  Omit<BaseLinkProps, keyof NavLinkStyleProps> & { class?: string };

export function NavLink(_props: NavLinkProps) {
  const [props, rest] = splitProps(_props, ["class", "size", "iconOnly"]);

  return (
    <BaseLink
      class={cn(
        navLinkStyles({ size: props.size, iconOnly: props.iconOnly }),
        props.class,
      )}
      {...rest}
    />
  );
}

export function _NavLink(_props: NavLinkProps) {
  const [props, rest] = splitProps(_props, ["class", "size", "iconOnly"]);

  return (
    // @ts-expect-error
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      class={cn(
        navLinkStyles({ size: props.size, iconOnly: props.iconOnly }),
        props.class,
      )}
      {...rest}
    />
  );
}
