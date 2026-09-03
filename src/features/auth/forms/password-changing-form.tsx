import { createSignal } from "solid-js";
import { useMutation } from "@tanstack/solid-query";
import { PASSWORD_MAX_LENGTH } from "../constants";
import { PasswordChangingFormSchema, PasswordSchema } from "../schema";
import { createPasswordChangingMutationOptions } from "../mutations";
import { useAppForm } from "~/features/shared/hooks/form";
import { m } from "~/paraglide/messages";
import { cn } from "~/features/shared/utils/cn";
import { AlertModal } from "~/features/shared/components/ui";

interface PasswordChangingFormProps {
  class?: string;
}

export function PasswordChangingForm(props: PasswordChangingFormProps) {
  const [rootError, setRootError] = createSignal<string[]>([]);

  const form = useAppForm(() => ({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: PasswordChangingFormSchema,
    },
    onSubmit: async ({ value }) => {
      await passwordChangingMutation.mutateAsync(value);
    },
  }));

  const passwordChangingMutation = useMutation(() => ({
    ...createPasswordChangingMutationOptions(form),
    onMutate: () => {
      setRootError([]);
    },
    onError: (error) => {
      setRootError([error.message]);
    },
  }));

  return (
    <section class={cn("space-y-3", props.class)}>
      <h2 class="text-xl">{m.passwd_security_change_password()}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <form.FormError errors={rootError()} />

        <form.AppField name="currentPassword">
          {(field) => (
            <field.Fieldset label={m.passwd_security_fieldCurrentPassword()}>
              <field.PasswordInput
                class="w-full"
                required
                maxLength={PASSWORD_MAX_LENGTH}
              />
              <field.FieldError />
            </field.Fieldset>
          )}
        </form.AppField>

        <form.AppField
          name="newPassword"
          validators={{ onChange: PasswordSchema }}
        >
          {(field) => (
            <field.Fieldset label={m.passwd_security_fieldNewPassword()}>
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

        <form.AppField
          name="confirmPassword"
          validators={{
            onChangeListenTo: ["newPassword"],
            onChange: ({ value, fieldApi }) =>
              value !== fieldApi.form.getFieldValue("newPassword")
                ? [{ message: m.auth_passwordsDoNotMatchError() }]
                : undefined,
          }}
        >
          {(field) => (
            <field.Fieldset label={m.auth_confirmPassword()}>
              <field.PasswordInput
                class="w-full"
                required
                maxLength={PASSWORD_MAX_LENGTH}
              />
              <field.FieldError />
            </field.Fieldset>
          )}
        </form.AppField>

        <form.AppForm>
          <AlertModal.Provider>
            <AlertModal.Trigger
              as={form.SubmitButton}
              class="btn-block mt-3"
              label={m.confirm()}
            />

            <AlertModal.Root>
              <AlertModal.Box>
                <AlertModal.Title>
                  {m.passwd_security_beforeContinue()}
                </AlertModal.Title>
                <AlertModal.Description>
                  {m.passwd_security_logOutWarning()}
                </AlertModal.Description>

                <AlertModal.Action>
                  <AlertModal.Cancel />
                  <AlertModal.Proceed onClick={form.handleSubmit} />
                </AlertModal.Action>
              </AlertModal.Box>

              <AlertModal.Backdrop />
            </AlertModal.Root>
          </AlertModal.Provider>
        </form.AppForm>
      </form>
    </section>
  );
}
