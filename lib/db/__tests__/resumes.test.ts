import { describe, test, expect, beforeEach } from "bun:test";
import { openDb } from "../index";
import { makeJobRepository } from "../jobs";
import { makeResumeRepository } from "../resumes";

const seedResume = {
    name: "My Resume",
    latex: "\\documentclass{article}\\begin{document}Hello\\end{document}",
};

describe("ResumeRepository", () => {
    let repo: ReturnType<typeof makeResumeRepository>;
    let jobRepo: ReturnType<typeof makeJobRepository>;

    beforeEach(async () => {
        const db = await openDb(":memory:");
        repo = makeResumeRepository(db);
        jobRepo = makeJobRepository(db);
    });

    test("save returns the new resume", () => {
        const resume = repo.save(seedResume);
        expect(resume.id).toBeGreaterThan(0);
        expect(resume.name).toBe(seedResume.name);
        expect(resume.latex).toBe(seedResume.latex);
        expect(resume.job_id).toBeNull();
        expect(resume.is_master).toBe(0);
    });

    test("save links resume to a job", () => {
        const job = jobRepo.insert({
            title: "Engineer",
            company: "Acme",
            description: "Build things",
            linkedin_url: "https://linkedin.com/jobs/1",
        })!;
        const resume = repo.save({ ...seedResume, job_id: job.id });
        expect(resume.job_id).toBe(job.id);
    });

    test("getMaster returns null when no master resume set", () => {
        repo.save(seedResume);
        expect(repo.getMaster()).toBeNull();
    });

    test("getMaster returns the master resume", () => {
        const resume = repo.save({ ...seedResume, is_master: true });
        const master = repo.getMaster();
        expect(master).not.toBeNull();
        expect(master!.id).toBe(resume.id);
        expect(master!.is_master).toBe(1);
    });

    test("setMaster clears previous master", () => {
        const first = repo.save({ ...seedResume, is_master: true });
        const second = repo.save({
            name: "Second Resume",
            latex: seedResume.latex,
        });

        repo.setMaster(second.id);

        expect(repo.getById(first.id)!.is_master).toBe(0);
        expect(repo.getById(second.id)!.is_master).toBe(1);
    });

    test("only one resume can be master at a time", () => {
        repo.save({ ...seedResume, is_master: true });
        const second = repo.save({ name: "Resume B", latex: seedResume.latex });
        const third = repo.save({ name: "Resume C", latex: seedResume.latex });

        repo.setMaster(second.id);
        repo.setMaster(third.id);

        const masters = repo.list().filter((r) => r.is_master === 1);
        expect(masters).toHaveLength(1);
        expect(masters[0].id).toBe(third.id);
    });

    test("list returns all resumes, master first", () => {
        const a = repo.save({ name: "Resume A", latex: seedResume.latex });
        const b = repo.save({ name: "Resume B", latex: seedResume.latex });
        repo.setMaster(b.id);

        const list = repo.list();
        expect(list).toHaveLength(2);
        expect(list[0].id).toBe(b.id);
        expect(list[1].id).toBe(a.id);
    });

    test("update changes name and latex", () => {
        const resume = repo.save(seedResume);
        const updated = repo.update(resume.id, {
            name: "Updated Name",
            latex: "\\documentclass{resume}",
        });
        expect(updated).not.toBeNull();
        expect(updated!.name).toBe("Updated Name");
        expect(updated!.latex).toBe("\\documentclass{resume}");
    });
});
