'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiClock, HiXMark, HiTrash } from 'react-icons/hi2'
import { getRecentlyViewed, clearRecentlyViewed, RecentlyViewedProduct } from '@/lib/recentlyViewed'
import { blurPlaceholders, imageQuality } from '@/utils/imageOptimization'

const RecentlyViewedSidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [products, setProducts] = useState<RecentlyViewedProduct[]>([])

    // Refresh the list every time the sidebar opens
    const refreshProducts = useCallback(() => {
        setProducts(getRecentlyViewed())
    }, [])

    useEffect(() => {
        if (isOpen) {
            refreshProducts()
            // Prevent body scroll when sidebar is open
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen, refreshProducts])

    // Listen for custom event dispatched when a product is viewed
    useEffect(() => {
        const handler = () => refreshProducts()
        window.addEventListener('recently-viewed-updated', handler)
        return () => window.removeEventListener('recently-viewed-updated', handler)
    }, [refreshProducts])

    const handleClear = () => {
        clearRecentlyViewed()
        setProducts([])
    }

    const timeAgo = (timestamp: number): string => {
        const diff = Date.now() - timestamp
        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-[5.5rem] z-[9998] rounded-full p-4 bg-secondary text-secondary-content shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
                aria-label="Recently viewed products"
            >
                <HiClock size={24} />
                {products.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {products.length}
                    </span>
                )}
            </button>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-[10000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />

            {/* Sidebar Panel */}
            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-base-100 z-[10001] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                aria-label="Recently viewed products"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-base-300">
                    <div className="flex items-center gap-2">
                        <HiClock size={20} className="text-secondary" />
                        <h2 className="text-lg font-semibold">Recently Viewed</h2>
                        {products.length > 0 && (
                            <span className="badge badge-secondary badge-sm">{products.length}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {products.length > 0 && (
                            <button
                                onClick={handleClear}
                                className="btn btn-ghost btn-sm text-error gap-1"
                                aria-label="Clear all recently viewed"
                            >
                                <HiTrash size={16} />
                                <span className="max-sm:hidden">Clear</span>
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="btn btn-ghost btn-sm btn-circle"
                            aria-label="Close"
                        >
                            <HiXMark size={20} />
                        </button>
                    </div>
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto">
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-base-content/50 gap-3 p-8">
                            <HiClock size={48} />
                            <p className="text-center font-medium">No recently viewed products</p>
                            <p className="text-center text-sm">Products you view will appear here for quick access.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-base-200">
                            {products.map((product) => (
                                <li key={product.slug}>
                                    <Link
                                        href={`/products/${product.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex gap-3 p-3 hover:bg-base-200 transition-colors duration-150"
                                        prefetch={false}
                                    >
                                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-base-200">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                                quality={imageQuality.thumbnail}
                                                placeholder="blur"
                                                blurDataURL={blurPlaceholders.warmNeutral}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                            <div>
                                                <p className="text-xs text-base-content/60">{product.category}</p>
                                                <p className="text-sm font-medium text-base-content line-clamp-2 leading-tight mt-0.5">
                                                    {product.name}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-primary">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                    {product.msrp > product.price && (
                                                        <span className="text-xs text-base-content/40 line-through">
                                                            ${product.msrp.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-base-content/40">
                                                    {timeAgo(product.viewedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>
        </>
    )
}

export default RecentlyViewedSidebar
