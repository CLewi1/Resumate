import { describe, test, expect, mock, beforeEach } from "bun:test";
import { NextRequest } from "next/server";
import type { Job } from "@/lib/db/jobs";
import type { Resume } from "@/lib/db/resumes";
import type { Change } from "@/lib/tailor";

const mockGetJobById = mock((_id: number): Job | undefined => undefined);
const mockGetMaster = mock((): Resume | undefined => undefined);
const mockSaveResume = mock((_r: unknown): Resume => ({} as Resume));
const mockTailorResume = mock(async (_latex: string, _desc: string): Promise<Change[]> => []);

mock.module("@/lib/db/jobs", () => ({
    getJobRepository: () => ({ getById: mockGetJobById }),
}));

mock.module("@/lib/db/resumes", () => ({
    getResumeRepository: () => ({
        getMaster: mockGetMaster,
        save: mockSaveResume,
    }),
}));

mock.module("@/lib/tailor", () => ({
    tailorResume: mockTailorResume,
}));

const { POST } = await import("../route");

const SAMPLE_JOB: Job = {
    id: 1,
    title: "Software Engineer",
    company: "Acme Corp",
    description: "Build cool things",
    linkedin_url: "https://linkedin.com/jobs/1",
    captured_at: "2024-01-01T00:00:00",
};

const SAMPLE_MASTER: Resume = {
    id: 10,
    name: "My Master Resume",
    latex: "\\documentclass{article}\\begin{document}Hello\\end{document}",
    job_id: null,
    is_master: 1,
    created_at: "2024-01-01T00:00:00",
};

const SAMPLE_TAILORED: Resume = {
    id: 20,
    name: "Software Engineer at Acme Corp",
    latex: SAMPLE_MASTER.latex,
    job_id: 1,
    is_master: 0,
    created_at: "2024-01-01T00:00:00",
};

const SAMPLE_CHANGES: Change[] = [
    { section: "Experience", old: "Hello", new: "Built cool things at scale" },
];

function makeRequest(body: unknown) {
    return new NextRequest("http://localhost/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("POST /api/tailor", () => {
    beforeEach(() => {
        mockGetJobById.mockReset();
        mockGetMaster.mockReset();
        mockSaveResume.mockReset();
        mockTailorResume.mockReset();
    });

    test("happy path — returns resumeId and changes", async () => {
        mockGetJobById.mockReturnValue(SAMPLE_JOB);
        mockGetMaster.mockReturnValue(SAMPLE_MASTER);
        mockTailorResume.mockResolvedValue(SAMPLE_CHANGES);
        mockSaveResume.mockReturnValue(SAMPLE_TAILORED);

        const res = await POST(makeRequest({ jobId: 1 }));

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.resumeId).toBe(20);
        expect(data.changes).toEqual(SAMPLE_CHANGES);
    });

    test("saves new resume with master latex linked to job", async () => {
        mockGetJobById.mockReturnValue(SAMPLE_JOB);
        mockGetMaster.mockReturnValue(SAMPLE_MASTER);
        mockTailorResume.mockResolvedValue(SAMPLE_CHANGES);
        mockSaveResume.mockReturnValue(SAMPLE_TAILORED);

        await POST(makeRequest({ jobId: 1 }));

        expect(mockSaveResume).toHaveBeenCalledWith({
            name: "Software Engineer at Acme Corp",
            latex: SAMPLE_MASTER.latex,
            job_id: 1,
        });
    });

    test("no master resume — returns 422 with descriptive message", async () => {
        mockGetJobById.mockReturnValue(SAMPLE_JOB);
        mockGetMaster.mockReturnValue(undefined);

        const res = await POST(makeRequest({ jobId: 1 }));

        expect(res.status).toBe(422);
        const data = await res.json();
        expect(data.error).toContain("master resume");
        expect(mockTailorResume).not.toHaveBeenCalled();
    });

    test("job not found — returns 404", async () => {
        mockGetJobById.mockReturnValue(undefined);

        const res = await POST(makeRequest({ jobId: 99 }));

        expect(res.status).toBe(404);
        expect(mockTailorResume).not.toHaveBeenCalled();
    });

    test("Anthropic failure — returns 502", async () => {
        mockGetJobById.mockReturnValue(SAMPLE_JOB);
        mockGetMaster.mockReturnValue(SAMPLE_MASTER);
        mockTailorResume.mockRejectedValue(new Error("API failure"));

        const res = await POST(makeRequest({ jobId: 1 }));

        expect(res.status).toBe(502);
        expect(mockSaveResume).not.toHaveBeenCalled();
    });

    test("missing jobId — returns 400", async () => {
        const res = await POST(makeRequest({}));
        expect(res.status).toBe(400);
    });

    test("non-integer jobId — returns 400", async () => {
        const res = await POST(makeRequest({ jobId: "abc" }));
        expect(res.status).toBe(400);
    });

    test("invalid JSON body — returns 400", async () => {
        const req = new NextRequest("http://localhost/api/tailor", {
            method: "POST",
            body: "not json",
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
    });
});
