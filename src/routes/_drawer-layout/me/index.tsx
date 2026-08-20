import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/_drawer-layout/me/")({
  component: MyAccountPage,
});

function MyAccountPage() {
  return <div>Hello "/_navbar-layout/me/"!</div>;
}
