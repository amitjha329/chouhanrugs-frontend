import slugify from 'slugify'
import { type Locale } from '@/i18n/routing'
import { resolveLocalizedString, type LocalizedField } from '@/lib/resolveLocalized'

export function productSlugFromUrl(
    productURL: LocalizedField<string> | undefined | null,
    locale: Locale,
): string | null {
    const rawUrl = resolveLocalizedString(productURL, locale).trim()

    if (!rawUrl) return null

    const slug = slugify(rawUrl, {
        lower: true,
        strict: true,
    })

    return slug || null
}

export function productHrefFromUrl(
    productURL: LocalizedField<string> | undefined | null,
    locale: Locale,
): `/products/${string}` | null {
    const slug = productSlugFromUrl(productURL, locale)
    return slug ? `/products/${slug}` : null
}
