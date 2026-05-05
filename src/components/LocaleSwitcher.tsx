'use client';

import { usePathname } from 'next/navigation';
import { switchLocaleAction } from '@/lib/actions/switch-locale';
import { getLocaleFromPathname, routing } from '@/i18n/routing';

/**
 * Locale switcher – `'use client'` is required only for `usePathname`.
 *
 * Native-Check: Uses a native HTML `<form>` bound to a Server Action plus
 * `HTMLFormElement.requestSubmit()` (DOM Level 4). No client-side router
 * push, no external dropdown library, and no JavaScript locale-detection
 * package required.
 */

const LOCALE_LABELS: Record<string, string> = {
    'en-US': 'English (US)',
    'en-IN': 'English (India)',
    'en-GB': 'English (UK)',
    'hi-IN': 'हिन्दी (भारत)',
    'ar': 'العربية',
} as const;

export default function LocaleSwitcher() {
    const pathname = usePathname();

    // Derive the current locale from the URL (custom locale prefixes supported).
    const localeKeys = Object.keys(LOCALE_LABELS);
    const resolvedLocale = getLocaleFromPathname(pathname);
    const currentLocale =
        resolvedLocale && localeKeys.includes(resolvedLocale)
            ? resolvedLocale
            : routing.defaultLocale;

    return (
        <form action={switchLocaleAction}>
            <input type="hidden" name="pathname" value={pathname} />
            <select
                name="locale"
                defaultValue={currentLocale}
                aria-label="Select language"
                onChange={(e) => {
                    // requestSubmit() honours the form's `action` (Server Action)
                    e.currentTarget.form?.requestSubmit();
                }}
                className="card bg-white pl-2 pr-8 text-xs rtl:pl-8 py-1 rtl:pr-2 border border-gray-300"
            >
                {localeKeys.map((key) => (
                    <option key={key} value={key}>
                        {LOCALE_LABELS[key]}
                    </option>
                ))}
            </select>
        </form>
    );
}
