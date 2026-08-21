import { Outlet, createFileRoute } from "@tanstack/solid-router";
import { Suspense } from "solid-js";
import { Header } from "~/features/shared/components";

export const Route = createFileRoute("/_drawer-layout/_header-layout")({
  component: HeaderLayout,
});

function HeaderLayout() {
  return (
    <>
      <Header />
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
