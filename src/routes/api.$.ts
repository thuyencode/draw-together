import { createFileRoute } from "@tanstack/solid-router";
import { Elysia } from "elysia";
import { node } from "@elysia/node";
import { appV1 } from "~/api/v1";
import { authApp } from "~/features/auth/api";
import { sleep } from "~/features/shared/utils";

const delayPlugin = new Elysia().onBeforeHandle(async () => {
  if (process.env.NODE_ENV === "development") {
    await sleep(2000);
  }
});

export const elysiaApp = new Elysia({ prefix: "/api", adapter: node() })
  .use(delayPlugin)
  .use(authApp)
  .use(appV1);
const handle = ({ request }: { request: Request }) => elysiaApp.fetch(request);

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      DELETE: handle,
    },
  },
});

export type ElysiaApp = typeof elysiaApp;
