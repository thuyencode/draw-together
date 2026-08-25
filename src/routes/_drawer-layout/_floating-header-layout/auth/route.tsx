import { Outlet, createFileRoute, redirect } from "@tanstack/solid-router";
import { Suspense } from "solid-js";
import { sessionQueryOptions } from "~/features/auth/queries";

export const Route = createFileRoute(
  "/_drawer-layout/_floating-header-layout/auth",
)({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const session = await queryClient.ensureQueryData(sessionQueryOptions());

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
      <Suspense>
        <Outlet />
      </Suspense>
    </main>
  );
}
