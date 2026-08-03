import { createFileRoute } from "@tanstack/solid-router";
import { Elysia } from "elysia";

const app = new Elysia({
  prefix: "/api",
}).get("/", "Hello Elysia!");

const handle = ({ request }: { request: Request }) => app.fetch(request);

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
