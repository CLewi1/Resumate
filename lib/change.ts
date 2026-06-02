export type Change = {
    section: string;
    old: string;
    new: string;
};

export function isChangeArray(value: unknown): value is Change[] {
    if (!Array.isArray(value)) return false;
    return value.every(
        (c) =>
            typeof c === "object" &&
            c !== null &&
            typeof (c as Record<string, unknown>).section === "string" &&
            typeof (c as Record<string, unknown>).old === "string" &&
            (c as Record<string, unknown>).old !== "" &&
            typeof (c as Record<string, unknown>).new === "string",
    );
}
