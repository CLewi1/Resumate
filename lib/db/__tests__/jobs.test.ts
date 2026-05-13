/// <reference types="bun-types" />
import { describe, test, expect, beforeEach } from "bun:test";
import { openDb } from "../index";
import { makeJobRepository } from "../jobs";

const seed = {
    title: "Software Engineer",
    company: "Acme Corp",
    description: "Build cool things",
    linkedin_url: "https://linkedin.com/jobs/1",
};

describe("JobRepository", () => {
    let repo: ReturnType<typeof makeJobRepository>;

    beforeEach(async () => {
        repo = makeJobRepository(await openDb(":memory:"));
    });

    test("insert returns the new job", () => {
        const job = repo.insert(seed);
        expect(job).not.toBeNull();
        expect(job!.id).toBeGreaterThan(0);
        expect(job!.title).toBe(seed.title);
        expect(job!.company).toBe(seed.company);
        expect(job!.linkedin_url).toBe(seed.linkedin_url);
    });

    test("insert deduplicates by linkedin_url", () => {
        const first = repo.insert(seed);
        const second = repo.insert({ ...seed, title: "Different Title" });
        expect(first).not.toBeNull();
        expect(second).toBeNull(); // INSERT OR IGNORE returns null on conflict
    });

    test("getById returns correct job", () => {
        const inserted = repo.insert(seed)!;
        const found = repo.getById(inserted.id);
        expect(found).not.toBeNull();
        expect(found!.id).toBe(inserted.id);
        expect(found!.title).toBe(seed.title);
    });

    test("getById returns null for unknown id", () => {
        expect(repo.getById(9999)).toBeNull();
    });

    test("search returns all jobs when query is empty", () => {
        repo.insert(seed);
        repo.insert({
            ...seed,
            title: "Backend Engineer",
            linkedin_url: "https://linkedin.com/jobs/2",
        });
        expect(repo.search()).toHaveLength(2);
        expect(repo.search("")).toHaveLength(2);
    });

    test("search filters by title", () => {
        repo.insert(seed);
        repo.insert({
            title: "Designer",
            company: "Design Co",
            description: "Make things pretty",
            linkedin_url: "https://linkedin.com/jobs/2",
        });
        const results = repo.search("Engineer");
        expect(results).toHaveLength(1);
        expect(results[0].title).toBe("Software Engineer");
    });

    test("search filters by company", () => {
        repo.insert(seed);
        repo.insert({
            title: "PM",
            company: "StartupXYZ",
            description: "Manage the product",
            linkedin_url: "https://linkedin.com/jobs/2",
        });
        const results = repo.search("Acme");
        expect(results).toHaveLength(1);
        expect(results[0].company).toBe("Acme Corp");
    });

    test("search filters by description", () => {
        repo.insert(seed);
        repo.insert({
            title: "Accountant",
            company: "Numbers Inc",
            description: "Work with spreadsheets",
            linkedin_url: "https://linkedin.com/jobs/2",
        });
        const results = repo.search("spreadsheets");
        expect(results).toHaveLength(1);
        expect(results[0].title).toBe("Accountant");
    });
});
