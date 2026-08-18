import { revalidateLogic } from "@tanstack/solid-form";
import { Match, Switch, createSignal } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";
import { SignUpFormMultiStepSchema } from "./schema";
import { signUpFormOpts } from "./options";
import { SignUpStep1Form } from "./step1-subform";
import { SignUpStep2Form } from "./step2-subform";
import { authClient } from "~/integrations/better-auth/client";
import { sleep } from "~/features/shared/utils";
import { useAppForm } from "~/features/shared/hooks/form";
import { m } from "~/paraglide/messages";

export function SignUpForm() {
  const navigate = useNavigate();
  const [step, setStep] = createSignal(0);
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
    <>
      <ul class="steps w-full max-w-sm">
        <li class="step" classList={{ "step-neutral": step() <= 1 }}>
          {m.auth_stepProfile()}
        </li>
        <li class="step" classList={{ "step-neutral": step() === 1 }}>
          {m.auth_stepPassword()}
        </li>
      </ul>

      <section class="card bg-base-200 border-base-content/30 w-full max-w-md border shadow">
        <div class="card-body">
          <h1 class="card-title justify-center text-2xl">{m.auth_signUp()}</h1>

          <form.FormError errors={rootError()} />

          <Switch>
            <Match when={step() === 0}>
              <SignUpStep1Form form={form} step={step()} setStep={setStep} />
            </Match>
            <Match when={step() === 1}>
              <SignUpStep2Form form={form} step={step()} setStep={setStep} />
            </Match>
          </Switch>
        </div>
      </section>
    </>
  );
}
