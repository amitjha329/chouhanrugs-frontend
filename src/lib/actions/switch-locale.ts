'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
    locales,
    localizePathname,
    stripLocaleFromPathname,
    type Locale,
} from '@/i18n/routing';

/**
 * Server Action: switch the active locale.
 *
 * Sets the `NEXT_LOCALE` cookie (read by next-intl middleware on subsequent
 * requests) and redirects to the same page under the new locale prefix.
 *
 * Native-Check: Uses Next.js built-in cookies() and redirect() — no external
 * cookie or navigation library required.
 */
export async function switchLocaleAction(formData: FormData): Promise<void> {
    const locale = formData.get('locale') as Locale;
    const pathname = (formData.get('pathname') as string) || '/';

    if (!locales.includes(locale)) {
        throw new Error(`Invalid locale: ${locale}`);
    }

    // Persist preference in cookie so next-intl middleware picks it up
    const jar = await cookies();
    jar.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
    });

    // Build the target URL using canonical locale prefixes.
    const target = localizePathname(stripLocaleFromPathname(pathname), locale);

    redirect(target);
}
