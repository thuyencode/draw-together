import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { ComponentProps, ValidComponent } from "solid-js";
import type { PropsWithAs } from "~/features/shared/types/props";
import { cn } from "~/features/shared/utils/cn";

type BaseToolButtonProps<T extends ValidComponent> = PropsWithAs<
  T,
  {
    class?: string | undefined;
  }
>;

type ToolButtonProps<T extends ValidComponent> = BaseToolButtonProps<T> &
  Omit<ComponentProps<T>, keyof BaseToolButtonProps<T>>;

export function ToolButton<T extends ValidComponent = "button">(
  _props: ToolButtonProps<T>,
) {
  const [props, rest] = splitProps(_props, ["as", "class"]);

  return (
    <Dynamic
      component={props.as ?? "button"}
      class={cn(
        "btn btn-ghost btn-square data-[current-tool=true]:btn-soft data-[current-tool=true]:btn-primary border-0 shadow-none [&>svg]:size-5",
        props.class,
      )}
      {...rest}
    />
  );
}
