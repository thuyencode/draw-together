import { createSignal } from "solid-js";
import { useMutation } from "@tanstack/solid-query";
import { PASSWORD_MAX_LENGTH } from "../constants";
import { LoginFormSchema, PasswordSchema } from "../schema";
import { createLoginMutationOptions } from "../mutations";
import { useAppForm } from "~/features/shared/hooks/form";
import { m } from "~/paraglide/messages";

export function LogInForm() {
  const [rootError, setRootError] = createSignal<string[]>([]);

  const loginMutation = useMutation(() => ({
    ...createLoginMutationOptions(),
    onMutate: () => {
      setRootError([]);
    },
    onError: (error) => {
      setRootError([error.message]);
    },
  }));

  const form = useAppForm(() => ({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginFormSchema,
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value);
    },
  }));

  return (
    <section class="card bg-base-200 border-base-content/30 w-full max-w-md border shadow">
      <div class="card-body">
        <h1 class="card-title justify-center text-2xl">{m.auth_logIn()}</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.FormError errors={rootError()} />

          <form.AppField name="email">
            {(field) => (
              <field.Fieldset label={m.auth_fieldEmail()}>
                <field.TextInput type="email" class="w-full" required />
                <field.FieldError />
              </field.Fieldset>
            )}
          </form.AppField>

          <form.AppField
            name="password"
            validators={{ onChange: PasswordSchema }}
          >
            {(field) => (
              <field.Fieldset label={m.auth_fieldPassword()}>
                <field.PasswordInput
                  class="w-full"
                  required
                  maxLength={PASSWORD_MAX_LENGTH}
                />
                <field.PasswordStrengthMeter
                  // The last criteria in PasswordSchema is max length can be ignored here
                  totalLevel={5}
                />
              </field.Fieldset>
            )}
          </form.AppField>

          <div class="mt-4 space-y-2">
            <form.AppForm>
              <form.SubmitButton
                class="btn-block"
                label={m.auth_logIn()}
                submittingLabel={m.auth_loggingIn()}
              />
            </form.AppForm>

            <form.OtherFormLink class="btn-block" to="/auth/sign-up">
              {m.auth_dontHaveAccount()}
            </form.OtherFormLink>
          </div>
        </form>
      </div>
    </section>
  );
}
