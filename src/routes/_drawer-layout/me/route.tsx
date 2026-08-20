import { Outlet, createFileRoute, redirect } from "@tanstack/solid-router";
import { getSession } from "~/features/auth/functions";
import { Header } from "~/features/shared/components";

export const Route = createFileRoute("/_drawer-layout/me")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    if (!session) {
      throw redirect({
        to: "/auth/login",
        // Use the current location to power a redirect after login
        // (Do not use `router.state.resolvedLocation` as it can
        // potentially lag behind the actual current location)
        search: { redirect: location.href },
      });
    }
  },
  component: HeaderLayout,
});

function HeaderLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
