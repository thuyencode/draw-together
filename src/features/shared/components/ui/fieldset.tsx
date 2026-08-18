import type { ParentProps } from "solid-js";

interface FieldsetProps {
  label: string;
}

export function Fieldset(props: ParentProps<FieldsetProps>) {
  return (
    <fieldset class="fieldset">
      <legend class="fieldset-legend">{props.label}</legend>
      {props.children}
    </fieldset>
  );
}
