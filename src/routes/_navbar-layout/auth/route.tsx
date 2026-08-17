import { Outlet, createFileRoute, redirect } from "@tanstack/solid-router";
import { getSession } from "~/features/auth/functions";

export const Route = createFileRoute("/_navbar-layout/auth")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    if (session) {
      throw redirect({ to: "/" });
    }

    if (location.pathname === "/auth") {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <main class="flex h-full flex-col items-center justify-center gap-5 p-4">
      <section class="card bg-base-100 w-full max-w-md shadow-sm">
        <Outlet />
      </section>
    </main>
  );
}
