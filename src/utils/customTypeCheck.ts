export default function customTypeCheck<T>(variable: T, key: string): variable is T {
    //@ts-ignore
    return variable[key] !== undefined
}