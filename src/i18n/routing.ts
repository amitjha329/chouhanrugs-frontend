import { defineRouting } from 'next-intl/routing';

/**
 * i18n routing configuration for next-intl.
 *
 * Native-Check: defineRouting is from the already-required next-intl package.
 * No additional slug or locale-detection packages added.
 */
export const locales = ['en-IN', 'en-US', 'hi-IN', 'en-GB', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
    locales,
    defaultLocale: 'en-IN',
    // Default locale has no URL prefix (chouhanrugs.com/products vs chouhanrugs.com/en-US/products)
    localePrefix: 'as-needed',
});
