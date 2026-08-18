import { Show } from "solid-js";
import { createFormErrorMessages } from "~/features/shared/hooks";
import { m } from "~/paraglide/messages";

export interface PasswordStrengthProgressProps {
  totalLevel: number;
  errors: Array<{ message: string } | undefined> | string[] | null;
  isDirty: boolean;
}

export function PasswordStrengthProgress(props: PasswordStrengthProgressProps) {
  const uniqueErrors = createFormErrorMessages(() => props.errors);

  const percentage = () => {
    if (!props.isDirty) return 0;
    return Math.round(
      ((props.totalLevel - uniqueErrors().length) / props.totalLevel) * 100,
    );
  };

  const status = (): "untouched" | "error" | "warning" | "success" => {
    if (!props.isDirty) return "untouched";
    if (percentage() < 50) return "error";
    if (percentage() < 100) return "warning";
    return "success";
  };

  return (
    <div aria-label={m.auth_passwordStrength()}>
      <progress
        class="progress"
        classList={{
          "progress-error": status() === "error",
          "progress-warning": status() === "warning",
          "progress-success": status() === "success",
        }}
        value={percentage()}
        max={100}
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
