import { cva } from "class-variance-authority";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { ComponentProps, ValidComponent } from "solid-js";
import type { VariantProps } from "class-variance-authority";
import { cn } from "~/features/shared/utils/cn";

export const toolButtonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors no-underline outline-none text-foreground-soft-500 hover:bg-background-soft-100 hover:text-foreground-soft-200 data-[current-tool=true]:bg-primary-500/10 data-[current-tool=true]:text-primary-600",
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

type BaseToolButtonProps<T extends ValidComponent> = {
  as?: T;
  class?: string | undefined;
} & VariantProps<typeof toolButtonStyles>;

type ToolButtonProps<T extends ValidComponent> = BaseToolButtonProps<T> &
  Omit<ComponentProps<T>, keyof BaseToolButtonProps<T>>;

export function ToolButton<T extends ValidComponent = "button">(
  _props: ToolButtonProps<T>,
) {
  const [props, rest] = splitProps(_props, ["as", "class", "size", "iconOnly"]);

  return (
    <Dynamic
      component={props.as ?? "button"}
      class={cn(
        toolButtonStyles({ size: props.size, iconOnly: props.iconOnly }),
        props.class,
      )}
      {...rest}
    />
  );
}
