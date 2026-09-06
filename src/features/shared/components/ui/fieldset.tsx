import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type { ComponentProps, ParentProps } from "solid-js";

interface FieldsetProps extends ComponentProps<"fieldset"> {
  label: string;
}

export function Fieldset(_props: ParentProps<FieldsetProps>) {
  const [props, rest] = splitProps(_props, ["class", "label", "children"]);

  return (
    <fieldset class={cn("fieldset", props.class)} {...rest}>
      <legend class="fieldset-legend text-sm">{props.label}</legend>
      {props.children}
    </fieldset>
  );
}
