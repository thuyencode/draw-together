import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/solid-router";
import type { Decorator } from "storybook-solidjs-vite";

export const withRouter: Decorator = (Story, context) => {
  const path = context.parameters.router?.path ?? "/";

  const rootRoute = createRootRoute({
    component: () => <Outlet />,
  });
  const storyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: () => <Story />,
  });

  rootRoute.addChildren([storyRoute]);

  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  return <RouterProvider router={router} />;
};
