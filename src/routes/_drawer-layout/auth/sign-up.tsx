import { createFileRoute } from "@tanstack/solid-router";
import { SignUpForm } from "~/features/auth/forms";

export const Route = createFileRoute(
  "/_drawer-layout/auth/sign-up",
)({
  component: SignUpPage,
});

function SignUpPage() {
  return <SignUpForm />;
}
