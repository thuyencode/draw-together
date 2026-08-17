import handler from "@tanstack/solid-start/server-entry";
import * as v from "valibot";
import { paraglideMiddleware } from "./paraglide/server";
import { ServerEnvSchema } from "./configs/env/schema";

// Validate server-side env variables
const result = v.safeParse(ServerEnvSchema, process.env);
if (result.issues) {
  throw new Error(v.summarize(result.issues));
}

export default {
  fetch(req: Request) {
    return paraglideMiddleware(req, () => handler.fetch(req));
  },
};
