import { describe, test, expect, mock } from "bun:test";

const mockRedirect = mock((_url: string): never => {
    throw new Error("redirect");
});

mock.module("next/navigation", () => ({
    redirect: mockRedirect,
}));

const { default: JobDetailPage } = await import("../page");

describe("JobDetailPage /jobs/[id]", () => {
    test("redirects to /jobs?selected=<id> for a numeric id", async () => {
        await JobDetailPage({ params: Promise.resolve({ id: "42" }) }).catch(
            () => {}
        );
        expect(mockRedirect).toHaveBeenCalledWith("/jobs?selected=42");
    });

    test("redirects to /jobs?selected=<id> for a non-numeric id", async () => {
        mockRedirect.mockClear();
        await JobDetailPage({ params: Promise.resolve({ id: "abc" }) }).catch(
            () => {}
        );
        expect(mockRedirect).toHaveBeenCalledWith("/jobs?selected=abc");
    });
});
