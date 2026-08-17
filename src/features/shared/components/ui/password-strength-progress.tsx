import { Show, splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type { ComponentProps } from "solid-js";
import { createUniqueErrorMessages } from "~/features/shared/hooks";

interface PasswordStrengthProgressProps extends ComponentProps<"progress"> {
  totalLevel: number;
  errors: Array<{ message: string } | undefined> | string[] | null;
  isTouched: boolean;
}

export function PasswordStrengthProgress(
  _props: PasswordStrengthProgressProps,
) {
  const [props, rest] = splitProps(_props, [
    "totalLevel",
    "errors",
    "isTouched",
    "class",
  ]);

  const uniqueErrors = createUniqueErrorMessages(() => props.errors);

  const percentage = () => {
    if (!props.isTouched) return 0;
    return Math.round(
      ((props.totalLevel - uniqueErrors().length) / props.totalLevel) * 100,
    );
  };

  const status = (): "untouched" | "error" | "warning" | "success" => {
    if (!props.isTouched) return "untouched";
    if (percentage() < 50) return "error";
    if (percentage() < 100) return "warning";
    return "success";
  };

  return (
    <div>
      <progress
        class={cn("progress", props.class, {
          "progress-error": status() === "error",
          "progress-warning": status() === "warning",
          "progress-success": status() === "success",
        })}
        value={percentage()}
        max={100}
        {...rest}
      />
      <Show when={uniqueErrors().length}>
        <p
          role="alert"
          data-slot="field-error"
          class="text-error"
          classList={{
            "text-warning": status() === "warning",
            "text-success": status() === "success",
          }}
        >
          {uniqueErrors()[0]}
        </p>
      </Show>
    </div>
  );
}
