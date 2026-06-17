import { createRouter as createTanStackRouter } from "@tanstack/solid-router";
import { getContext } from "./integrations/tanstack-query/provider";
import { routeTree } from "./routeTree.gen";

export const getRouter = () =>
  createTanStackRouter({
    routeTree,
    context: getContext(),
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

declare module "@tanstack/solid-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
