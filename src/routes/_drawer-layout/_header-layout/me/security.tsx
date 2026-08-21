import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute(
  "/_drawer-layout/_header-layout/me/security",
)({
  component: AccountSecurityPage,
});

function AccountSecurityPage() {
  return <div>Hello "/_drawer-layout/me/password"!</div>;
}
