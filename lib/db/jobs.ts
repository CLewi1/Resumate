import type { Database } from "bun:sqlite";
import { getDb } from "./index";

export type Job = {
    id: number;
    title: string;
    company: string;
    description: string;
    linkedin_url: string;
    captured_at: string;
};

export type NewJob = {
    title: string;
    company: string;
    description: string;
    linkedin_url: string;
};

export type JobRepository = ReturnType<typeof makeJobRepository>;

export function makeJobRepository(db: Database) {
    return {
        insert(job: NewJob): Job | null {
            return db
                .prepare(
                    `INSERT OR IGNORE INTO jobs (title, company, description, linkedin_url)
                     VALUES ($title, $company, $description, $linkedin_url)
                     RETURNING *`,
                )
                .get({
                    $title: job.title,
                    $company: job.company,
                    $description: job.description,
                    $linkedin_url: job.linkedin_url,
                }) as Job | null;
        },

        getById(id: number): Job | null {
            return db
                .prepare("SELECT * FROM jobs WHERE id = ?")
                .get(id) as Job | null;
        },

        search(query?: string): Job[] {
            if (!query?.trim()) {
                return db
                    .prepare(
                        "SELECT * FROM jobs ORDER BY captured_at DESC LIMIT 200",
                    )
                    .all() as Job[];
            }
            const pattern = `%${query.trim()}%`;
            return db
                .prepare(
                    `SELECT * FROM jobs
                     WHERE title LIKE ? OR company LIKE ? OR description LIKE ?
                     ORDER BY captured_at DESC LIMIT 200`,
                )
                .all(pattern, pattern, pattern) as Job[];
        },
    };
}

let _repo: JobRepository | null = null;

export async function getJobRepository(): Promise<JobRepository> {
    if (!_repo) _repo = makeJobRepository(await getDb());
    return _repo;
}
