import { routing, type Locale } from '@/i18n/routing';

/**
 * Extract the localized value from a multi-language field or plain string.
 *
 * Fallback chain:
 * 1. Exact locale match (e.g. 'hi-IN')
 * 2. Language-family match (e.g. any key starting with 'hi')
 * 3. Default locale ('en-US')
 * 4. First available value
 *
 * Backward compatible: if the field is a plain string, returns it as-is.
 */
export function getLocalizedField(
    field: Record<string, string> | string | undefined | null,
    locale: string,
    fallbackLocale: Locale = routing.defaultLocale
): string {
    if (!field) return '';
    if (typeof field === 'string') return field;

    // Exact match
    if (field[locale]) return field[locale];

    // Language-family match
    const lang = locale.split('-')[0];
    const langMatch = Object.keys(field).find(k => k.startsWith(lang));
    if (langMatch && field[langMatch]) return field[langMatch];

    // Fallback locale
    if (field[fallbackLocale]) return field[fallbackLocale];

    // First available
    const values = Object.values(field);
    return values[0] || '';
}
