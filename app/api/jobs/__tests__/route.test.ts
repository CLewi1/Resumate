import { describe, test, expect, mock, beforeEach } from "bun:test";
import { NextRequest } from "next/server";
import type { Job } from "@/lib/db/jobs";

const mockInsert = mock((_job: unknown): Job | undefined => undefined);
const mockGetByLinkedinUrl = mock((_url: string): Job | undefined => undefined);

mock.module("@/lib/db/jobs", () => ({
    getJobRepository: () => ({
        insert: mockInsert,
        getByLinkedinUrl: mockGetByLinkedinUrl,
    }),
}));

const { POST } = await import("../route");

const VALID_PAYLOAD = {
    title: "Software Engineer",
    company: "Acme Corp",
    description: "Build cool things",
    linkedinUrl: "https://linkedin.com/jobs/1",
};

const STORED_JOB: Job = {
    id: 1,
    title: "Software Engineer",
    company: "Acme Corp",
    description: "Build cool things",
    linkedin_url: "https://linkedin.com/jobs/1",
    captured_at: "2024-01-01T00:00:00",
};

function makeRequest(body: unknown) {
    return new NextRequest("http://localhost/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("POST /api/jobs", () => {
    beforeEach(() => {
        mockInsert.mockReset();
        mockGetByLinkedinUrl.mockReset();
    });

    test("happy path — returns 201 with id and url", async () => {
        mockInsert.mockReturnValue(STORED_JOB);

        const res = await POST(makeRequest(VALID_PAYLOAD));

        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.id).toBe(1);
        expect(data.url).toBe("/jobs/1");
        expect(data.duplicate).toBe(false);
    });

    test("duplicate URL — returns 200 with existing record", async () => {
        const existing: Job = { ...STORED_JOB, id: 5 };
        mockInsert.mockReturnValue(undefined);
        mockGetByLinkedinUrl.mockReturnValue(existing);

        const res = await POST(makeRequest(VALID_PAYLOAD));

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.id).toBe(5);
        expect(data.url).toBe("/jobs/5");
        expect(data.duplicate).toBe(true);
    });

    test("missing title — returns 400 with error message", async () => {
        const { title: _, ...payload } = VALID_PAYLOAD;
        const res = await POST(makeRequest(payload));
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toContain("required");
    });

    test("missing company — returns 400", async () => {
        const { company: _, ...payload } = VALID_PAYLOAD;
        const res = await POST(makeRequest(payload));
        expect(res.status).toBe(400);
    });

    test("missing description — returns 400", async () => {
        const { description: _, ...payload } = VALID_PAYLOAD;
        const res = await POST(makeRequest(payload));
        expect(res.status).toBe(400);
    });

    test("missing linkedinUrl — returns 400", async () => {
        const { linkedinUrl: _, ...payload } = VALID_PAYLOAD;
        const res = await POST(makeRequest(payload));
        expect(res.status).toBe(400);
    });

    test("empty string fields — returns 400", async () => {
        const res = await POST(makeRequest({ ...VALID_PAYLOAD, title: "" }));
        expect(res.status).toBe(400);
    });

    test("invalid JSON body — returns 400", async () => {
        const req = new NextRequest("http://localhost/api/jobs", {
            method: "POST",
            body: "not json",
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
    });
});
