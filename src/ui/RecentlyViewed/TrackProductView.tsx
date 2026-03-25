'use client'
import { useEffect } from 'react'
import { addRecentlyViewed, RecentlyViewedProduct } from '@/lib/recentlyViewed'

/**
 * Invisible client component that records a product view to localStorage.
 * Placed in the product detail page — fires once on mount.
 */
const TrackProductView = ({ product }: { product: Omit<RecentlyViewedProduct, 'viewedAt'> }) => {
    useEffect(() => {
        addRecentlyViewed(product)
        // Notify the sidebar (if mounted) that the list changed
        window.dispatchEvent(new Event('recently-viewed-updated'))
    }, [product.slug]) // only re-run if the slug changes (route change)

    return null
}

export default TrackProductView
