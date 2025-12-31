'use server'

import { revalidateTag, revalidatePath } from 'next/cache'

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
}

/**
 * Revalidate all caches
 * Use sparingly - only when major changes are made
 */
export async function revalidateAll() {
    await revalidateProducts()
    await revalidateSiteData()
    revalidateTag('analytics', 'max')
}
