import { createFileRoute } from "@tanstack/solid-router";
import { Elysia } from "elysia";
import { appV1 } from "~/api/v1";

const delayPlugin = new Elysia().onBeforeHandle(() => {
  if (process.env.NODE_ENV === "development") {
    Bun.sleepSync(2000);
  }
});

const app = new Elysia({ prefix: "/api" }).use(delayPlugin).use(appV1);
const handle = ({ request }: { request: Request }) => app.fetch(request);

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      DELETE: handle,
    },
  },
});
