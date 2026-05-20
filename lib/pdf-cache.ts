import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

const CACHE_DIR = join(process.cwd(), "resumes");

function ensureDir() {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
}

export function getCachedPdf(id: number): Blob | null {
    const path = join(CACHE_DIR, `${id}.pdf`);
    if (!existsSync(path)) return null;
    return new Blob([readFileSync(path)], { type: "application/pdf" });
}

export function cachePdf(id: number, buffer: Buffer): void {
    ensureDir();
    writeFileSync(join(CACHE_DIR, `${id}.pdf`), buffer);
}

export function invalidatePdf(id: number): void {
    const path = join(CACHE_DIR, `${id}.pdf`);
    if (existsSync(path)) unlinkSync(path);
}
