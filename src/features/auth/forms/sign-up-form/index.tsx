import { revalidateLogic } from "@tanstack/solid-form";
import { useNavigate } from "@tanstack/solid-router";
import { Index, createSignal } from "solid-js";
import { signUpFormOpts } from "./options";
import { SignUpFormMultiStepSchema } from "./schema";
import { SignUpStep1Form } from "./step1-subform";
import { SignUpStep2Form } from "./step2-subform";
import { Steps } from "~/features/shared/components/ui";
import { useAppForm } from "~/features/shared/hooks/form";
import { sleep } from "~/features/shared/utils";
import { authClient } from "~/integrations/better-auth/client";
import { m } from "~/paraglide/messages";

const signUpStepLabels = [
  m.auth_signUp_stepProfile,
  m.auth_signUp_stepPassword,
];

export function SignUpForm() {
  const navigate = useNavigate();
  const [rootError, setRootError] = createSignal<string[]>([]);

  const form = useAppForm(() => ({
    ...signUpFormOpts,
    validationLogic: revalidateLogic(),
    validators: {
      // onDynamic is only used when `form.handleSubmit` is called itself.
      // When `form.FormGroup`'s `handleSubmit` is called, it will only validate the current step's schema.
      // This means that this schema will not be called when the user submits the form group, but instead when they submit the entire form.
      onDynamic: SignUpFormMultiStepSchema,
    },
    onSubmit: async ({ value }) => {
      if (import.meta.env.MODE === "development") {
        await sleep(2000);
      }

      await authClient.signUp.email(
        {
          email: value.step1.email,
          name: value.step1.name,
          username: value.step1.username,
          password: value.step2.password,
        },
        {
          onError: (ctx) => {
            setRootError([ctx.error.message]);
          },
          onSuccess: () => {
            navigate({ to: "/" });
          },
        },
      );
    },
  }));

  return (
    <Steps.Root count={signUpStepLabels.length}>
      <Steps.List class="w-full max-w-sm">
        <Index each={signUpStepLabels}>
          {(item, index) => (
            <Steps.Item index={index} stepClass="step-neutral">
              {item()()}
            </Steps.Item>
          )}
        </Index>
      </Steps.List>

      <section class="card bg-base-200 border-base-content/30 w-full max-w-md border shadow">
        <div class="card-body">
          <h1 class="card-title justify-center text-2xl">{m.auth_signUp()}</h1>

          <form.FormError errors={rootError()} />

          <Steps.Content index={0}>
            <SignUpStep1Form form={form} />
          </Steps.Content>
          <Steps.Content index={1}>
            <SignUpStep2Form form={form} />
          </Steps.Content>
        </div>
      </section>
    </Steps.Root>
  );
}
