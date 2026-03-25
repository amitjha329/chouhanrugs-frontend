/**
 * Recently Viewed Products - localStorage utility
 * 
 * Stores a compact representation of recently viewed products in localStorage.
 * Limited to 20 items, ordered most-recent-first with deduplication.
 */

const STORAGE_KEY = 'recently_viewed_products'
const MAX_ITEMS = 20

export interface RecentlyViewedProduct {
    /** Product URL slug */
    slug: string
    /** Product name */
    name: string
    /** Primary image URL */
    image: string
    /** Selling price */
    price: number
    /** MSRP / original price */
    msrp: number
    /** Discount percentage string e.g. "20% OFF" */
    discount: string
    /** Category */
    category: string
    /** Timestamp when viewed */
    viewedAt: number
}

/**
 * Get all recently viewed products from localStorage
 */
export function getRecentlyViewed(): RecentlyViewedProduct[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        return JSON.parse(raw) as RecentlyViewedProduct[]
    } catch {
        return []
    }
}

/**
 * Add a product to the recently viewed list.
 * If the product already exists, it moves to the front.
 * Maintains a max of MAX_ITEMS items.
 */
export function addRecentlyViewed(product: Omit<RecentlyViewedProduct, 'viewedAt'>): void {
    if (typeof window === 'undefined') return
    try {
        const existing = getRecentlyViewed()
        // Remove duplicate if exists
        const filtered = existing.filter(p => p.slug !== product.slug)
        // Prepend the new product
        const updated: RecentlyViewedProduct[] = [
            { ...product, viewedAt: Date.now() },
            ...filtered,
        ].slice(0, MAX_ITEMS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
        // localStorage might be full or unavailable — silently ignore
    }
}

/**
 * Clear all recently viewed products
 */
export function clearRecentlyViewed(): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch {
        // ignore
    }
}
