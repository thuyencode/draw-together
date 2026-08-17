/// <reference types="vite/client" />\
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/solid-router";
import { ErrorBoundary } from "solid-js";
import { HydrationScript } from "solid-js/web";
import css from "../app.css?url";
import {
  ErrorComponent,
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
      <body class="bg-base-300 h-dvh min-h-dvh">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
