import { splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import { cn } from "~/features/shared/utils/cn";

export type SubmitButtonProps = ComponentProps<"button">;

export function SubmitButton(_props: SubmitButtonProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <button
      type="submit"
      class={cn("btn btn-primary", props.class)}
      {...rest}
    />
  );
}
