import { queryOptions } from "@tanstack/solid-query";
import { fetchUserLocale } from "./functions";

export const createUserLocaleQueryOptions = () =>
  queryOptions({
    queryKey: ["getUserLocale"],
    queryFn: () => fetchUserLocale(),
  });
