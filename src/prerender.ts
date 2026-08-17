import { locales, localizeHref } from "./paraglide/runtime";
import type { FileRouteTypes } from "./routeTree.gen";

/**
 * Static routes that can be prerendered. Dynamic routes (e.g. `/trial`
 * which reads search params) and API routes are intentionally excluded.
 */
const staticRoutes: FileRouteTypes["fullPaths"][] = [
  "/",
  "/rooms/",
  "/auth/login",
  "/auth/sign-up",
];

/**
 * Generates the localized prerender pages for every configured locale.
 * Each static route is expanded into one page per locale (e.g. `/en`,
 * `/vi`, `/en/rooms/`, `/vi/rooms/`).
 */
export const prerenderRoutes = staticRoutes.flatMap((path) =>
  locales.map((locale) => ({
    path: localizeHref(path, { locale }),
    prerender: { enabled: true },
  })),
);
