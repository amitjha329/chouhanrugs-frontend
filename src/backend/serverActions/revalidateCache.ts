'use server'

import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * Revalidate cache by tag
 * Use this when data is updated in the CMS/database
 * In Next.js 16+, revalidateTag requires a cacheLife profile as second argument
 * Using { expire: 0 } for immediate cache invalidation
 */
export async function revalidateCacheByTag(tag: string) {
    revalidateTag(tag, { expire: 0 })
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
    revalidateTag('products', { expire: 0 })
    revalidateTag('new-products', { expire: 0 })
    revalidateTag('featured-products', { expire: 0 })
    revalidateTag('hot-trending-products', { expire: 0 })
    revalidateTag('top-selling-products', { expire: 0 })
    revalidateTag('related-products', { expire: 0 })
}

/**
 * Revalidate site-wide caches
 * Call this when site settings change
 */
export async function revalidateSiteData() {
    revalidateTag('site-data', { expire: 0 })
    revalidateTag('pages', { expire: 0 })
    revalidateTag('sliders', { expire: 0 })
    revalidateTag('footer-content', { expire: 0 })
    revalidateTag('testimonials', { expire: 0 })
    revalidateTag('popup-data', { expire: 0 })
    revalidateTag('categories', { expire: 0 })
    revalidateTag('blogs', { expire: 0 })
}

/**
 * Revalidate all caches
 * Use sparingly - only when major changes are made
 */
export async function revalidateAll() {
    await revalidateProducts()
    await revalidateSiteData()
    revalidateTag('analytics', { expire: 0 })
}
