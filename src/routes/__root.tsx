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
import type { QueryClient } from "@tanstack/solid-query";
import { createSessionQueryOptions } from "~/features/auth/queries";
import {
  ErrorComponent,
  NotFound,
  errorBoundaryFallBackProp,
} from "~/features/shared/components";
import { Toast } from "~/features/shared/components/ui";
import { m } from "~/paraglide/messages";
import { getLocale } from "~/paraglide/runtime";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(createSessionQueryOptions());
  },
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
    ],
  }),
  shellComponent: () => (
    <ErrorBoundary fallback={errorBoundaryFallBackProp}>
      <RootLayout />
    </ErrorBoundary>
  ),
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootLayout() {
  return (
    <html lang={getLocale()}>
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body class="h-dvh min-h-dvh">
        <Suspense>
          <Outlet />
        </Suspense>
        <Toast />
        <Scripts />
      </body>
    </html>
  );
}
