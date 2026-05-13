import Database from "better-sqlite3";
import path from "path";
import { migrate } from "./migrate";
import type { SqliteDb, SqliteStatement } from "./interface";

const DB_PATH = path.join(process.cwd(), "jobs.db");

let _db: SqliteDb | null = null;

// better-sqlite3 strips $ from SQL placeholders when looking up keys, so
// { $name: val } won't match $name — it looks for "name". Strip the prefix
// here so repository code can use $-prefixed keys for both libraries.
function normalizeParams(params: unknown[]): unknown[] {
    if (
        params.length === 1 &&
        typeof params[0] === "object" &&
        params[0] !== null &&
        !Array.isArray(params[0])
    ) {
        const obj = params[0] as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(obj)) {
            out[k.replace(/^\$/, "")] = v;
        }
        return [out];
    }
    return params;
}

function wrapStatement(stmt: Database.Statement): SqliteStatement {
    return {
        get(...params) { return stmt.get(...normalizeParams(params)); },
        all(...params) { return stmt.all(...normalizeParams(params)); },
        run(...params) { stmt.run(...normalizeParams(params)); },
    };
}

function wrapDb(db: Database.Database): SqliteDb {
    return {
        prepare(sql) { return wrapStatement(db.prepare(sql)); },
        exec(sql) { db.exec(sql); },
        transaction(fn) { return db.transaction(fn) as () => void; },
    };
}

export function openDb(filepath: string): SqliteDb {
    const db = new Database(filepath);
    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA foreign_keys = ON");
    const wrapped = wrapDb(db);
    migrate(wrapped);
    return wrapped;
}

export function getDb(): SqliteDb {
    if (!_db) _db = openDb(DB_PATH);
    return _db;
}
