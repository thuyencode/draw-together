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
    // Temp fix for the "Session is not fresh" error
    freshAge: 0,
  },
  plugins: [username(), tanstackStartCookies()],
});
