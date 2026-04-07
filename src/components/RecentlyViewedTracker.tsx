'use client'
import { useEffect } from 'react'

export interface RecentProduct {
    id: string
    name: string
    url: string
    image: string
    price: string
}

const STORAGE_KEY = 'recently_viewed_products'
const MAX_ITEMS = 20

export function getRecentlyViewed(): RecentProduct[] {
    if (typeof window === 'undefined') return []
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
        return []
    }
}

export function trackRecentlyViewed(product: RecentProduct) {
    const items = getRecentlyViewed().filter(p => p.id !== product.id)
    items.unshift(product)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
}

export default function RecentlyViewedTracker({ product }: { product: RecentProduct }) {
    useEffect(() => {
        trackRecentlyViewed(product)
    }, [product.id])
    return null
}
