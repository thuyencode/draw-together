import { Outlet, createFileRoute } from "@tanstack/solid-router";
import { Suspense } from "solid-js";
import { MobileNavbar } from "~/features/shared/components";
import { Drawer } from "~/features/shared/components/ui";

export const Route = createFileRoute("/_drawer-layout")({
  component: DrawerLayout,
});

function DrawerLayout() {
  return (
    <Drawer.Provider>
      <Drawer.Root class="drawer-end">
        <Drawer.Content class="flex min-h-dvh flex-col">
          <Suspense>
            <Outlet />
          </Suspense>
        </Drawer.Content>
        <Drawer.Side class="sm:hidden">
          <Drawer.Overlay />
          <MobileNavbar />
        </Drawer.Side>
      </Drawer.Root>
    </Drawer.Provider>
  );
}
