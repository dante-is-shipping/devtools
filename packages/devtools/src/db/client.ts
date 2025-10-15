import { MongoClient } from "mongodb";
import { AppConfig } from "@/lib/config";

declare global {
  var mongoClient: MongoClient | undefined;
}

if (!AppConfig.mongoUri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoClient;

if (!cached) {
  cached = global.mongoClient = new MongoClient(AppConfig.mongoUri);
}

export const mongoClient = cached;
export const db = mongoClient.db();