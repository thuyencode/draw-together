import { A, type AnchorProps } from "@solidjs/router";
import { cva, type VariantProps } from "class-variance-authority";
import { splitProps, type ParentProps } from "solid-js";
import { cn } from "~/shared/utils/cn";

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
  LinkVariantProps & Omit<AnchorProps, keyof LinkVariantProps>
>;

export function Link(_props: LinkProps) {
  const [props, rest] = splitProps(_props, ["class", "variant", "size"]);

  return (
    <A
      class={cn(
        linkStyles({ variant: props.variant, size: props.size }),
        props.class,
      )}
      {...rest}
    />
  );
}
