'use server'

import { unstable_cache } from 'next/cache'
import clientPromise from '@/lib/clientPromise'
import type { TranslationDocument } from '@/types/TranslationModel'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'

const COLLECTION = 'translations'

async function fetchTranslations(locale: Locale): Promise<Record<string, unknown>> {
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

/**
 * Cached getter for translation messages by locale.
 * Revalidates every hour or on demand via the `translations` tag.
 */
export async function getTranslations(locale: Locale) {
    return unstable_cache(
        () => fetchTranslations(locale),
        [`translations-${locale}`],
        {
            revalidate: 3600,
            tags: ['translations', `translations-${locale}`],
        }
    )()
}
