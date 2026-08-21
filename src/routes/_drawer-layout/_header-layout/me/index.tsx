import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/_drawer-layout/_header-layout/me/")({
  component: AccountOverviewPage,
});

function AccountOverviewPage() {
  return <div>Hello "/_navbar-layout/me/"!</div>;
}
