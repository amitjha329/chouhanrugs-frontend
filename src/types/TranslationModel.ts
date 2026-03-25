import type { Locale } from '@/i18n/routing';

/**
 * A single translation document stored in MongoDB.
 * Each document represents ALL translations for one locale.
 *
 * Collection: `translations`
 * Index: `{ locale: 1 }` (unique)
 */
export interface TranslationDocument {
    _id?: string;
    locale: Locale;
    /** The full next-intl message object (nested namespaces) */
    messages: Record<string, unknown>;
    updatedAt: Date;
    createdAt: Date;
}
