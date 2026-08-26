import { Show, splitProps } from "solid-js";
import { createFormHook } from "@tanstack/solid-form";
import {
  FieldError as BaseFieldError,
  PasswordInput as BasePasswordInput,
  PasswordStrengthMeter as BasePasswordStrengthMeter,
  SubmitButton as BaseSubmitButton,
  TextInput as BaseTextInput,
  Fieldset,
  FormError,
  OtherFormLink,
} from "../components/ui";
import {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext,
} from "./form-context";
import type { JSXElement, ParentProps } from "solid-js";
import type {
  SubmitButtonProps as BaseSubmitButtonProps,
  PasswordInputProps,
  PasswordStrengthMeterProps,
  TextInputProps,
} from "../components/ui";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    Fieldset,
    FieldError,
    FieldHelper,
    TextInput,
    PasswordInput,
    PasswordStrengthMeter,
  },
  formComponents: {
    FormError,
    SubmitButton,
    OtherFormLink,
  },
  fieldContext,
  formContext,
});

function FieldError() {
  const field = useFieldContext();

  return <BaseFieldError errors={field().state.meta.errors} />;
}

function FieldHelper(props: ParentProps) {
  const field = useFieldContext();

  return (
    <Show when={field().state.meta.isValid}>
      <p class="label">{props.children}</p>
    </Show>
  );
}

function TextInput(
  props: Omit<
    TextInputProps,
    "name" | "value" | "onChange" | "onInput" | "aria-invalid"
  >,
) {
  const field = useFieldContext<string>();

  return (
    <BaseTextInput
      name={field().name}
      aria-invalid={field().state.meta.isTouched && !field().state.meta.isValid}
      value={field().state.value}
      onBlur={field().handleBlur}
      onInput={field().handleChange}
      {...props}
    />
  );
}

function PasswordInput(
  props: Omit<
    PasswordInputProps,
    "name" | "value" | "onChange" | "onInput" | "aria-invalid"
  >,
) {
  const field = useFieldContext<string>();

  return (
    <BasePasswordInput
      name={field().name}
      aria-invalid={field().state.meta.isTouched && !field().state.meta.isValid}
      value={field().state.value}
      onBlur={field().handleBlur}
      onInput={field().handleChange}
      {...props}
    />
  );
}

function PasswordStrengthMeter(
  props: Pick<PasswordStrengthMeterProps, "totalLevel">,
) {
  const field = useFieldContext();

  return (
    <BasePasswordStrengthMeter
      errors={field().state.meta.errors}
      isDirty={field().state.meta.isDirty}
      {...props}
    />
  );
}

interface SubmitButtonProps extends BaseSubmitButtonProps {
  label: JSXElement;
  submittingLabel?: string;
}

function SubmitButton(_props: SubmitButtonProps) {
  const form = useFormContext();
  const [props, rest] = splitProps(_props, ["label", "submittingLabel"]);

  return (
    <form.Subscribe
      selector={(state) => ({
        isSubmitting: state.isSubmitting,
        canSubmit: state.canSubmit,
      })}
    >
      {(value) => (
        <BaseSubmitButton
          disabled={value().isSubmitting || !value().canSubmit}
          {...rest}
        >
          <Show when={value().isSubmitting} fallback={props.label}>
            <span class="loading loading-spinner loading-xs" />
            {props.submittingLabel}
          </Show>
        </BaseSubmitButton>
      )}
    </form.Subscribe>
  );
}
