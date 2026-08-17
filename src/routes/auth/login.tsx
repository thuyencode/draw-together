import { createFileRoute } from "@tanstack/solid-router";
import { LogInForm } from "~/features/auth/forms";
import { m } from "~/paraglide/messages";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div class="card-body gap-5">
      <h1 class="card-title justify-center text-2xl">{m.auth_logIn()}</h1>
      <LogInForm class="space-y-3" />
    </div>
  );
}
