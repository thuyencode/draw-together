import { queryOptions } from "@tanstack/solid-query";
import { fetchSession, fetchSessionList } from "./functions";

export const createSessionListQueryOptions = () =>
  queryOptions({
    queryKey: ["auth", "api", "listSessions"],
    queryFn: () => fetchSessionList(),
  });

export const createSessionQueryOptions = () =>
  queryOptions({
    queryKey: ["auth", "api", "getSession"],
    queryFn: () => fetchSession(),
  });
