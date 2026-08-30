import { Outlet, createFileRoute, redirect } from "@tanstack/solid-router";
import { MenuIcon } from "lucide-solid";
import { Suspense } from "solid-js";
import { Drawer } from "~/features/shared/components/ui";
import { createSessionQueryOptions } from "~/features/auth/queries";
import { MyAccountSidebar } from "~/features/account/components";

export const Route = createFileRoute("/_drawer-layout/_header-layout/me")({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const session = await queryClient.ensureQueryData(
      createSessionQueryOptions(),
    );

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
  component: MyAccountLayout,
});

function MyAccountLayout() {
  return (
    <Drawer.Provider>
      <Drawer.Root class="md:drawer-open max-md:drawer-end">
        <Drawer.Content
          as="main"
          class="overflow-scroll p-5 md:h-[calc(100dvh-65px)] md:px-10"
        >
          <Suspense>
            <Outlet />
          </Suspense>
        </Drawer.Content>

        <Drawer.Trigger class="btn-soft btn-circle btn-neutral is-drawer-open:z-20 fixed bottom-5 left-5 shadow md:hidden">
          <MenuIcon class="size-4" />
        </Drawer.Trigger>

        <Drawer.Side class="drawer-side is-drawer-close:overflow-visible border-base-content/30 border-r shadow md:h-[calc(100dvh-65px)]">
          <Drawer.Overlay class="md:hidden" />
          <MyAccountSidebar />
        </Drawer.Side>
      </Drawer.Root>
    </Drawer.Provider>
  );
}
