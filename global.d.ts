declare module "*.css";
declare module "*.scss";
declare module "*.sass";

declare module "bun:sqlite" {
    class Database {
        constructor(
            filename: string,
            options?: { create?: boolean; readonly?: boolean },
        );
        exec(sql: string): void;
        prepare<T = Record<string, unknown>>(sql: string): Statement<T>;
        transaction<T extends (...args: unknown[]) => unknown>(fn: T): T;
        close(): void;
    }

    interface Statement<T = Record<string, unknown>> {
        all(...params: unknown[]): T[];
        get(...params: unknown[]): T | null;
        run(...params: unknown[]): void;
    }
}
