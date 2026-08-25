import { queryOptions } from "@tanstack/solid-query";
import { getSession, getSessionList } from "./functions";

export const sessionListQueryOptions = () =>
  queryOptions({
    queryKey: ["auth", "api", "listSessions"],
    queryFn: () => getSessionList(),
  });

export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: ["auth", "api", "getSession"],
    queryFn: () => getSession(),
  });
