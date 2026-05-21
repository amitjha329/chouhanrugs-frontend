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
import { ProductDataModel } from '@/types/ProductDataModel'
import { serializeForClient } from '@/utils/serializeForClient'
import TrackProductView from '@/ui/RecentlyViewed/TrackProductView'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { locales, type Locale } from '@/i18n/routing'
import ProductCraftStorySection from '@/ui/Layout/ProductPage/ProductCraftStorySection'

const PRODUCT_BUILD_PLACEHOLDER = '__product_build_placeholder__'

export function generateStaticParams() {
    return locales.map(locale => ({ locale, productId: PRODUCT_BUILD_PLACEHOLDER }))
}

export async function generateMetadata(props: { params: Promise<{ productId: string, locale: string }> }): Promise<Metadata> {
    const params = await props.params;
    if (params.productId === PRODUCT_BUILD_PLACEHOLDER) return {}
    const data = await getProductWithSlug(params.productId)
    if (data == undefined) return {}
    const locale = params.locale as Locale
    const name = resolveLocalizedString(data.metaTitle, locale) || resolveLocalizedString(data.productName, locale)
    const desc = resolveLocalizedString(data.metaDescription, locale) || resolveLocalizedString(data.productDescriptionShort, locale)
    const dataAdditional = await getSiteData()
    return {
        title: name,
        description: desc,
        openGraph: {
            title: name,
            description: desc,
            type: "website",
            siteName: "Chouhan Rugs",
            phoneNumbers: dataAdditional.contact_details.phone,
            emails: dataAdditional.contact_details.email,
            images: data.images.map((image: string) => {
                return { url: image }
            })
        },
        twitter: {
            title: name,
            description: desc,
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
            <div className="md:basis-1/2 overflow-hidden">
                <div className="rounded-3xl mb-4 md:h-[500px] aspect-square bg-gradient-to-br from-gray-100 to-gray-200" />
                <div className="flex gap-3 py-3 pl-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-20 h-20 rounded-lg bg-gray-200" />
                    ))}
                </div>
            </div>
            {/* Pricing skeleton */}
            <div className="md:basis-1/2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="flex gap-2 mt-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-200" />
                    ))}
                </div>
                <div className="flex gap-2 mt-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-20 h-8 rounded bg-gray-200" />
                    ))}
                </div>
                <div className="flex gap-4 mt-8">
                    <div className="h-12 bg-gray-200 rounded w-32" />
                    <div className="h-12 bg-primary/20 rounded w-32" />
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
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-10" />
            <div className="flex gap-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[calc(25%-12px)] min-w-[200px]">
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
        <div className="mt-10 animate-pulse">
            <div className="flex gap-4 border-b pb-2 mb-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 w-28 bg-gray-200 rounded" />
                ))}
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
        </div>
    )
}

/**
 * Async component for related products with its own data fetching
 * Wrapped in Suspense for streaming - loads independently of main content
 */
async function RelatedProductsSection({ product, isMobile }: { product: ProductDataModel, isMobile: boolean }) {
    const relatedProducts = serializeForClient(await getRelatedProducts(product))
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
const ProductPage = async (props: { params: Promise<{ productId: string, locale: string }> }) => {
    const params = await props.params;

    const {
        productId
    } = params;

    if (productId === PRODUCT_BUILD_PLACEHOLDER) return notFound()

    const locale = params.locale as Locale

    // Fetch product data - this will be part of the static shell
    const [data, dataAdditional] = await Promise.all([
        getProductWithSlug(productId),
        getSiteData(),
    ])
    if (data == undefined) return notFound();
    
    // Get device type for responsive rendering
    // Note: headers() makes this component dynamic, but the product data
    // is still cached and the related products stream in via Suspense
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    
    // Build compact product data for recently viewed tracking
    const trackData = {
        slug: resolveLocalizedString(data.productURL, locale),
        name: resolveLocalizedString(data.productName, locale),
        image: data.images?.[data.productPrimaryImageIndex] ?? data.images?.[0] ?? '',
        price: Number(data.productSellingPrice),
        msrp: Number(data.productMSRP),
        discount: data.productDiscountPercentage,
        category: data.productCategory,
    }

    return (
        <article className='bg-[#fbfaf7]'>
            <TrackProductView product={trackData} />
            <div className='fluid_container ~px-4/0 ~py-5/10'>
                <nav className='mb-5 flex items-center gap-2 text-sm text-neutral-500'>
                    <span>Home</span>
                    <span>/</span>
                    <span>Products</span>
                    {data.productCategory && (
                        <>
                            <span>/</span>
                            <span className='text-neutral-800'>{data.productCategory}</span>
                        </>
                    )}
                </nav>

                <section className='grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:items-start'>
                    <ImageSection mobile={isMobile} className='overflow-hidden lg:sticky lg:top-24' />
                    <PriceAndVariation product={data} />
                </section>
            </div>
            
            <ProductCraftStorySection section={dataAdditional.productCraftSection} />

            <section className='bg-[#fbfaf7]'>
                <Suspense fallback={<RelatedProductsSkeleton />}>
                    <RelatedProductsSection product={data} isMobile={isMobile} />
                </Suspense>
            </section>
        </article>
    )
}

export default ProductPage
