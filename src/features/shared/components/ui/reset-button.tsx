import { splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import { cn } from "~/features/shared/utils/cn";

interface ResetButtonProps extends ComponentProps<"button"> {
  onReset?: () => void;
}

export function ResetButton(_props: ResetButtonProps) {
  const [props, rest] = splitProps(_props, ["class", "onReset"]);

  return (
    <button
      type="reset"
      class={cn("btn btn-secondary btn-soft flex-1", props.class)}
      onClick={() => props.onReset?.()}
      {...rest}
    />
  );
}
