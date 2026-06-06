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
import { getProductFeaturedImage, getProductGalleryImages } from '@/lib/getProductFeaturedImage'
import { type Locale } from '@/i18n/routing'
import { productAlternates, productCanonicalUrl, resolveProductSeoTitle } from '@/lib/seoCatalog'
import ProductCraftStorySection from '@/ui/Layout/ProductPage/ProductCraftStorySection'
import ProductReviewsSection from '@/ui/Layout/ProductPage/Reviews'
import { getApprovedProductReviews } from '@/backend/serverActions/getApprovedProductReviews'
import getProductReviewEligibility from '@/backend/serverActions/getProductReviewEligibility'
import { getSession } from '@/lib/auth-server'
import { serializeProductCardList } from '@/lib/productCardSerialization'

export async function generateMetadata(props: { params: Promise<{ productId: string, locale: string }> }): Promise<Metadata> {
    const params = await props.params;
    const data = await getProductWithSlug(params.productId)
    if (data == undefined) return {}
    const locale = params.locale as Locale
    const name = resolveProductSeoTitle(data, locale)
    const desc = resolveLocalizedString(data.metaDescription, locale) || resolveLocalizedString(data.productDescriptionShort, locale)
    const dataAdditional = await getSiteData()
    const productImages = getProductGalleryImages(data)
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
            images: productImages.map((image: string) => {
                return { url: image }
            })
        },
        twitter: {
            title: name,
            description: desc,
            card: "summary",
            images: productImages[0] || dataAdditional.logoSrc,
        },
        alternates: {
            canonical: productCanonicalUrl(dataAdditional.url, data, locale),
            languages: productAlternates(dataAdditional.url, data),
        }
    }
}

/**
 * Async component for related products with its own data fetching
 * Wrapped in Suspense for streaming - loads independently of main content.
 */
async function RelatedProductsSection({ product, isMobile }: { product: ProductDataModel, isMobile: boolean }) {
    const relatedProducts = serializeProductCardList(serializeForClient(await getRelatedProducts(product)))
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

    const locale = params.locale as Locale

    // Fetch product data - this will be part of the static shell
    const [data, dataAdditional, session] = await Promise.all([
        getProductWithSlug(productId),
        getSiteData(),
        getSession(),
    ])
    if (data == undefined) return notFound();
    
    // Get device type for responsive rendering
    // Note: headers() makes this component dynamic, but the product data
    // is still cached and the related products stream in via Suspense
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    const productDbId = typeof data._id === "string" ? data._id : data._id?.toString?.() ?? ""
    const [{ reviews, summary }, reviewEligibility] = await Promise.all([
        getApprovedProductReviews(productDbId),
        getProductReviewEligibility(productDbId, session?.user?.id ?? null),
    ])
    
    // Build compact product data for recently viewed tracking
    const trackData = {
        slug: resolveLocalizedString(data.productURL, locale),
        name: resolveLocalizedString(data.productTitle, locale) || resolveLocalizedString(data.productName, locale),
        image: getProductFeaturedImage(data),
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

            <ProductReviewsSection
                productId={productDbId}
                productTitle={resolveLocalizedString(data.productTitle, locale) || resolveLocalizedString(data.productName, locale)}
                summary={summary}
                reviews={reviews}
                eligibility={reviewEligibility}
                locale={locale}
            />

            <section className='bg-[#fbfaf7]'>
                <Suspense fallback={null}>
                    <RelatedProductsSection product={data} isMobile={isMobile} />
                </Suspense>
            </section>
        </article>
    )
}

export default ProductPage
