import { createRouter as createTanStackRouter } from "@tanstack/solid-router";
import { getQueryClient } from "./integrations/tanstack-query/client";
import { routeTree } from "./routeTree.gen";
import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime";

export const getRouter = () =>
  createTanStackRouter({
    routeTree,
    context: {
      queryClient: getQueryClient(),
    },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
  });

declare module "@tanstack/solid-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
