import { describe, test, expect, mock, beforeEach } from "bun:test";
import { NextRequest } from "next/server";
import type { Resume } from "@/lib/db/resumes";

const LATEX = "\\documentclass{article}\\begin{document}Hello\\end{document}";
const PDF_BYTES = Buffer.from("%PDF-1.4 fake");

const mockGetById = mock((_id: number): Resume | undefined => undefined);
const mockGetCachedPdf = mock((_id: number): Blob | null => null);
const mockCachePdf = mock((_id: number, _buf: Buffer): void => undefined);
const mockCompilePdf = mock((_latex: string): Promise<Blob> => Promise.resolve(new Blob([PDF_BYTES])));

mock.module("@/lib/db/resumes", () => ({
    getResumeRepository: () => ({ getById: mockGetById }),
}));

mock.module("@/lib/pdf-cache", () => ({
    getCachedPdf: mockGetCachedPdf,
    cachePdf: mockCachePdf,
    invalidatePdf: mock((_id: number): void => undefined),
}));

mock.module("@/lib/compile-pdf", () => ({
    compilePdf: mockCompilePdf,
}));

const { GET } = await import("../route");

const BASE_RESUME: Resume = {
    id: 1,
    name: "My Resume",
    latex: LATEX,
    job_id: null,
    is_master: 0,
    created_at: "2024-01-01T00:00:00",
};

function makeRequest(id: string) {
    return new NextRequest(`http://localhost/api/resumes/${id}/pdf`);
}

describe("GET /api/resumes/[id]/pdf", () => {
    beforeEach(() => {
        mockGetById.mockReset();
        mockGetCachedPdf.mockReset();
        mockCachePdf.mockReset();
        mockCompilePdf.mockReset();
        mockGetCachedPdf.mockReturnValue(null);
    });

    test("returns cached PDF without calling compilePdf", async () => {
        const cachedBlob = new Blob([PDF_BYTES], { type: "application/pdf" });
        mockGetCachedPdf.mockReturnValue(cachedBlob);

        const res = await GET(makeRequest("1"), { params: Promise.resolve({ id: "1" }) });

        expect(res.status).toBe(200);
        expect(res.headers.get("content-type")).toBe("application/pdf");
        expect(mockCompilePdf).not.toHaveBeenCalled();
        expect(mockGetById).not.toHaveBeenCalled();
    });

    test("compiles PDF on cache miss and caches the result", async () => {
        mockGetById.mockReturnValue(BASE_RESUME);
        mockCompilePdf.mockResolvedValue(new Blob([PDF_BYTES]));

        const res = await GET(makeRequest("1"), { params: Promise.resolve({ id: "1" }) });

        expect(res.status).toBe(200);
        expect(res.headers.get("content-type")).toBe("application/pdf");
        expect(mockCompilePdf).toHaveBeenCalledWith(LATEX);
        expect(mockCachePdf).toHaveBeenCalledWith(1, expect.any(Buffer));
    });

    test("returns 404 when resume does not exist", async () => {
        mockGetById.mockReturnValue(undefined);

        const res = await GET(makeRequest("99"), { params: Promise.resolve({ id: "99" }) });

        expect(res.status).toBe(404);
        expect(mockCompilePdf).not.toHaveBeenCalled();
    });

    test("returns 502 when compilePdf fails (e.g. TEXAPI_KEY absent)", async () => {
        mockGetById.mockReturnValue(BASE_RESUME);
        mockCompilePdf.mockRejectedValue(
            Object.assign(new Error("LaTeX compilation failed (401)"), { status: 401 }),
        );

        const res = await GET(makeRequest("1"), { params: Promise.resolve({ id: "1" }) });

        expect(res.status).toBe(502);
        const data = await res.json();
        expect(data.error).toBeTruthy();
    });

    test("returns 400 for non-numeric id", async () => {
        const res = await GET(makeRequest("abc"), { params: Promise.resolve({ id: "abc" }) });

        expect(res.status).toBe(400);
        expect(mockCompilePdf).not.toHaveBeenCalled();
    });

    test("returns 400 for id zero", async () => {
        const res = await GET(makeRequest("0"), { params: Promise.resolve({ id: "0" }) });

        expect(res.status).toBe(400);
    });
});
