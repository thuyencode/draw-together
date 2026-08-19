import { ArrowRightIcon } from "lucide-solid";
import { signUpFormOpts } from "./options";
import { SignUpFormStep1Schema } from "./schema";
import { m } from "~/paraglide/messages";
import { withForm } from "~/features/shared/hooks/form";
import { Steps } from "~/features/shared/components/ui";

export const SignUpStep1Form = withForm({
  ...signUpFormOpts,
  render: (props) => {
    const steps = Steps.useSteps();

    return (
      <props.form.FormGroup
        name="step1"
        validators={{ onDynamic: SignUpFormStep1Schema }}
        onGroupSubmit={steps.goToNextStep}
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

            <props.form.AppField name="step1.name">
              {(field) => (
                <field.Fieldset label={m.auth_fieldName()}>
                  <field.TextInput type="text" class="w-full" required />
                  <field.FieldError />
                  <field.FieldHelper>{m.auth_fakeNameOk()}</field.FieldHelper>
                </field.Fieldset>
              )}
            </props.form.AppField>

            <props.form.AppField name="step1.email">
              {(field) => (
                <field.Fieldset label={m.auth_fieldEmail()}>
                  <field.TextInput type="email" class="w-full" required />
                  <field.FieldError />
                  <field.FieldHelper>{m.auth_fakeEmailOk()}</field.FieldHelper>
                </field.Fieldset>
              )}
            </props.form.AppField>

            <props.form.AppField name="step1.username">
              {(field) => (
                <field.Fieldset label={m.auth_fieldUsername()}>
                  <field.TextInput type="text" class="w-full" required />
                  <field.FieldError />
                </field.Fieldset>
              )}
            </props.form.AppField>

            <div class="mt-4 space-y-2">
              <props.form.AppForm>
                <props.form.SubmitButton
                  class="btn-block"
                  label={
                    <>
                      {m.auth_next()} <ArrowRightIcon class="size-4" />
                    </>
                  }
                  submittingLabel={m.auth_next()}
                />
              </props.form.AppForm>

              <props.form.OtherFormLink class="btn-block" to="/auth/login">
                {m.auth_alreadyHaveAccount()}
              </props.form.OtherFormLink>
            </div>
          </form>
        )}
      </props.form.FormGroup>
    );
  },
});
