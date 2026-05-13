import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type Change = {
    section: string;
    old: string;
    new: string;
};

// A ModelCaller abstracts away the provider: takes system + user text, returns model output.
export type ModelCaller = (system: string, user: string) => Promise<string>;

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

// --- Provider implementations ---

function anthropicCaller(): ModelCaller {
    const client = new Anthropic();
    const model = process.env.TAILOR_MODEL ?? "claude-sonnet-4-6";
    return async (system, user) => {
        const message = await client.messages.create({
            model,
            max_tokens: 2048,
            system,
            messages: [{ role: "user", content: user }],
        });
        return message.content.find((b) => b.type === "text")?.text ?? "";
    };
}

function openaiCaller(): ModelCaller {
    const client = new OpenAI();
    const model = process.env.TAILOR_MODEL ?? "gpt-4o";
    return async (system, user) => {
        const response = await client.chat.completions.create({
            model,
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
        });
        return response.choices[0]?.message.content ?? "";
    };
}

function openrouterCaller(): ModelCaller {
    const client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
    });
    const model = process.env.TAILOR_MODEL ?? "openai/gpt-4o-mini";
    return async (system, user) => {
        const response = await client.chat.completions.create({
            model,
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
        });
        return response.choices[0]?.message.content ?? "";
    };
}

function ollamaCaller(): ModelCaller {
    const baseURL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1";
    const client = new OpenAI({ baseURL, apiKey: "ollama" });
    const model = process.env.TAILOR_MODEL ?? "llama3.2";
    return async (system, user) => {
        const response = await client.chat.completions.create({
            model,
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
        });
        return response.choices[0]?.message.content ?? "";
    };
}

function googleCaller(): ModelCaller {
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    const modelName = process.env.TAILOR_MODEL ?? "gemini-2.0-flash";
    return async (system, user) => {
        const model = client.getGenerativeModel({
            model: modelName,
            systemInstruction: system,
        });
        const result = await model.generateContent(user);
        return result.response.text();
    };
}

export function getModelCaller(): ModelCaller {
    const provider = process.env.TAILOR_PROVIDER ?? "anthropic";
    switch (provider) {
        case "anthropic":   return anthropicCaller();
        case "openai":      return openaiCaller();
        case "openrouter":  return openrouterCaller();
        case "ollama":      return ollamaCaller();
        case "google":      return googleCaller();
        default:
            throw new Error(
                `Unknown TAILOR_PROVIDER: "${provider}". Supported values: anthropic, openai, openrouter, ollama, google`,
            );
    }
}

// --- Core logic ---

async function callOnce(caller: ModelCaller, latex: string, jobDescription: string): Promise<Change[]> {
    const text = await caller(SYSTEM_PROMPT, buildUserMessage(latex, jobDescription));

    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error("invalid_json");
    }

    if (!isChangeArray(parsed)) throw new Error("invalid_shape");

    return parsed;
}

function isRetryable(err: unknown): boolean {
    if (err instanceof Error && (err.message === "invalid_json" || err.message === "invalid_shape")) {
        return true;
    }
    // Retry transient provider errors (503 Service Unavailable, 529 Overloaded)
    if (typeof err === "object" && err !== null && "status" in err) {
        const status = (err as { status: number }).status;
        return status === 503 || status === 529;
    }
    return false;
}

export async function tailorResume(
    latex: string,
    jobDescription: string,
    caller?: ModelCaller,
): Promise<Change[]> {
    const call = caller ?? getModelCaller();

    try {
        return await callOnce(call, latex, jobDescription);
    } catch (err) {
        if (!isRetryable(err)) throw err;
        await new Promise((r) => setTimeout(r, 1000));
        return await callOnce(call, latex, jobDescription);
    }
}
