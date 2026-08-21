import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute(
  "/_drawer-layout/_header-layout/me/profile",
)({
  component: EditProfilePage,
});

function EditProfilePage() {
  return <div>Hello "/_drawer-layout/me/profile"!</div>;
}
