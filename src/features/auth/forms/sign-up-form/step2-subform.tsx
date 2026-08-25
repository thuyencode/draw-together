import { ArrowLeftIcon } from "lucide-solid";
import { PasswordSchema } from "../../schema";
import { PASSWORD_MAX_LENGTH } from "../../constants";
import { signUpFormOpts } from "./options";
import { SignUpFormStep2Schema } from "./schema";
import { m } from "~/paraglide/messages";
import { withForm } from "~/features/shared/hooks/form";
import { Steps } from "~/features/shared/components/ui";

export const SignUpStep2Form = withForm({
  ...signUpFormOpts,
  render: (props) => (
    <props.form.FormGroup
      name="step2"
      validators={{ onDynamic: SignUpFormStep2Schema }}
      onGroupSubmit={props.form.handleSubmit}
    >
      {(group) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            group().handleSubmit();
          }}
        >
          <props.form.FormError errors={group().state.meta.errors} />

          <props.form.AppField
            name="step2.password"
            validators={{ onChange: PasswordSchema }}
          >
            {(field) => (
              <field.Fieldset label={m.auth_fieldPassword()}>
                <field.PasswordInput
                  class="w-full"
                  required
                  maxLength={PASSWORD_MAX_LENGTH}
                />
                <field.PasswordStrengthProgress
                  // The last criteria in PasswordSchema is max length can be ignored here
                  totalLevel={5}
                />
              </field.Fieldset>
            )}
          </props.form.AppField>

          <props.form.AppField
            name="step2.confirmPassword"
            validators={{
              onChangeListenTo: ["step2.password"],
              onChange: ({ value, fieldApi }) =>
                value !== fieldApi.form.getFieldValue("step2.password")
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
          </props.form.AppField>

          <div class="mt-4 space-y-2">
            <props.form.AppForm>
              <props.form.SubmitButton
                class="btn-block"
                label={m.auth_signUp()}
                submittingLabel={m.auth_signingUp()}
              />
            </props.form.AppForm>

            <Steps.PrevTrigger class="btn-secondary btn-soft btn-block">
              <ArrowLeftIcon class="size-4" />
              {m.auth_previous()}
            </Steps.PrevTrigger>
          </div>
        </form>
      )}
    </props.form.FormGroup>
  ),
});
