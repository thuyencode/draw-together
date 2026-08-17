import Elysia from "elysia";
import { auth } from "~/integrations/better-auth/server";

export const authApp = new Elysia()
  // Full path in the API: /api/auth
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

        return session;
      },
    },
  });
