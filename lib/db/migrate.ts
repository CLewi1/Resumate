import type { SqliteDb } from "./interface";

export function migrate(db: SqliteDb): void {
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
