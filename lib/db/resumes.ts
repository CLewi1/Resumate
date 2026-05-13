import type Database from "better-sqlite3";
import { getDb } from "./index";

export type Resume = {
    id: number;
    name: string;
    latex: string;
    job_id: number | null;
    is_master: 0 | 1;
    created_at: string;
};

export type NewResume = {
    name: string;
    latex: string;
    job_id?: number | null;
    is_master?: boolean;
};

export type ResumeRepository = ReturnType<typeof makeResumeRepository>;

export function makeResumeRepository(db: Database.Database) {
    return {
        save(resume: NewResume): Resume {
            return db
                .prepare(
                    `INSERT INTO resumes (name, latex, job_id, is_master)
                     VALUES ($name, $latex, $job_id, $is_master)
                     RETURNING *`,
                )
                .get({
                    name: resume.name,
                    latex: resume.latex,
                    job_id: resume.job_id ?? null,
                    is_master: resume.is_master ? 1 : 0,
                }) as Resume;
        },

        update(
            id: number,
            changes: Pick<Partial<NewResume>, "name" | "latex" | "job_id">,
        ): Resume | undefined {
            const sets: string[] = [];
            const params: Record<string, unknown> = { id };

            if (changes.name !== undefined) {
                sets.push("name = $name");
                params.name = changes.name;
            }
            if (changes.latex !== undefined) {
                sets.push("latex = $latex");
                params.latex = changes.latex;
            }
            if (changes.job_id !== undefined) {
                sets.push("job_id = $job_id");
                params.job_id = changes.job_id ?? null;
            }

            if (sets.length === 0) {
                return db
                    .prepare("SELECT * FROM resumes WHERE id = $id")
                    .get({ id }) as Resume | undefined;
            }

            return db
                .prepare(
                    `UPDATE resumes SET ${sets.join(", ")} WHERE id = $id RETURNING *`,
                )
                .get(params) as Resume | undefined;
        },

        getById(id: number): Resume | undefined {
            return db
                .prepare("SELECT * FROM resumes WHERE id = ?")
                .get(id) as Resume | undefined;
        },

        getMaster(): Resume | undefined {
            return db
                .prepare("SELECT * FROM resumes WHERE is_master = 1 LIMIT 1")
                .get() as Resume | undefined;
        },

        setMaster(id: number): void {
            const clearAll = db.prepare("UPDATE resumes SET is_master = 0");
            const setOne = db.prepare(
                "UPDATE resumes SET is_master = 1 WHERE id = ?",
            );
            db.transaction(() => {
                clearAll.run();
                setOne.run(id);
            })();
        },

        list(): Resume[] {
            return db
                .prepare(
                    "SELECT * FROM resumes ORDER BY is_master DESC, created_at DESC",
                )
                .all() as Resume[];
        },
    };
}

let _repo: ResumeRepository | null = null;

export function getResumeRepository(): ResumeRepository {
    if (!_repo) _repo = makeResumeRepository(getDb());
    return _repo;
}
