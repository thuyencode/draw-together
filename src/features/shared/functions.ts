import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { parse } from "accept-language-parser";

export const fetchUserLocale = createServerFn({ method: "GET" }).handler(() => {
  const headers = getRequestHeaders();
  const locales = parse(headers.get("Accept-Language") ?? "en-GB");

  return locales[0].region
    ? `${locales[0].code}-${locales[0].region}`
    : locales[0].code;
});
