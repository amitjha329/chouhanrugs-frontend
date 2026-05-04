import { routing, type Locale } from '@/i18n/routing';

export function normalizeLocale(locale?: string): Locale {
    return routing.locales.includes(locale as Locale)
        ? (locale as Locale)
        : routing.defaultLocale;
}

export function formatCurrency(
    amount: number,
    currency = 'USD',
    locale?: string,
    options?: Intl.NumberFormatOptions,
) {
    return new Intl.NumberFormat(normalizeLocale(locale), {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
        ...options,
    }).format(amount);
}

export function formatNumber(
    value: number,
    locale?: string,
    options?: Intl.NumberFormatOptions,
) {
    return new Intl.NumberFormat(normalizeLocale(locale), options).format(value);
}

export function formatDate(
    value: Date | number | string,
    locale?: string,
    options?: Intl.DateTimeFormatOptions,
) {
    return new Intl.DateTimeFormat(normalizeLocale(locale), options).format(
        new Date(value),
    );
}
