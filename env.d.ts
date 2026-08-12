import type { ServerEnv } from "~/configs/env.server";

declare module "bun" {
  interface Env extends ServerEnv {}
}
