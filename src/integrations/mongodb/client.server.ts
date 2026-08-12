import { MongoClient } from "mongodb";
import type { Db } from "mongodb";
import { serverEnv } from "~/configs/env.server";

const client = new MongoClient(serverEnv.DB_URL);
let dbPromise: Promise<Db> | null = null;

/**
 * Returns a shared MongoDB database handle, connecting lazily on first use.
 * The client is a singleton reused across all requests.
 */
export function getDb() {
  if (!dbPromise) {
    dbPromise = client.connect().then(() => client.db(serverEnv.DB_NAME));
  }
  return dbPromise;
}
