import { Show, splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import { cn } from "~/features/shared/utils/cn";

interface TextInputProps extends Omit<
  ComponentProps<"input">,
  "type" | "onChange" | "value"
> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  maxLength: number;
}

export function TextInput(_props: TextInputProps) {
  const [props, rest] = splitProps(_props, [
    "value",
    "onChange",
    "label",
    "maxLength",
    "class",
  ]);

  const charCount = () => props.value.length;

  return (
    <label class={cn("input text-sm", props.class)}>
      <Show when={props.label}>
        <span class="label">{props.label}</span>
      </Show>
      <input
        type="text"
        value={props.value}
        onInput={(e) => props.onChange(e.target.value)}
        maxLength={props.maxLength}
        {...rest}
      />
      <span class="badge badge-sm">
        {charCount()}/{props.maxLength}
      </span>
    </label>
  );
}
