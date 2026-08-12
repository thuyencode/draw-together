import Elysia from "elysia";
import { authV1 } from "~/features/auth/api/v1";

export const appV1 = new Elysia({ prefix: "/v1" }).use(authV1);
