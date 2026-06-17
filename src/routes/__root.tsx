/// <reference types="vite/client" />\
import {
  createRootRouteWithContext,
  ErrorComponent,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/solid-router";
import { Suspense } from "solid-js";
import { HydrationScript } from "solid-js/web";
import { Header, NotFound } from "~/features/shared/components";
import css from "../app.css?url";

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
      <body>
        <Header />
        <Suspense>
          <Outlet />
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
