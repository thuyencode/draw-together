import { createFileRoute } from "@tanstack/solid-router";
import { SignUpForm } from "~/features/auth/forms";
import { m } from "~/paraglide/messages";

export const Route = createFileRoute("/_navbar-layout/auth/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div class="card-body gap-5">
      <h1 class="card-title justify-center text-2xl">{m.auth_signUp()}</h1>
      <SignUpForm class="space-y-3" />
    </div>
  );
}
