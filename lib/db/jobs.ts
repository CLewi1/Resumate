import type { SqliteDb } from "./interface";
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

export function makeJobRepository(db: SqliteDb) {
    return {
        insert(job: NewJob): Job | undefined {
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
                }) as Job | undefined;
        },

        getById(id: number): Job | undefined {
            return db
                .prepare("SELECT * FROM jobs WHERE id = ?")
                .get(id) as Job | undefined;
        },

        getByLinkedinUrl(url: string): Job | undefined {
            return db
                .prepare("SELECT * FROM jobs WHERE linkedin_url = ?")
                .get(url) as Job | undefined;
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

export function getJobRepository(): JobRepository {
    if (!_repo) _repo = makeJobRepository(getDb());
    return _repo;
}
