import { createFileRoute } from "@tanstack/solid-router";
import { SignUpForm } from "~/features/auth/forms";

export const Route = createFileRoute("/_navbar-layout/auth/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  return <SignUpForm />;
}
