import { describe, test, expect, mock, beforeEach } from "bun:test";
import { NextRequest } from "next/server";
import type { Resume } from "@/lib/db/resumes";

const mockGetById = mock((_id: number): Resume | undefined => undefined);
const mockUpdate = mock((_id: number, _changes: unknown): Resume | undefined => undefined);

mock.module("@/lib/db/resumes", () => ({
    getResumeRepository: () => ({
        getById: mockGetById,
        update: mockUpdate,
    }),
}));

const { POST } = await import("../route");

const BASE_RESUME: Resume = {
    id: 42,
    name: "Tailored Resume",
    latex: "\\section{Experience}\nSoftware engineer with 3 years experience.\n\\section{Skills}\nJavaScript, Python",
    job_id: 1,
    is_master: 0,
    created_at: "2024-01-01T00:00:00",
};

function makeRequest(id: string, body: unknown) {
    return new NextRequest(`http://localhost/api/resumes/${id}/apply-changes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("POST /api/resumes/[id]/apply-changes", () => {
    beforeEach(() => {
        mockGetById.mockReset();
        mockUpdate.mockReset();
    });

    test("happy path — applies all accepted changes and returns updated resume", async () => {
        const updated: Resume = { ...BASE_RESUME, latex: "\\section{Experience}\nBuilt scalable systems.\n\\section{Skills}\nJavaScript, Python" };
        mockGetById.mockReturnValue(BASE_RESUME);
        mockUpdate.mockReturnValue(updated);

        const res = await POST(makeRequest("42", {
            accepted: [{ section: "Experience", old: "Software engineer with 3 years experience.", new: "Built scalable systems." }],
        }), { params: Promise.resolve({ id: "42" }) });

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual(updated);
    });

    test("passes correctly replaced latex to update", async () => {
        mockGetById.mockReturnValue(BASE_RESUME);
        mockUpdate.mockReturnValue({ ...BASE_RESUME });

        await POST(makeRequest("42", {
            accepted: [{ section: "Skills", old: "JavaScript, Python", new: "TypeScript, Go, Rust" }],
        }), { params: Promise.resolve({ id: "42" }) });

        const expectedLatex =
            "\\section{Experience}\nSoftware engineer with 3 years experience.\n\\section{Skills}\nTypeScript, Go, Rust";
        expect(mockUpdate).toHaveBeenCalledWith(42, { latex: expectedLatex });
    });

    test("empty accepted array — saves resume unchanged", async () => {
        mockGetById.mockReturnValue(BASE_RESUME);
        mockUpdate.mockReturnValue(BASE_RESUME);

        const res = await POST(makeRequest("42", { accepted: [] }), {
            params: Promise.resolve({ id: "42" }),
        });

        expect(res.status).toBe(200);
        expect(mockUpdate).toHaveBeenCalledWith(42, { latex: BASE_RESUME.latex });
    });

    test("multiple accepted changes — all applied in order", async () => {
        mockGetById.mockReturnValue(BASE_RESUME);
        mockUpdate.mockReturnValue(BASE_RESUME);

        await POST(makeRequest("42", {
            accepted: [
                { section: "Experience", old: "Software engineer with 3 years experience.", new: "Senior engineer." },
                { section: "Skills", old: "JavaScript, Python", new: "TypeScript, Rust" },
            ],
        }), { params: Promise.resolve({ id: "42" }) });

        const expectedLatex =
            "\\section{Experience}\nSenior engineer.\n\\section{Skills}\nTypeScript, Rust";
        expect(mockUpdate).toHaveBeenCalledWith(42, { latex: expectedLatex });
    });

    test("resume not found — returns 404", async () => {
        mockGetById.mockReturnValue(undefined);

        const res = await POST(makeRequest("99", { accepted: [] }), {
            params: Promise.resolve({ id: "99" }),
        });

        expect(res.status).toBe(404);
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    test("invalid id — returns 400", async () => {
        const res = await POST(makeRequest("abc", { accepted: [] }), {
            params: Promise.resolve({ id: "abc" }),
        });

        expect(res.status).toBe(400);
        expect(mockGetById).not.toHaveBeenCalled();
    });

    test("missing accepted field — returns 400", async () => {
        const res = await POST(makeRequest("42", {}), {
            params: Promise.resolve({ id: "42" }),
        });

        expect(res.status).toBe(400);
        expect(mockGetById).not.toHaveBeenCalled();
    });

    test("accepted is not an array — returns 400", async () => {
        const res = await POST(makeRequest("42", { accepted: "not an array" }), {
            params: Promise.resolve({ id: "42" }),
        });

        expect(res.status).toBe(400);
    });

    test("change missing old field — returns 400", async () => {
        const res = await POST(makeRequest("42", {
            accepted: [{ section: "Skills", new: "TypeScript" }],
        }), { params: Promise.resolve({ id: "42" }) });

        expect(res.status).toBe(400);
    });

    test("invalid JSON body — returns 400", async () => {
        const req = new NextRequest("http://localhost/api/resumes/42/apply-changes", {
            method: "POST",
            body: "not json",
        });
        const res = await POST(req, { params: Promise.resolve({ id: "42" }) });

        expect(res.status).toBe(400);
    });
});
