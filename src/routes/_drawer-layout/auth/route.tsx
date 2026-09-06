import { Outlet, createFileRoute, redirect } from "@tanstack/solid-router";
import { Suspense } from "solid-js";
import { createSessionQueryOptions } from "~/features/auth/queries";
import { getRedirect } from "~/features/shared/utils/url";

export const Route = createFileRoute("/_drawer-layout/auth")({
  beforeLoad: async ({ context: { queryClient }, location, search }) => {
    const session = await queryClient.ensureQueryData(
      createSessionQueryOptions(),
    );

    if (session) {
      throw redirect({ to: getRedirect(location.searchStr) ?? "/" });
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
