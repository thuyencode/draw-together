import { createForm } from "@tanstack/solid-form";
import { Show, createSignal } from "solid-js";
import { Link, useNavigate } from "@tanstack/solid-router";
import { PasswordSchema, SignUpFormSchema } from "../schema";
import { PASSWORD_MAX_LENGTH } from "../constants";
import type { ComponentProps } from "solid-js";
import {
  FieldError,
  FormError,
  PasswordInput,
  PasswordStrengthProgress,
  ResetButton,
  SubmitButton,
  TextInput,
} from "~/features/shared/components/ui";
import { authClient } from "~/integrations/better-auth/client";
import { sleep } from "~/features/shared/utils";
import { m } from "~/paraglide/messages";

type SignUpFormProps = Omit<ComponentProps<"form">, "onSubmit">;

export function SignUpForm(props: SignUpFormProps) {
  const navigate = useNavigate();
  const [rootError, setRootError] = createSignal<string[]>([]);
  const form = createForm(() => ({
    defaultValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: SignUpFormSchema,
    },
    onSubmit: async (data) => {
      if (import.meta.env.MODE === "development") {
        await sleep(2000);
      }

      await authClient.signUp.email(data.value, {
        onError: (ctx) => {
          setRootError([ctx.error.message]);
        },
        onSuccess: () => {
          navigate({ to: "/" });
        },
      });
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      {...props}
    >
      <FormError errors={rootError()} />

      <form.Field name="name">
        {(field) => {
          return (
            <fieldset class="fieldset">
              <legend class="fieldset-legend capitalize">
                {m.auth_fieldName()}
              </legend>
              <TextInput
                type="name"
                name={field().name}
                class="w-full"
                required
                aria-invalid={
                  field().state.meta.isTouched && !field().state.meta.isValid
                    ? true
                    : undefined
                }
                value={field().state.value}
                onBlur={field().handleBlur}
                onInput={field().handleChange}
              />
              <FieldError errors={field().state.meta.errors} />
              <Show when={field().state.meta.isValid}>
                <p class="label">{m.auth_fakeNameOk()}</p>
              </Show>
            </fieldset>
          );
        }}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <fieldset class="fieldset">
            <legend class="fieldset-legend capitalize">
              {m.auth_fieldEmail()}
            </legend>
            <TextInput
              type="email"
              name={field().name}
              class="w-full"
              required
              aria-invalid={
                field().state.meta.isTouched && !field().state.meta.isValid
              }
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={field().handleChange}
            />
            <FieldError errors={field().state.meta.errors} />
            <Show when={field().state.meta.isValid}>
              <p class="label">{m.auth_fakeEmailOk()}</p>
            </Show>
          </fieldset>
        )}
      </form.Field>

      <form.Field name="username">
        {(field) => (
          <fieldset class="fieldset">
            <legend class="fieldset-legend capitalize">
              {m.auth_fieldUsername()}
            </legend>
            <TextInput
              name={field().name}
              class="w-full"
              required
              aria-invalid={
                field().state.meta.isTouched && !field().state.meta.isValid
              }
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={field().handleChange}
            />
            <FieldError errors={field().state.meta.errors} />
          </fieldset>
        )}
      </form.Field>
      <form.Field name="password" validators={{ onChange: PasswordSchema }}>
        {(field) => (
          <fieldset class="fieldset">
            <legend class="fieldset-legend capitalize">
              {m.auth_fieldPassword()}
            </legend>
            <PasswordInput
              name={field().name}
              class="w-full"
              required
              aria-invalid={
                field().state.meta.isTouched && !field().state.meta.isValid
              }
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={field().handleChange}
              maxLength={PASSWORD_MAX_LENGTH}
            />
            <PasswordStrengthProgress
              // The last criteria in PasswordSchema is max length can be ignored here
              totalLevel={5}
              errors={field().state.meta.errors}
              isTouched={field().form.state.isTouched}
            />
          </fieldset>
        )}
      </form.Field>
      <form.Field
        name="confirmPassword"
        validators={{
          onChangeListenTo: ["password"],
          onChange: ({ value, fieldApi }) =>
            value !== fieldApi.form.getFieldValue("password")
              ? m.auth_passwordsDoNotMatchError()
              : undefined,
        }}
      >
        {(field) => (
          <fieldset class="fieldset">
            <legend class="fieldset-legend capitalize">
              {m.auth_confirmPassword()}
            </legend>
            <PasswordInput
              name={field().name}
              class="w-full"
              required
              aria-invalid={
                field().state.meta.isTouched && !field().state.meta.isValid
              }
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={field().handleChange}
              maxLength={PASSWORD_MAX_LENGTH}
            />
            <Show when={field().state.meta.errors.length !== 0}>
              <p class="text-error">{m.auth_passwordsDoNotMatch()}</p>
            </Show>
          </fieldset>
        )}
      </form.Field>

      <div class="flex gap-1">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <SubmitButton disabled={isSubmitting()}>
              <Show when={isSubmitting()} fallback={m.auth_signUp()}>
                <span class="loading loading-spinner loading-xs" />
                {m.auth_signingIn()}
              </Show>
            </SubmitButton>
          )}
        </form.Subscribe>{" "}
        <ResetButton onReset={() => form.reset()}>{m.auth_reset()}</ResetButton>
      </div>

      <Link
        class="btn btn-link btn-block -mt-1 no-underline hover:underline"
        to="/auth/login"
      >
        {m.auth_alreadyHaveAccount()}
      </Link>
    </form>
  );
}
