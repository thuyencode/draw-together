import { MongoClient } from "mongodb";

export const mongoClient = new MongoClient(process.env.DB_URI);
export const mongoDb = mongoClient.db(process.env.DB_NAME);
