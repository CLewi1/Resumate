import { describe, test, expect, mock, beforeEach } from "bun:test";
import { tailorResume } from "../tailor";
import type { Change } from "../tailor";

const VALID_CHANGES: Change[] = [
    { section: "Experience", old: "Maintained systems", new: "Architected scalable systems" },
    { section: "Skills", old: "JavaScript", new: "TypeScript, JavaScript" },
];

const LATEX = "\\documentclass{article}\\begin{document}Hello\\end{document}";
const JOB_DESC = "Build cool things";

describe("tailorResume", () => {
    let mockCaller: ReturnType<typeof mock>;

    beforeEach(() => {
        mockCaller = mock(async () => "");
    });

    test("returns parsed Change[] on valid JSON response", async () => {
        mockCaller.mockResolvedValue(JSON.stringify(VALID_CHANGES));

        const changes = await tailorResume(LATEX, JOB_DESC, mockCaller);

        expect(changes).toEqual(VALID_CHANGES);
        expect(mockCaller).toHaveBeenCalledTimes(1);
    });

    test("retries once on invalid JSON, returns result on second call", async () => {
        mockCaller
            .mockResolvedValueOnce("not json at all")
            .mockResolvedValueOnce(JSON.stringify(VALID_CHANGES));

        const changes = await tailorResume(LATEX, JOB_DESC, mockCaller);

        expect(changes).toEqual(VALID_CHANGES);
        expect(mockCaller).toHaveBeenCalledTimes(2);
    });

    test("retries once on wrong shape, returns result on second call", async () => {
        const wrongShape = [{ section: "Skills" }]; // missing old and new
        mockCaller
            .mockResolvedValueOnce(JSON.stringify(wrongShape))
            .mockResolvedValueOnce(JSON.stringify(VALID_CHANGES));

        const changes = await tailorResume(LATEX, JOB_DESC, mockCaller);

        expect(changes).toEqual(VALID_CHANGES);
        expect(mockCaller).toHaveBeenCalledTimes(2);
    });

    test("throws after two consecutive malformed responses", async () => {
        mockCaller.mockResolvedValue("still not json");

        await expect(tailorResume(LATEX, JOB_DESC, mockCaller)).rejects.toThrow();

        expect(mockCaller).toHaveBeenCalledTimes(2);
    });

    test("retries once on 503 Service Unavailable, returns result on second call", async () => {
        const err503 = Object.assign(new Error("Service Unavailable"), { status: 503 });
        mockCaller
            .mockRejectedValueOnce(err503)
            .mockResolvedValueOnce(JSON.stringify(VALID_CHANGES));

        const changes = await tailorResume(LATEX, JOB_DESC, mockCaller);

        expect(changes).toEqual(VALID_CHANGES);
        expect(mockCaller).toHaveBeenCalledTimes(2);
    });

    test("propagates non-retryable errors without retry", async () => {
        mockCaller.mockRejectedValue(new Error("Network failure"));

        await expect(tailorResume(LATEX, JOB_DESC, mockCaller)).rejects.toThrow("Network failure");

        expect(mockCaller).toHaveBeenCalledTimes(1);
    });

    test("propagates 429 billing error without retry", async () => {
        const err429 = Object.assign(new Error("Too Many Requests"), { status: 429 });
        mockCaller.mockRejectedValue(err429);

        await expect(tailorResume(LATEX, JOB_DESC, mockCaller)).rejects.toThrow("Too Many Requests");

        expect(mockCaller).toHaveBeenCalledTimes(1);
    });

    test("passes system prompt and user message to caller", async () => {
        mockCaller.mockResolvedValue(JSON.stringify(VALID_CHANGES));

        await tailorResume(LATEX, JOB_DESC, mockCaller);

        const [system, user] = mockCaller.mock.calls[0] as [string, string];
        expect(system).toContain("resume tailoring assistant");
        expect(user).toContain(LATEX);
        expect(user).toContain(JOB_DESC);
    });
});
