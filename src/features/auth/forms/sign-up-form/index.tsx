import { revalidateLogic } from "@tanstack/solid-form";
import { useNavigate } from "@tanstack/solid-router";
import { KeyRoundIcon, UserRoundIcon } from "lucide-solid";
import { For, createSignal } from "solid-js";
import { useQueryClient } from "@tanstack/solid-query";
import { createSessionQueryOptions } from "../../queries";
import { signUpFormOpts } from "./options";
import { SignUpFormMultiStepSchema } from "./schema";
import { SignUpStep1Form } from "./step1-subform";
import { SignUpStep2Form } from "./step2-subform";
import type { LucideIcon } from "lucide-solid";
import type { LocalizedString } from "@inlang/paraglide-js";
import { Steps } from "~/features/shared/components/ui";
import { useAppForm } from "~/features/shared/hooks/form";
import { authClient } from "~/integrations/better-auth/client";
import { m } from "~/paraglide/messages";
import { toaster } from "~/integrations/ark-ui/toast";

const signUpStepLabels: {
  label: () => LocalizedString;
  Icon: LucideIcon;
}[] = [
  { label: m.auth_signUp_stepProfile, Icon: UserRoundIcon },
  { label: m.auth_signUp_stepPassword, Icon: KeyRoundIcon },
];

export function SignUpForm() {
  const queryClient = useQueryClient();
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
            toaster.promise(
              async () => {
                await queryClient.invalidateQueries(
                  createSessionQueryOptions(),
                );
                const urlParams = new URLSearchParams(window.location.search);
                await navigate({
                  viewTransition: true,
                  to: urlParams.get("redirect") ?? "/",
                });
              },
              { loading: { title: "Please wait..." } },
            );
          },
        },
      );
    },
  }));

  return (
    <Steps.Root count={signUpStepLabels.length}>
      <Steps.List class="w-full max-w-sm">
        <For each={signUpStepLabels}>
          {(item, index) => (
            <Steps.Item index={index()} stepClass="step-info">
              <Steps.Icon>
                <item.Icon />
              </Steps.Icon>
              {item.label()}
            </Steps.Item>
          )}
        </For>
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
