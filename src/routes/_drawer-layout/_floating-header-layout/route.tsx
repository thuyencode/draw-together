import { Outlet, createFileRoute } from "@tanstack/solid-router";
import { Suspense } from "solid-js";
import { FloatingHeader } from "~/features/shared/components";

export const Route = createFileRoute("/_drawer-layout/_floating-header-layout")(
  {
    component: FloatingHeaderLayout,
  },
);

function FloatingHeaderLayout() {
  return (
    <>
      <FloatingHeader />
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
