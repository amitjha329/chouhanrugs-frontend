import React, { Suspense } from 'react'
import { getProductWithSlug } from '@/backend/serverActions/getProductWithSlug'
import getSiteData from '@/backend/serverActions/getSiteData'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ImageSection from '@/ui/Layout/ProductPage/ImageSection'
import { headers } from 'next/headers'
import getDevice from '@/utils/getDevice'
import PriceAndVariation from '@/ui/Layout/ProductPage/PricingAndVariations'
import ProductCarouselBasic from '@/ui/ProductCarouselBasic'
import getRelatedProducts from '@/backend/serverActions/getRelatedProduct'
import InformationTabs from '@/ui/Layout/ProductPage/InformationTabs'
import { ProductDataModel } from '@/types/ProductDataModel'

import RecentlyViewedTracker from '@/components/RecentlyViewedTracker'

export async function generateMetadata(props: { params: Promise<{ productId: string }> }): Promise<Metadata> {
    const params = await props.params;
    const data = await getProductWithSlug(params.productId)
    if (data == undefined) return {}
    const dataAdditional = await getSiteData()
    return {
        title: data.productName,
        description: data.productDescriptionShort,
        openGraph: {
            title: data.productName,
            description: data.productDescriptionShort,
            type: "website",
            siteName: "Chouhan Rugs",
            phoneNumbers: dataAdditional.contact_details.phone,
            emails: dataAdditional.contact_details.email,
            images: data.images.map((image: string) => {
                return { url: image }
            })
        },
        twitter: {
            title: data.productName,
            description: data.productDescriptionShort,
            card: "summary",
            images: dataAdditional.logoSrc,
        },
        alternates: {
            canonical: `${dataAdditional.url}products/${params.productId}`
        }
    }
}

/**
 * Skeleton for the main product section (image + pricing)
 * Shows while the main product content is loading
 */
function ProductContentSkeleton() {
    return (
        <div className="flex max-md:flex-col gap-10 ~px-5/0 animate-pulse">
            {/* Image skeleton */}
            <div className="md:basis-1/2 overflow-hidden relative pt-4 md:pt-6">
                <div className="rounded-2xl aspect-[4/5] w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                <div className="flex gap-3 p-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0" />
                    ))}
                </div>
            </div>
            {/* Pricing skeleton */}
            <div className="basis-1/2">
                <div className="p-6 max-w-xl mx-auto space-y-4">
                    <div className="h-8 w-32 rounded-md bg-gray-200" />
                    <div className="h-7 bg-gray-200 rounded w-3/4" />
                    <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                        ))}
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-24 bg-gray-200 rounded" />
                        <div className="h-5 w-16 bg-gray-200 rounded" />
                        <div className="h-7 w-20 bg-green-100 rounded" />
                    </div>
                    <div className="flex flex-row gap-3">
                        <div className="basis-1/2 md:basis-1/3 flex-1 space-y-1">
                            <div className="h-4 w-12 bg-gray-200 rounded" />
                            <div className="h-12 w-full rounded-xl bg-gray-200" />
                        </div>
                        <div className="basis-1/2 md:basis-1/3 flex-1 space-y-1">
                            <div className="h-4 w-10 bg-gray-200 rounded" />
                            <div className="h-12 w-full rounded-xl bg-gray-200" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                        <div className="h-12 w-full max-w-40 rounded-xl bg-gray-200" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="h-12 flex-1 rounded-full bg-gray-200" />
                            <div className="h-12 flex-1 rounded-full bg-gray-200" />
                        </div>
                        <div className="flex flex-row gap-3">
                            <div className="h-12 flex-1 rounded-full bg-gray-200" />
                            <div className="h-12 flex-1 rounded-full bg-gray-200" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-200 flex-shrink-0" />
                                <div className="h-4 bg-gray-200 rounded w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Skeleton for related products while loading
 * Displays animated placeholders for a better loading experience
 */
function RelatedProductsSkeleton() {
    return (
        <div className="fluid_container mx-auto ~py-10/20 ~px-5/0">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto ~mb-10/16" />
            <div className="flex gap-4 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[calc(20%-13px)] min-w-[160px]">
                        <div className="space-y-3">
                            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * Information tabs skeleton
 */
function InformationTabsSkeleton() {
    return (
        <>
            {/* Mobile: Accordion skeleton */}
            <div className="w-full max-w-2xl mx-auto md:hidden px-5 space-y-2 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-2xl" />
                ))}
            </div>

            {/* Desktop: Side tabs skeleton */}
            <div className="hidden md:flex mx-auto flex-row ~py-10/20 animate-pulse">
                <div className="flex flex-col">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-10 w-28 bg-gray-200" />
                    ))}
                </div>
                <div className="w-full min-h-40 bg-gray-200 ~p-10/16">
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-full" />
                        <div className="h-4 bg-gray-300 rounded w-5/6" />
                        <div className="h-4 bg-gray-300 rounded w-4/5" />
                        <div className="h-4 bg-gray-300 rounded w-full" />
                        <div className="h-4 bg-gray-300 rounded w-3/4" />
                    </div>
                </div>
            </div>
        </>
    )
}

/**
 * Async component for related products with its own data fetching
 * Wrapped in Suspense for streaming - loads independently of main content
 */
async function RelatedProductsSection({ product, isMobile }: { product: ProductDataModel, isMobile: boolean }) {
    const relatedProducts = await getRelatedProducts(product)
    if (!relatedProducts || relatedProducts.length === 0) return null
    return <ProductCarouselBasic products={relatedProducts} sectionHeading='Related Products' isMobile={isMobile} />
}

/**
 * Product Page with Next.js 16 optimizations:
 * - Partial Prerendering (PPR) enabled via cacheComponents
 * - Static shell for instant loading
 * - Streaming for dynamic content (related products)
 * - Optimized image loading with blur placeholders
 * - Responsive design with device detection
 */
const ProductPage = async (props: { params: Promise<{ productId: string }> }) => {
    const params = await props.params;

    const {
        productId
    } = params;

    // Fetch product data - this will be part of the static shell
    const data = await getProductWithSlug(productId)
    if (data == undefined) return notFound();
    
    // Get device type for responsive rendering
    // Note: headers() makes this component dynamic, but the product data
    // is still cached and the related products stream in via Suspense
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    
    return (
        <div className='fluid_container'>
            <RecentlyViewedTracker product={{
                id: data._id?.toString() ?? productId,
                name: data.productName,
                url: `/products/${data.productURL ?? productId}`,
                image: data.images?.[0] ?? '',
                price: data.productSellingPrice?.toString() ?? '',
            }} />
            {/* Main product content - loads with the page */}
            <div className='flex max-md:flex-col gap-10 ~px-5/0'>
                <ImageSection mobile={isMobile} className='md:basis-1/2 overflow-hidden' />
                <PriceAndVariation product={data} />
            </div>
            
            {/* Product information tabs */}
            <InformationTabs product={data} />
            
            {/* Related products - streamed in after initial load */}
            <Suspense fallback={<RelatedProductsSkeleton />}>
                <RelatedProductsSection product={data} isMobile={isMobile} />
            </Suspense>
        </div>
    )
}

export default ProductPage