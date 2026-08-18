import { createFileRoute } from "@tanstack/solid-router";
import { LogInForm } from "~/features/auth/forms";

export const Route = createFileRoute("/_navbar-layout/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  return <LogInForm />;
}
