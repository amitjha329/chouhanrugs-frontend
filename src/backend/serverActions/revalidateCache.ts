'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { localizePathname, routing, type Locale } from '@/i18n/routing'

const storefrontLocales = routing.locales

function localizedPath(path: string, locale: string) {
    return localizePathname(path, locale as Locale)
}

function revalidateLocalizedPath(path: string) {
    for (const locale of storefrontLocales) {
        revalidatePath(localizedPath(path, locale))
    }
}

function revalidateSitemaps() {
    revalidatePath('/sitemap.xml')
    revalidatePath('/product-sitemap.xml')
    revalidatePath('/post-sitemap.xml')
    revalidatePath('/page-sitemap.xml')
}

/**
 * Revalidate cache by tag
 * Use this when data is updated in the CMS/database
 * In Next.js 16+, revalidateTag requires a cacheLife profile as second argument
 * Using 'max' for stale-while-revalidate behavior (serves stale content while fetching fresh)
 */
export async function revalidateCacheByTag(tag: string) {
    revalidateTag(tag, 'max')
}

/**
 * Revalidate cache by path
 * Use this when a specific page needs to be refreshed
 */
export async function revalidateCacheByPath(path: string) {
    revalidatePath(path)
}

/**
 * Revalidate all product-related caches
 * Call this when products are added, updated, or deleted
 */
export async function revalidateProducts() {
    revalidateTag('products', 'max')
    revalidateTag('new-products', 'max')
    revalidateTag('featured-products', 'max')
    revalidateTag('hot-trending-products', 'max')
    revalidateTag('top-selling-products', 'max')
    revalidateTag('related-products', 'max')
    revalidateLocalizedPath('/')
    revalidateLocalizedPath('/products')
    revalidateSitemaps()
}

/**
 * Revalidate site-wide caches
 * Call this when site settings change
 */
export async function revalidateSiteData() {
    revalidateTag('site-data', 'max')
    revalidateTag('pages', 'max')
    revalidateTag('sliders', 'max')
    revalidateTag('footer-content', 'max')
    revalidateLocalizedPath('/')
    revalidateLocalizedPath('/about-us')
    revalidateLocalizedPath('/contact-us')
    revalidateLocalizedPath('/blog')
    revalidateLocalizedPath('/policies')
    revalidateLocalizedPath('/products')
    revalidateLocalizedPath('/products/category')
    revalidateLocalizedPath('/terms')
    revalidateLocalizedPath('/track-order')
    revalidateSitemaps()
}

/**
 * Revalidate translation caches
 * Call this when translations are updated in the database
 * @param locale - Optional: revalidate only a specific locale
 */
export async function revalidateTranslations(locale?: string) {
    revalidateTag('translations', 'max')
    if (locale) {
        revalidateTag(`translations-${locale}`, 'max')
        revalidatePath(localizedPath('/', locale))
    } else {
        revalidateLocalizedPath('/')
    }
}

export async function revalidateStorefrontTags(tags: string[]) {
    for (const tag of tags) {
        revalidateTag(tag, 'max')
    }

    if (tags.some(tag => ['products', 'new-products', 'featured-products', 'hot-trending-products', 'top-selling-products', 'related-products', 'categories'].includes(tag))) {
        await revalidateProducts()
    }

    if (tags.some(tag => ['pages', 'site-data', 'sliders', 'footer-content', 'home-banner-section', 'home-product-showcase', 'home-video-section', 'page-additional-home'].includes(tag))) {
        await revalidateSiteData()
    }

    if (tags.includes('blogs')) {
        revalidateTag('blogs', 'max')
        revalidateLocalizedPath('/blog')
        revalidateSitemaps()
    }

    if (tags.includes('sitemap')) {
        revalidateSitemaps()
    }

    if (tags.some(tag => tag === 'translations' || tag.startsWith('translations-'))) {
        await revalidateTranslations()
    }
}

/**
 * Revalidate all caches
 * Use sparingly - only when major changes are made
 */
export async function revalidateAll() {
    await revalidateProducts()
    await revalidateSiteData()
    await revalidateTranslations()
    revalidateTag('analytics', 'max')
}
