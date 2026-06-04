import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import React, { Suspense } from 'react';

const LocaleLayoutFallback = () => (
    <div className="min-h-screen w-screen bg-[#fbf7ef]" aria-hidden="true" />
)

/**
 * Locale layout — wraps all pages under `/[locale]/...` with
 * NextIntlClientProvider so that `useTranslations()` works in Client
 * Components.
 *
 * next-intl middleware rewrites every request to include the locale
 * segment, then this layout validates and loads the matching messages.
 */
async function LocaleLayoutContent({
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

export default function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    return (
        <Suspense fallback={<LocaleLayoutFallback />}>
            <LocaleLayoutContent params={params}>{children}</LocaleLayoutContent>
        </Suspense>
    );
}
