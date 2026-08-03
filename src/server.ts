import handler from "@tanstack/solid-start/server-entry";
import { paraglideMiddleware } from "./paraglide/server";

export default {
  fetch(req: Request) {
    return paraglideMiddleware(req, () => handler.fetch(req));
  },
};
