export interface SqliteStatement {
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
    run(...params: unknown[]): void;
}

export interface SqliteDb {
    prepare(sql: string): SqliteStatement;
    exec(sql: string): void;
    transaction(fn: () => void): () => void;
}
