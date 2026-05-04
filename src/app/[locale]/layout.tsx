import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import React from 'react';

/**
 * Locale layout — wraps all pages under `/[locale]/...` with
 * NextIntlClientProvider so that `useTranslations()` works in Client
 * Components.
 *
 * next-intl middleware rewrites every request to include the locale
 * segment, then this layout validates and loads the matching messages.
 */
export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Validate locale — return 404 for fabricated segments
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
