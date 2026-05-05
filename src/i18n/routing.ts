import { defineRouting } from 'next-intl/routing';

/**
 * i18n routing configuration for next-intl.
 *
 * Native-Check: defineRouting is from the already-required next-intl package.
 * No additional slug or locale-detection packages added.
 */
export const locales = ['en-US', 'en-IN', 'en-GB', 'hi-IN', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const localePrefixes: Record<Locale, string> = {
    'en-US': '/en/us',
    'en-IN': '/en/in',
    'en-GB': '/en/gb',
    'hi-IN': '/hi/in',
    ar: '/ar',
};

const legacyLocaleMap = new Map(locales.map((locale) => [locale.toLowerCase(), locale] as const));
const prefixEntries = (Object.entries(localePrefixes) as Array<[Locale, string]>).map(
    ([locale, prefix]) => [locale, prefix.toLowerCase()] as const,
);

export function getLocalePrefix(locale: Locale): string {
    return localePrefixes[locale];
}

export function getLocaleFromPathname(pathname: string): Locale | undefined {
    const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const lowerPathname = normalizedPathname.toLowerCase();

    for (const [locale, prefix] of prefixEntries) {
        if (lowerPathname === prefix || lowerPathname.startsWith(`${prefix}/`)) {
            return locale;
        }
    }

    const legacyMatch = lowerPathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)(?:\/|$)/);
    if (!legacyMatch) {
        return undefined;
    }

    return legacyLocaleMap.get(legacyMatch[1]);
}

export function stripLocaleFromPathname(pathname: string): string {
    const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const lowerPathname = normalizedPathname.toLowerCase();

    for (const [, prefix] of prefixEntries) {
        if (lowerPathname === prefix) {
            return '/';
        }
        if (lowerPathname.startsWith(`${prefix}/`)) {
            return normalizedPathname.slice(prefix.length) || '/';
        }
    }

    const legacyMatch = normalizedPathname.match(/^\/[A-Za-z]{2}(?:-[A-Za-z]{2})?(?=\/|$)/);
    if (legacyMatch && legacyLocaleMap.has(legacyMatch[0].slice(1).toLowerCase())) {
        return normalizedPathname.slice(legacyMatch[0].length) || '/';
    }

    return normalizedPathname;
}

export function localizePathname(pathname: string, locale: Locale): string {
    const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const pathWithoutLocale = stripLocaleFromPathname(normalizedPathname);
    const prefix = getLocalePrefix(locale);

    return pathWithoutLocale === '/' ? prefix : `${prefix}${pathWithoutLocale}`;
}

export const routing = defineRouting({
    locales,
    defaultLocale: 'en-US',
    localePrefix: {
        mode: 'always',
        prefixes: localePrefixes,
    },
});
