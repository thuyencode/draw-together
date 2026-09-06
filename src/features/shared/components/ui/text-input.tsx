import { Show, splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import { cn } from "~/features/shared/utils/cn";

export interface TextInputProps extends Omit<
  ComponentProps<"input">,
  "onChange" | "onInput" | "value"
> {
  value: string;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
  label?: string;
  maxLength?: number;
}

export function TextInput(_props: TextInputProps) {
  const [props, rest] = splitProps(_props, [
    "value",
    "onChange",
    "onInput",
    "label",
    "maxLength",
    "class",
  ]);

  const charCount = () => props.value.length;

  return (
    <label
      class={cn(
        "input has-[aria-invalid=true]:input-error text-sm",
        props.class,
      )}
    >
      <Show when={props.label}>
        {(label) => <span class="label [&_svg]:size-4">{label()}</span>}
      </Show>
      <input
        type="text"
        value={props.value}
        onChange={(e) => props.onChange?.(e.target.value)}
        onInput={(e) => props.onInput?.(e.target.value)}
        maxLength={props.maxLength}
        {...rest}
      />
      <Show when={props.maxLength}>
        {(maxLength) => (
          <span class="badge badge-sm badge-soft">
            {charCount()}/{maxLength()}
          </span>
        )}
      </Show>
    </label>
  );
}
