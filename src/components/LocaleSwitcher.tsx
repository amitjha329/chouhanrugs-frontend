'use client';

import { usePathname } from 'next/navigation';
import { switchLocaleAction } from '@/lib/actions/switch-locale';

/**
 * Locale switcher – `'use client'` is required only for `usePathname`.
 *
 * Native-Check: Uses a native HTML `<form>` bound to a Server Action plus
 * `HTMLFormElement.requestSubmit()` (DOM Level 4). No client-side router
 * push, no external dropdown library, and no JavaScript locale-detection
 * package required.
 */

const LOCALE_LABELS: Record<string, string> = {
    'en-IN': 'English (India)',
    'en-US': 'English (US)',
    'hi-IN': 'हिन्दी (भारत)',
    'en-GB': 'English (UK)',
    'ar': 'العربية',
} as const;

export default function LocaleSwitcher() {
    const pathname = usePathname();

    // Derive the current locale from the URL (first segment, if it's a known locale)
    const segments = pathname.split('/').filter(Boolean);
    const localeKeys = Object.keys(LOCALE_LABELS);
    const currentLocale =
        segments[0] && localeKeys.includes(segments[0])
            ? segments[0]
            : 'en-IN'; // default when prefix is absent

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
                className="select select-bordered select-sm"
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
