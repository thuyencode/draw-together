import * as v from "valibot";

const ServerEnvSchema = v.object({
  DB_URL: v.pipe(v.string(), v.url(), v.startsWith("mongodb://")),
  DB_NAME: v.string(),
});

export type ServerEnv = v.InferOutput<typeof ServerEnvSchema>;

export const serverEnv = v.parse(ServerEnvSchema, process.env);
