import { Database } from "bun:sqlite";
import { migrate } from "../migrate";
import type { SqliteDb } from "../interface";

export function createTestDb(): SqliteDb {
    const db = new Database(":memory:");
    db.exec("PRAGMA foreign_keys = ON");
    migrate(db as unknown as SqliteDb);
    return db as unknown as SqliteDb;
}
