import { Link as BaseLink } from "@tanstack/solid-router";
import { cva } from "class-variance-authority";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type { VariantProps } from "class-variance-authority";
import type { ParentProps } from "solid-js";
import type { LinkProps as BaseLinkProps } from "@tanstack/solid-router";

export const linkStyles = cva(
  "inline-flex items-center font-medium transition [&>svg]:size-4 [&>svg]:text-current!",
  {
    variants: {
      variant: {
        primary: "text-primary-500 hover:text-primary-600",
        dark: "text-button-outline-text hover:text-text-100",
      },
      size: {
        sm: "gap-1 text-sm",
        md: "gap-1.5 [&>svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "dark",
      size: "sm",
    },
  },
);

type LinkVariantProps = VariantProps<typeof linkStyles>;

export type LinkProps = ParentProps<
  LinkVariantProps & Omit<BaseLinkProps, keyof LinkVariantProps>
> & { class?: string };

export function Link(_props: LinkProps) {
  const [props, rest] = splitProps(_props, ["class", "variant", "size"]);

  return (
    <BaseLink
      class={cn(
        linkStyles({ variant: props.variant, size: props.size }),
        props.class,
      )}
      {...rest}
    />
  );
}

export function _Link(_props: LinkProps) {
  const [props, rest] = splitProps(_props, ["class", "variant", "size"]);

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      class={cn(
        linkStyles({ variant: props.variant, size: props.size }),
        props.class,
      )}
      {...rest}
    />
  );
}
