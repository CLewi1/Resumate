import type { Database } from "bun:sqlite";
import path from "path";

const DB_PATH = path.join(process.cwd(), "jobs.db");

let _db: Database | null = null;

export async function openDb(filepath: string): Promise<Database> {
    const { Database: Db } = await import("bun:sqlite");
    const db = new Db(filepath, { create: true });
    db.exec("PRAGMA journal_mode=WAL");
    db.exec("PRAGMA foreign_keys=ON");
    migrate(db);
    return db;
}

export async function getDb(): Promise<Database> {
    if (!_db) {
        _db = await openDb(DB_PATH);
    }
    return _db;
}

function migrate(db: Database): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            description TEXT NOT NULL,
            linkedin_url TEXT NOT NULL UNIQUE,
            captured_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            latex TEXT NOT NULL,
            job_id INTEGER REFERENCES jobs(id),
            is_master INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `);
}
