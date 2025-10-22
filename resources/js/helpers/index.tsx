export function getMetaValue<T>(
    meta: Record<string, unknown> | undefined,
    key: string,
): T | undefined {
    const value = meta?.[key];
    return value as T | undefined;
}
