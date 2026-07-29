import { Show, splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import { cn } from "~/features/shared/utils/cn";

interface NumberInputProps extends Omit<
  ComponentProps<"input">,
  "type" | "onChange" | "onInput" | "value"
> {
  value: number;
  onChange?: (value: number) => void;
  onInput?: (value: number) => void;
  label?: string;
  parse?: "int" | "float";
  unit?: string;
}

export function NumberInput(_props: NumberInputProps) {
  const [props, rest] = splitProps(_props, [
    "value",
    "onChange",
    "onInput",
    "label",
    "parse",
    "unit",
    "class",
  ]);

  const parseValue = (raw: string) => {
    const parsed =
      props.parse === "float"
        ? Number.parseFloat(raw)
        : Number.parseInt(raw, 10);
    return Number.isNaN(parsed) ? props.value : parsed;
  };

  return (
    <label class={cn("input text-sm", props.class)}>
      <Show when={props.label}>
        <span class="label">{props.label}</span>
      </Show>
      <input
        type="number"
        value={props.value}
        onChange={(e) => props.onChange?.(parseValue(e.currentTarget.value))}
        onInput={(e) => props.onInput?.(parseValue(e.currentTarget.value))}
        inputmode="numeric"
        pattern={props.parse === "float" ? "[0-9]*.?[0-9]*" : "[0-9]*"}
        {...rest}
      />
      <Show when={props.unit}>
        <span class="badge badge-xs badge-soft">{props.unit}</span>
      </Show>
    </label>
  );
}
