
import { drizzle } from "drizzle-orm/pg";
import { pgTable, serial, text, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import * as schema from "@shared/schema";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL is not set. Using fallback mode. Database operations may fail.");
}

// For Vercel serverless, we need to handle the connection properly
// Using the postgres driver for Drizzle ORM
import postgres from "postgres";

// Create a connection pool for PostgreSQL
const connectionString = databaseUrl || "postgresql://localhost:5432/channel_exchange";

const client = postgres(connectionString, {
  max: 1, // Limit connections for serverless
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
