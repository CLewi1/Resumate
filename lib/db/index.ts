import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "jobs.db");

let _db: Database.Database | null = null;

export function openDb(filepath: string): Database.Database {
    const db = new Database(filepath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    migrate(db);
    return db;
}

export function getDb(): Database.Database {
    if (!_db) _db = openDb(DB_PATH);
    return _db;
}

function migrate(db: Database.Database): void {
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
