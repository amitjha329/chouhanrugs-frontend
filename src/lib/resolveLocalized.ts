/**
 * Resolves a localized field value from a MongoDB document.
 *
 * Handles backward compatibility:
 *  - Old format: raw value (string, string[], etc.)
 *  - New format: locale-keyed object { "en-IN": "value", "hi-IN": "value" }
 *
 * Fallback chain: requested locale → default locale → first available → raw value.
 */

import { locales, type Locale } from '@/i18n/routing';

const DEFAULT_LOCALE: Locale = 'en-IN';

/**
 * A field that can be either a plain value (old format) or a locale-keyed
 * object (new i18n format).  Use with `resolveLocalized` / `resolveLocalizedString`.
 */
export type LocalizedField<T> = T | Partial<Record<Locale, T>>;

function isLocaleKeyed<T>(field: unknown): field is Partial<Record<Locale, T>> {
    return (
        typeof field === 'object' &&
        field !== null &&
        !Array.isArray(field) &&
        Object.keys(field).some((k) => (locales as readonly string[]).includes(k))
    );
}

/**
 * Resolve a potentially-localized field to a plain value for the given locale.
 */
export function resolveLocalized<T = string>(
    field: T | Partial<Record<Locale, T>> | undefined | null,
    locale: Locale,
): T | undefined {
    if (field === undefined || field === null) return undefined;

    if (isLocaleKeyed<T>(field)) {
        return (field as Partial<Record<Locale, T>>)[locale]
            ?? (field as Partial<Record<Locale, T>>)[DEFAULT_LOCALE]
            ?? (Object.values(field)[0] as T | undefined);
    }

    // Old format — return as-is
    return field as T;
}

/**
 * Convenience for string fields: returns '' instead of undefined.
 */
export function resolveLocalizedString(
    field: string | Partial<Record<Locale, string>> | undefined | null,
    locale: Locale,
): string {
    return resolveLocalized(field, locale) ?? '';
}
