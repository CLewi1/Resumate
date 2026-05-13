import { describe, test, expect, mock, beforeEach } from "bun:test";
import type { Change } from "../tailor";

const mockCreate = mock(async (_params: unknown): Promise<unknown> => ({}));

mock.module("@anthropic-ai/sdk", () => {
    return {
        default: class MockAnthropic {
            messages = { create: mockCreate };
        },
    };
});

const { tailorResume } = await import("../tailor");

const VALID_CHANGES: Change[] = [
    { section: "Experience", old: "Maintained systems", new: "Architected scalable systems" },
    { section: "Skills", old: "JavaScript", new: "TypeScript, JavaScript" },
];

function makeApiResponse(text: string) {
    return { content: [{ type: "text", text }] };
}

describe("tailorResume", () => {
    beforeEach(() => {
        mockCreate.mockReset();
    });

    test("returns parsed Change[] on valid JSON response", async () => {
        mockCreate.mockResolvedValue(makeApiResponse(JSON.stringify(VALID_CHANGES)));

        const changes = await tailorResume("\\documentclass{article}", "Build cool things");

        expect(changes).toEqual(VALID_CHANGES);
        expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    test("retries once on invalid JSON, returns result on second call", async () => {
        mockCreate
            .mockResolvedValueOnce(makeApiResponse("not json at all"))
            .mockResolvedValueOnce(makeApiResponse(JSON.stringify(VALID_CHANGES)));

        const changes = await tailorResume("\\documentclass{article}", "Build cool things");

        expect(changes).toEqual(VALID_CHANGES);
        expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    test("retries once on wrong shape, returns result on second call", async () => {
        const wrongShape = [{ section: "Skills" }]; // missing old and new
        mockCreate
            .mockResolvedValueOnce(makeApiResponse(JSON.stringify(wrongShape)))
            .mockResolvedValueOnce(makeApiResponse(JSON.stringify(VALID_CHANGES)));

        const changes = await tailorResume("\\documentclass{article}", "Build cool things");

        expect(changes).toEqual(VALID_CHANGES);
        expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    test("throws after two consecutive malformed responses", async () => {
        mockCreate.mockResolvedValue(makeApiResponse("still not json"));

        await expect(
            tailorResume("\\documentclass{article}", "Build cool things"),
        ).rejects.toThrow();

        expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    test("propagates non-parse errors without retry", async () => {
        mockCreate.mockRejectedValue(new Error("Network failure"));

        await expect(
            tailorResume("\\documentclass{article}", "Build cool things"),
        ).rejects.toThrow("Network failure");

        expect(mockCreate).toHaveBeenCalledTimes(1);
    });
});
