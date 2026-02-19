import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./shared/schema.js";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

// This will create the tables if they don't exist
console.log("Database initialized");
sqlite.close();
