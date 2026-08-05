/// <reference types="vite/client" />\
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/solid-router";
import { ErrorBoundary, Suspense } from "solid-js";
import { HydrationScript } from "solid-js/web";
import css from "../app.css?url";
import { Drawer } from "~/features/shared/components/ui";
import {
  ErrorComponent,
  Header,
  MobileNavbar,
  NotFound,
  errorBoundaryFallBackProp,
} from "~/features/shared/components";
import { getLocale } from "~/paraglide/runtime";
import { m } from "~/paraglide/messages";

export const Route = createRootRouteWithContext()({
  head: () => ({
    links: [{ rel: "stylesheet", href: css }],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: m.app_name(),
      },
      {
        lang: "en",
      },
    ],
  }),
  shellComponent: () => (
    <ErrorBoundary fallback={errorBoundaryFallBackProp}>
      <RootComponent />
    </ErrorBoundary>
  ),
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <html lang={getLocale()}>
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body class="h-dvh min-h-dvh">
        <Drawer.Provider>
          <Drawer.Root class="drawer-end">
            <Drawer.Content class="flex min-h-dvh flex-col">
              <Header />
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
        <Scripts />
      </body>
    </html>
  );
}
