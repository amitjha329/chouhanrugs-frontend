/**
 * Seed script: Migrate existing messages/*.json files into the MongoDB `translations` collection.
 *
 * Usage:
 *   npx tsx scripts/seedTranslations.ts
 *
 * Loads MONGODB and MONGODB_DB from .env.development.local automatically.
 */

import { MongoClient } from 'mongodb'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, basename } from 'path'

// Load .env.development.local
const envPath = join(__dirname, '..', '.env.development.local')
if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8')
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIdx = trimmed.indexOf('=')
        if (eqIdx === -1) continue
        const key = trimmed.slice(0, eqIdx)
        let value = trimmed.slice(eqIdx + 1)
        // Strip surrounding quotes
        if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
            value = value.slice(1, -1)
        }
        if (!process.env[key]) {
            process.env[key] = value
        }
    }
}

const LOCALES_DIR = join(__dirname, '..', 'messages')
const COLLECTION = 'translations'

async function seed() {
    const uri = process.env.MONGODB
    const dbName = process.env.MONGODB_DB
    if (!uri || !dbName) {
        console.error('Set MONGODB and MONGODB_DB env vars before running this script.')
        process.exit(1)
    }

    const client = new MongoClient(uri)
    try {
        await client.connect()
        const db = client.db(dbName)
        const col = db.collection(COLLECTION)

        // Create unique index on locale
        await col.createIndex({ locale: 1 }, { unique: true })

        const files = readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'))

        for (const file of files) {
            const locale = basename(file, '.json') // e.g. "en-IN"
            const messages = JSON.parse(readFileSync(join(LOCALES_DIR, file), 'utf-8'))
            const now = new Date()

            const result = await col.updateOne(
                { locale },
                {
                    $set: { locale, messages, updatedAt: now },
                    $setOnInsert: { createdAt: now },
                },
                { upsert: true }
            )

            const action = result.upsertedCount ? 'inserted' : 'updated'
            console.log(`[${action}] ${locale} — ${Object.keys(messages).length} namespaces`)
        }

        console.log('\nSeed complete.')
    } finally {
        await client.close()
    }
}

seed().catch(err => {
    console.error(err)
    process.exit(1)
})
