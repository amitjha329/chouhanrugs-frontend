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
export async function revalidateCacheByPath(path: string, type?: 'page' | 'layout') {
    if (type) {
        revalidatePath(path, type)
    } else {
        revalidatePath(path)
    }
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

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/products/category/[categoryname]', 'page')
    revalidatePath('/products/[productId]', 'page')
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

    revalidatePath('/')
    revalidatePath('/about-us')
    revalidatePath('/contact-us')
    revalidatePath('/policies')
    revalidatePath('/terms')
    revalidatePath('/track-order')
    revalidatePath('/blog')
    revalidatePath('/blog/[slug]', 'page')
}

/**
 * Revalidate storefront tags and their corresponding page paths
 */
export async function revalidateStorefrontTags(tags: string[]) {
    // 1. Revalidate all the tags immediately
    for (const tag of tags) {
        revalidateTag(tag, { expire: 0 })
    }

    // 2. Map tags to corresponding page paths and revalidate them
    const pathsToRevalidate = new Set<string>()

    for (const tag of tags) {
        if (
            tag === 'products' ||
            tag === 'categories' ||
            tag === 'new-products' ||
            tag === 'featured-products' ||
            tag === 'hot-trending-products' ||
            tag === 'top-selling-products' ||
            tag === 'related-products'
        ) {
            pathsToRevalidate.add('/')
            pathsToRevalidate.add('/products')
            pathsToRevalidate.add('/products/category/[categoryname]')
            pathsToRevalidate.add('/products/[productId]')
        }
        if (tag === 'blogs') {
            pathsToRevalidate.add('/')
            pathsToRevalidate.add('/blog')
            pathsToRevalidate.add('/blog/[slug]')
        }
        if (
            tag === 'site-data' ||
            tag === 'pages' ||
            tag === 'sliders' ||
            tag === 'footer-content' ||
            tag === 'testimonials' ||
            tag === 'popup-data'
        ) {
            pathsToRevalidate.add('/')
            pathsToRevalidate.add('/about-us')
            pathsToRevalidate.add('/contact-us')
            pathsToRevalidate.add('/policies')
            pathsToRevalidate.add('/terms')
            pathsToRevalidate.add('/track-order')
        }
        if (tag.startsWith('page-')) {
            const pageSlug = tag.replace('page-', '')
            if (pageSlug === 'home') {
                pathsToRevalidate.add('/')
            } else {
                pathsToRevalidate.add(`/${pageSlug}`)
            }
        }
    }

    // Revalidate paths using Next.js revalidatePath
    pathsToRevalidate.forEach((path) => {
        try {
            if (path.includes('[')) {
                revalidatePath(path, 'page')
            } else {
                revalidatePath(path)
            }
        } catch (err) {
            console.error(`Error revalidating path ${path}:`, err)
        }
    })
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
