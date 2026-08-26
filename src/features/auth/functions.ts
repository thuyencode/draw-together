import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { auth } from "~/integrations/better-auth/server";

export const fetchSession = createServerFn({ method: "GET" }).handler(() => {
  const headers = getRequestHeaders();
  return auth.api.getSession({ headers });
});

export const fetchSessionList = createServerFn({ method: "GET" }).handler(
  () => {
    const headers = getRequestHeaders();
    return auth.api.listSessions({ headers });
  },
);
