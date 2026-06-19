import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Single local SQLite file, checked into the repo with seed data so the app
// runs immediately after clone. better-sqlite3 is synchronous, which is a fine
// fit for a local dev/workshop database.
const sqlite = new Database("sqlite.db");

export const db = drizzle(sqlite, { schema });
