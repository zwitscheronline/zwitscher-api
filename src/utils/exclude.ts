export function excludeFields<T, K extends keyof T>(object: T, fields: K[]): Omit<T, K> {
    if (typeof object !== 'object' || object === null) {
        throw new Error("First argument must be an object");
    } else {
        return Object.fromEntries(
            Object.entries(object).filter(([key]) => !fields.includes(key as K))
        ) as Omit<T, K>;
    }
}
