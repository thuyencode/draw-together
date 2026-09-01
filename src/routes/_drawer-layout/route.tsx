import { Outlet, createFileRoute } from "@tanstack/solid-router";
import { Suspense } from "solid-js";
import { Header, NavMenu, Sidebar } from "~/features/shared/components";
import { Drawer } from "~/features/shared/components/ui";

export const Route = createFileRoute("/_drawer-layout")({
  component: DrawerLayout,
});

function DrawerLayout() {
  return (
    <Drawer.Provider>
      <Drawer.Root class="md:drawer-open max-md:drawer-end">
        <Drawer.Content class="flex min-h-dvh flex-col overflow-scroll">
          <Header />
          <Suspense>
            <Outlet />
          </Suspense>
        </Drawer.Content>

        <Drawer.Side class="drawer-side is-drawer-close:overflow-visible border-base-content/30 h-dvh border-r shadow">
          <Drawer.Overlay class="md:hidden" />

          <Sidebar>
            <NavMenu />
          </Sidebar>
        </Drawer.Side>
      </Drawer.Root>
    </Drawer.Provider>
  );
}
