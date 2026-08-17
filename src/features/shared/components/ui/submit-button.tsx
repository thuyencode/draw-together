import { splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import { cn } from "~/features/shared/utils/cn";

export function SubmitButton(_props: ComponentProps<"button">) {
  const [props, rest] = splitProps(_props, ["class", "disabled"]);

  return (
    <button
      type="submit"
      class={cn("btn btn-primary flex-1", props.class)}
      disabled={props.disabled}
      {...rest}
    />
  );
}
