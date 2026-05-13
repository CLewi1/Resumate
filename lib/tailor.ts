import Anthropic from "@anthropic-ai/sdk";

export type Change = {
    section: string;
    old: string;
    new: string;
};

const SYSTEM_PROMPT = `You are a resume tailoring assistant. Given a master resume in LaTeX format and a job description, return a JSON array of proposed changes to better match the job.

Each change must follow this exact shape:
{ "section": string, "old": string, "new": string }

Where:
- section: the resume section the change belongs to (e.g. "Experience", "Skills", "Summary")
- old: the existing LaTeX text to replace (must appear verbatim in the resume)
- new: the proposed replacement text

Return ONLY the JSON array with no explanation, markdown, or code fences.`;

function buildUserMessage(latex: string, jobDescription: string): string {
    return `MASTER RESUME (LaTeX):\n${latex}\n\nJOB DESCRIPTION:\n${jobDescription}`;
}

function isChangeArray(value: unknown): value is Change[] {
    if (!Array.isArray(value)) return false;
    return value.every(
        (item) =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as Record<string, unknown>).section === "string" &&
            typeof (item as Record<string, unknown>).old === "string" &&
            typeof (item as Record<string, unknown>).new === "string",
    );
}

async function callApi(
    client: Anthropic,
    latex: string,
    jobDescription: string,
): Promise<Change[]> {
    const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserMessage(latex, jobDescription) }],
    });

    const text = message.content.find((b) => b.type === "text")?.text ?? "";

    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error("invalid_json");
    }

    if (!isChangeArray(parsed)) throw new Error("invalid_shape");

    return parsed;
}

export async function tailorResume(
    latex: string,
    jobDescription: string,
    client?: Anthropic,
): Promise<Change[]> {
    const anthropic = client ?? new Anthropic();

    try {
        return await callApi(anthropic, latex, jobDescription);
    } catch (err) {
        if (err instanceof Error && (err.message === "invalid_json" || err.message === "invalid_shape")) {
            return await callApi(anthropic, latex, jobDescription);
        }
        throw err;
    }
}
