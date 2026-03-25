'use server'

import clientPromise from '@/lib/clientPromise'
import type { TranslationDocument } from '@/types/TranslationModel'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { revalidateTranslations } from './revalidateCache'

const COLLECTION = 'translations'

/**
 * Upsert translation messages for a specific locale.
 * Merges at the namespace level — pass a partial messages object
 * to update only certain namespaces without overwriting the rest.
 */
export async function updateTranslations(
    locale: Locale,
    messages: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
    if (!routing.locales.includes(locale)) {
        return { success: false, error: `Invalid locale: ${locale}` }
    }

    try {
        const client = await clientPromise
        const db = client.db(process.env.MONGODB_DB)
        const col = db.collection<TranslationDocument>(COLLECTION)

        // Build $set for each namespace key to do a merge (not full replace)
        const setFields: Record<string, unknown> = { updatedAt: new Date() }
        for (const [ns, value] of Object.entries(messages)) {
            setFields[`messages.${ns}`] = value
        }

        await col.updateOne(
            { locale },
            {
                $set: setFields,
                $setOnInsert: { locale, createdAt: new Date() },
            },
            { upsert: true }
        )

        await revalidateTranslations(locale)
        return { success: true }
    } catch (error) {
        console.error('updateTranslations error:', error)
        return { success: false, error: String(error) }
    }
}
