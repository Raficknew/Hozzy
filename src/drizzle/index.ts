import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/data/env/server";
import * as schema from "./schema";

export const db = drizzle({
  schema,
  connection: {
    connectionString: env.DATABASE_URL,
    ssl: false,
  },
});
