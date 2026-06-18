import { Field as BaseField } from "@ark-ui/solid";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";

function FieldRoot(_props: BaseField.RootProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseField.Root
      class={cn("mx-auto grid w-full max-w-sm gap-2", props.class)}
      {...rest}
    />
  );
}

function FieldLabel(_props: BaseField.LabelProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseField.Label
      class={cn("text-text-50 text-sm font-normal", props.class)}
      {...rest}
    />
  );
}

function FieldInput(_props: BaseField.InputProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseField.Input
      class={cn(
        // Base
        "bg-input-background peer text-title-50 placeholder:text-input-placeholder-text disabled:border-border-color-base-100 disabled:text-input-disabled-text disabled:placeholder:text-input-disabled-text w-full max-w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-4",
        // Default
        "border-border-color-base-300 focus:border-input-primary-focus-border focus:ring-input-primary-focus-border/20",
        // Error
        "data-invalid:border-input-error-focus-border data-invalid:focus:ring-input-error-focus-border/20 user-invalid:border-input-error-focus-border user-invalid:focus:ring-input-error-focus-border/20",
        // Success
        "user-valid:border-input-success-focus-border user-valid:focus:border-input-success-focus-border user-valid:focus:ring-input-success-focus-border/20",
        props.class,
      )}
      {...rest}
    />
  );
}

function FieldTextarea(_props: BaseField.TextareaProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseField.Textarea
      class={cn(
        // Base
        "bg-input-background peer text-title-50 placeholder:text-input-placeholder-text disabled:border-border-color-base-200 disabled:bg-background-soft-50 disabled:text-input-disabled-text disabled:placeholder:text-input-disabled-text h-32 w-full rounded-lg border px-4 py-3.5 outline-none focus:ring-4",
        // Default
        "border-border-color-base-200 focus:border-input-primary-focus-border focus:ring-input-primary-focus-border/20",
        // Error
        "data-invalid:border-input-error-focus-border data-invalid:focus:ring-input-error-focus-border/20 user-invalid:border-input-error-focus-border user-invalid:focus:ring-input-error-focus-border/20",
        // Success
        "user-valid:border-input-success-focus-border user-valid:focus:border-input-success-focus-border user-valid:focus:ring-input-success-focus-border/20",
        props.class,
      )}
      {...rest}
    />
  );
}

function FieldSelect(_props: BaseField.SelectProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseField.Select
      class={cn(
        // Base
        "text-title-50 w-full min-w-0 appearance-none rounded-lg border bg-transparent px-3 py-2 pr-8 text-sm transition outline-none",
        // Chevron
        "bg-size-[1rem] bg-position-[right_0.5rem_center] bg-no-repeat",
        'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%239CA3AF%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")]',
        // Default
        "border-border-color-base-300 focus:border-input-primary-focus-border focus:ring-input-primary-focus-border/20 focus:ring-4",
        // Error
        "data-invalid:border-input-error-focus-border data-invalid:focus:ring-input-error-focus-border/20 user-invalid:border-input-error-focus-border user-invalid:focus:ring-input-error-focus-border/20",
        // Success
        "user-valid:border-input-success-focus-border user-valid:focus:border-input-success-focus-border user-valid:focus:ring-input-success-focus-border/20",
        props.class,
      )}
      {...rest}
    />
  );
}

function FieldHelperText(_props: BaseField.HelperTextProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseField.HelperText
      class={cn(
        // Base
        "peer-disabled:text-input-disabled-text text-sm font-normal",
        // Default
        "text-text-50",
        // Success (via peer input)
        "peer-user-valid:text-input-success peer-data-valid:text-input-success",
        props.class,
      )}
      {...rest}
    />
  );
}

function FieldErrorText(_props: BaseField.ErrorTextProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <BaseField.ErrorText
      class={cn("text-input-error text-sm font-normal", props.class)}
      {...rest}
    />
  );
}

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Input: FieldInput,
  Textarea: FieldTextarea,
  Select: FieldSelect,
  HelperText: FieldHelperText,
  ErrorText: FieldErrorText,
  RequiredIndicator: BaseField.RequiredIndicator,
};
