import { cacheLife, cacheTag } from 'next/cache'
import clientPromise from '@/lib/clientPromise'
import type { TranslationDocument } from '@/types/TranslationModel'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'

const COLLECTION = 'translations'

async function fetchTranslations(locale: Locale): Promise<Record<string, unknown>> {
    'use cache'

    cacheLife('seconds')
    cacheTag('translations')
    cacheTag(`translations-${locale}`)

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const doc = await db.collection<TranslationDocument>(COLLECTION).findOne({ locale })

    if (doc) {
        return JSON.parse(JSON.stringify(doc.messages))
    }

    // Fallback: try default locale
    if (locale !== routing.defaultLocale) {
        const fallback = await db
            .collection<TranslationDocument>(COLLECTION)
            .findOne({ locale: routing.defaultLocale })
        if (fallback) {
            return JSON.parse(JSON.stringify(fallback.messages))
        }
    }

    return {}
}

export async function getTranslations(locale: Locale) {
    return fetchTranslations(locale)
}
