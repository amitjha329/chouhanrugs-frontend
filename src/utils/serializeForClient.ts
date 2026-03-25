/**
 * Serializes MongoDB documents for safe passing from Server to Client Components.
 * 
 * MongoDB returns ObjectId instances (with `toJSON` methods and `buffer` properties)
 * which React's server-to-client serialization rejects. This utility converts all
 * such values to plain JSON-safe objects by round-tripping through JSON.stringify/parse.
 */
export function serializeForClient<T>(data: T): T {
    return JSON.parse(JSON.stringify(data))
}
