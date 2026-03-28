import clientPromise from '@/lib/clientPromise'
import { decryptValue } from '@/lib/encryption'
import type AppConfigDataModel from '@/lib/types/AppConfigDataModel'

const COLLECTION = 'app_config'

/**
 * In-memory cache for config values.
 */
const cache = new Map<string, { value: string; fetchedAt: number }>()

/** Default cache TTL in milliseconds (5 minutes). */
let cacheTTL = 5 * 60 * 1000

export function invalidateConfigCache(key?: string): void {
    if (key) {
        cache.delete(key)
    } else {
        cache.clear()
    }
}

async function getCollection() {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB).collection<AppConfigDataModel>(COLLECTION)
}

/**
 * Get a single config value by key. Decrypts secret-tier values automatically.
 */
export async function getConfig(key: string, defaultValue: string = ''): Promise<string> {
    const cached = cache.get(key)
    if (cached && (Date.now() - cached.fetchedAt) < cacheTTL) {
        return cached.value
    }

    const collection = await getCollection()
    const doc = await collection.findOne({ key })

    if (!doc) {
        return defaultValue
    }

    let value = doc.value
    if (doc.tier === 'secret' && value) {
        try {
            value = decryptValue(value)
        } catch {
            console.error(`[ConfigService] Failed to decrypt config key: ${key}`)
            return defaultValue
        }
    }

    cache.set(key, { value, fetchedAt: Date.now() })
    return value
}

/**
 * Get multiple config values by keys. Returns a Record<key, value>.
 */
export async function getConfigBulk(keys: string[]): Promise<Record<string, string>> {
    const result: Record<string, string> = {}
    const uncachedKeys: string[] = []

    for (const key of keys) {
        const cached = cache.get(key)
        if (cached && (Date.now() - cached.fetchedAt) < cacheTTL) {
            result[key] = cached.value
        } else {
            uncachedKeys.push(key)
        }
    }

    if (uncachedKeys.length > 0) {
        const collection = await getCollection()
        const docs = await collection.find({ key: { $in: uncachedKeys } }).toArray()

        for (const doc of docs) {
            let value = doc.value
            if (doc.tier === 'secret' && value) {
                try {
                    value = decryptValue(value)
                } catch {
                    console.error(`[ConfigService] Failed to decrypt config key: ${doc.key}`)
                    value = ''
                }
            }
            result[doc.key] = value
            cache.set(doc.key, { value, fetchedAt: Date.now() })
        }

        for (const key of uncachedKeys) {
            if (!(key in result)) {
                result[key] = ''
            }
        }
    }

    return result
}
