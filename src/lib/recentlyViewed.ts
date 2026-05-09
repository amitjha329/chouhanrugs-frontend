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
 * Validates and normalizes a single entry from localStorage.
 * Returns null if the entry is unrecoverable.
 */
function normalizeEntry(p: any): RecentlyViewedProduct | null {
    if (!p || typeof p !== 'object') return null
    if (typeof p.slug !== 'string' || !p.slug) return null
    const price = Number(p.price)
    const msrp = Number(p.msrp)
    if (!isFinite(price) || !isFinite(msrp)) return null
    return {
        slug: p.slug,
        name: typeof p.name === 'string' ? p.name : '',
        image: typeof p.image === 'string' ? p.image : '',
        price,
        msrp,
        discount: typeof p.discount === 'string' ? p.discount : '',
        category: typeof p.category === 'string' ? p.category : '',
        viewedAt: typeof p.viewedAt === 'number' ? p.viewedAt : Date.now(),
    }
}

/**
 * Get all recently viewed products from localStorage.
 * Invalid or corrupt entries are silently dropped.
 * If the stored data is completely unparseable, the key is cleared.
 */
export function getRecentlyViewed(): RecentlyViewedProduct[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) {
            localStorage.removeItem(STORAGE_KEY)
            return []
        }
        const valid = parsed.map(normalizeEntry).filter((p): p is RecentlyViewedProduct => p !== null)
        // Persist cleaned list back if any entries were dropped
        if (valid.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(valid))
        }
        return valid
    } catch {
        try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
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
        // Prepend the new product, always coerce price/msrp to numbers
        const updated: RecentlyViewedProduct[] = [
            { ...product, price: Number(product.price) || 0, msrp: Number(product.msrp) || 0, viewedAt: Date.now() },
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
