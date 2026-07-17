/// <reference types="vite/client" />\
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/solid-router";
import { Suspense } from "solid-js";
import { HydrationScript } from "solid-js/web";
import css from "../app.css?url";
import { ErrorComponent, NotFound } from "~/features/shared/components";

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
        title: "Draw Together",
      },
      {
        lang: "en",
      },
    ],
  }),
  shellComponent: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body class="h-dvh min-h-dvh">
        {/* <Header />*/}
        <Suspense>
          <Outlet />
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
