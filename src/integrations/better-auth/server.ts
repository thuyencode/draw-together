import { betterAuth } from "better-auth/minimal";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start/solid";
import { mongoClient, mongoDb } from "../mongodb/client.server";

export const auth = betterAuth({
  database: mongodbAdapter(mongoDb, {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  plugins: [username(), tanstackStartCookies()],
});
