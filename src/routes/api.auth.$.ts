import { createFileRoute } from "@tanstack/solid-router";
import { sleep } from "~/features/shared/utils";
import { auth } from "~/integrations/better-auth/server";

const delay = async (response: Promise<Response>) => {
  if (process.env.NODE_ENV === "development") {
    await sleep(2000);
  }

  return response;
};

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => delay(auth.handler(request)),
      POST: ({ request }: { request: Request }) => delay(auth.handler(request)),
    },
  },
});
