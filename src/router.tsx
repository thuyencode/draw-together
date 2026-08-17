import { createRouter as createTanStackRouter } from "@tanstack/solid-router";
import { getQueryClient } from "./integrations/tanstack-query/client";
import { routeTree } from "./routeTree.gen";
import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime";
import { authClient } from "./integrations/better-auth/client";

export const getRouter = () =>
  createTanStackRouter({
    routeTree,
    context: {
      queryClient: getQueryClient(),
      authClient,
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
