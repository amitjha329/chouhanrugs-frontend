import 'server-only';
import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';
import { getTranslations } from '@/backend/serverActions/getTranslations';

/**
 * Server-side i18n request configuration.
 *
 * Locale is resolved from the `requestLocale` provided by next-intl
 * middleware (which reads the `[locale]` URL segment). Falls back to
 * the default locale if the value is missing or invalid.
 *
 * Messages are fetched from MongoDB (`translations` collection) with
 * unstable_cache (1 hr TTL, revalidated via `translations` tag).
 * Falls back to static JSON import if DB fetch returns empty.
 */
export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as Locale)) {
        locale = routing.defaultLocale;
    }

    // Primary: fetch from MongoDB
    let messages = await getTranslations(locale as Locale);

    // Fallback: static JSON if DB is empty (e.g. before seeding)
    if (!messages || Object.keys(messages).length === 0) {
        messages = (await import(`../../messages/${locale}.json`)).default;
    }

    return {
        locale,
        messages,
    };
});
