import { createIsomorphicFn } from "@tanstack/solid-start";
import { treaty } from "@elysia/eden";
import type { ElysiaApp } from "~/routes/api.$";
import { elysiaApp } from "~/routes/api.$";

export const getTreaty = createIsomorphicFn()
  .server(() => treaty(elysiaApp).api)
  .client(() => treaty<ElysiaApp>(import.meta.env.VITE_PUBLIC_URL).api);
