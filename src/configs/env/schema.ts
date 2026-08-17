import * as v from "valibot";

export const ServerEnvSchema = v.object({
  DB_URI: v.pipe(v.string(), v.url(), v.startsWith("mongodb://")),
  DB_NAME: v.pipe(v.string(), v.nonEmpty()),
  BETTER_AUTH_SECRET: v.pipe(v.string(), v.nonEmpty()),
  BETTER_AUTH_URL: v.pipe(v.string(), v.url()),
});

type ServerEnv = v.InferOutput<typeof ServerEnvSchema>;

export default ServerEnv;
