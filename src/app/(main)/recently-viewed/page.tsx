'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getRecentlyViewed, type RecentProduct } from '@/components/RecentlyViewedTracker'

export default function RecentlyViewedPage() {
    const [products, setProducts] = useState<RecentProduct[]>([])

    useEffect(() => {
        setProducts(getRecentlyViewed())
    }, [])

    return (
        <div className="fluid_container mx-auto py-10 px-5">
            <h1 className="text-2xl font-semibold text-center mb-8">Recently Viewed</h1>
            {products.length === 0 ? (
                <p className="text-center text-gray-500">You haven&apos;t viewed any products yet.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={product.url}
                            className="group border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {product.image && (
                                <div className="relative aspect-square bg-gray-100">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                    />
                                </div>
                            )}
                            <div className="p-3">
                                <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                                {product.price && (
                                    <p className="text-sm text-primary font-semibold mt-1">${product.price}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
