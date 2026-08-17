import { EyeIcon, EyeOffIcon } from "lucide-solid";
import { Show, createSignal, splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import { cn } from "~/features/shared/utils/cn";
import { m } from "~/paraglide/messages";

interface PasswordInputProps extends Omit<
  ComponentProps<"input">,
  "type" | "onChange" | "onInput" | "value"
> {
  value: string;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
  label?: string;
  maxLength?: number;
}

export function PasswordInput(_props: PasswordInputProps) {
  const [props, rest] = splitProps(_props, [
    "value",
    "onChange",
    "onInput",
    "label",
    "maxLength",
    "class",
  ]);

  const [visible, setVisible] = createSignal(false);

  return (
    <label
      class={cn(
        "input has-[aria-invalid=true]:input-error text-sm",
        props.class,
      )}
    >
      <Show when={props.label}>
        <span class="label [&_svg]:size-4">{props.label}</span>
      </Show>
      <input
        type={visible() ? "text" : "password"}
        value={props.value}
        onChange={(e) => props.onChange?.(e.target.value)}
        onInput={(e) => props.onInput?.(e.target.value)}
        maxLength={props.maxLength}
        {...rest}
      />
      <button
        type="button"
        class="tooltip tooltip-top btn btn-ghost btn-square btn-sm font-normal"
        data-tip={visible() ? m.auth_hidePassword() : m.auth_showPassword()}
        onClick={() => setVisible((v) => !v)}
      >
        <Show when={visible()} fallback={<EyeIcon class="size-4" />}>
          <EyeOffIcon class="size-4" />
        </Show>
      </button>
    </label>
  );
}
