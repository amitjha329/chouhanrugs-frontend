import React from 'react'
import ProductCardItem from '@/ui/Product/ProductCardItem'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { getProductFeaturedImage } from '@/lib/getProductFeaturedImage'
import { type Locale } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { FiArrowRight, FiStar } from 'react-icons/fi'
import WishListButton from '@/ui/Product/WishListButton'
import { blurPlaceholders, imageQuality } from '@/utils/imageOptimization'
import { productHrefFromUrl } from '@/lib/productRouting'

const getProductPrice = (product: ProductDataModelWithColorMap) => {
    const productVariations = product.variations ?? []

    if (product.priceRange) {
        return Number(product.priceRange.min).toFixed(2)
    }

    if (productVariations.length > 0) {
        return Number(
            productVariations.reduce((min, variation) => {
                const price = Number(variation.variationPrice ?? '0')
                const discount = Number(variation.variationDiscount ?? '0')
                const sellingPrice = price - (discount / 100) * price

                if (Number.isNaN(sellingPrice) || sellingPrice < 0) {
                    return min
                }

                return Math.min(min, sellingPrice)
            }, Number.POSITIVE_INFINITY)
        ).toFixed(2)
    }

    return Number(product.productSellingPrice).toFixed(2)
}

const getProductMsrp = (product: ProductDataModelWithColorMap) => {
    const productVariations = product.variations ?? []

    if (product.msrpRange) {
        return Number(product.msrpRange.min).toFixed(2)
    }

    if (productVariations.length > 0) {
        return Number(
            productVariations.reduce((min, variation) => {
                const msrp = Number(variation.variationPrice ?? '0')

                if (Number.isNaN(msrp) || msrp < 0) {
                    return min
                }

                return Math.min(min, msrp)
            }, Number.POSITIVE_INFINITY)
        ).toFixed(2)
    }

    return Number(product.productMSRP).toFixed(2)
}

const CenterFeaturedProductCard = ({
    product,
    index,
}: {
    product: ProductDataModelWithColorMap
    index: number
}) => {
    const locale = useLocale() as Locale
    const name = resolveLocalizedString(product.productName, locale) || resolveLocalizedString(product.productTitle, locale)
    const primaryImage = getProductFeaturedImage(product)
    const productHref = productHrefFromUrl(product.productURL, locale)
    const sellingPrice = getProductPrice(product)
    const msrp = getProductMsrp(product)
    const discountValue = Number.parseFloat(String(product.productDiscountPercentage ?? '0'))
    const discountLabel = Number.isFinite(discountValue) && discountValue > 0
        ? `${discountValue}% OFF`
        : null
    const reviewAverage = Number(product.productReviews?.average ?? 0)
    const reviewCount = Number(product.productReviews?.totalReviews ?? 0)
    const hasReviews = reviewCount > 0

    if (!primaryImage || !name || !productHref) return null

    return (
        <article className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-[14px] border border-[#eadfd6] bg-white p-2 shadow-[0_12px_30px_rgba(83,53,28,0.12)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(83,53,28,0.16)]">
            <WishListButton
                productDetails={product}
                className="!right-4 !top-4 !h-12 !w-12 !bg-white !shadow-[0_5px_18px_rgba(83,53,28,0.14)] !ring-[#eadfd6]"
                iconClassName="!h-[30px] !w-[34px]"
            />

            <Link href={productHref} prefetch={false} className="flex h-full min-h-0 flex-col">
                <div className="relative aspect-[4/5] shrink-0 overflow-hidden rounded-[10px_10px_0_0] bg-[#f8f1ea]">
                    <Image
                        src={primaryImage}
                        alt={name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.018]"
                        placeholder="blur"
                        blurDataURL={blurPlaceholders.warmNeutral}
                        loading={index < 4 ? 'eager' : 'lazy'}
                        sizes="(max-width: 1280px) 22vw, 20vw"
                        quality={imageQuality.standard}
                    />

                    {discountLabel && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#d60911] px-3 py-1.5 text-[11px] font-bold uppercase leading-none text-white shadow-sm">
                            {discountLabel}
                        </span>
                    )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col rounded-[0_0_10px_10px] bg-[#fffaf5] px-5 pb-5 pt-7">
                    <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#d8a77a] bg-[#fff6ee] px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.01em] text-[#754018]">
                        <FiStar className="h-3.5 w-3.5 fill-[#7a431d]" aria-hidden="true" />
                        Featured Pick
                    </span>

                    <div className="line-clamp-1 text-[13px] font-medium leading-5 text-[#897b70]">
                        {product.productCategory}
                    </div>

                    <h3 className="mt-1.5 line-clamp-3 text-[19px] font-semibold leading-[26px] text-[#20160f] xl:text-[20px] xl:leading-[28px]">
                        {name}
                    </h3>

                    <div className="mt-auto pt-6">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-[24px] font-bold leading-none text-[#5a2f14] xl:text-[26px]">
                                ${sellingPrice}
                            </span>
                            {Number(msrp) > Number(sellingPrice) && (
                                <span className="text-[15px] font-medium leading-5 text-[#8b817a] line-through">
                                    ${msrp}
                                </span>
                            )}
                        </div>

                        <div className="mt-8 flex items-center justify-between gap-6">
                            {hasReviews ? (
                                <>
                                    <div className="flex min-w-0 items-center gap-2 text-[17px] font-medium leading-6 text-[#5b4030]">
                                        <FiStar className="h-6 w-6 shrink-0 fill-[#6b360f] text-[#6b360f]" aria-hidden="true" />
                                        <span>{reviewAverage.toFixed(1)}</span>
                                        <span className="text-[#7d7169]">({reviewCount})</span>
                                    </div>

                                    <span className="h-10 w-px bg-[#eadfd6]" aria-hidden="true" />
                                </>
                            ) : <span />}

                            <span className="inline-flex min-w-[144px] items-center justify-center gap-2 rounded-full bg-[#7a431d] px-7 py-3.5 text-[20px] font-bold leading-6 text-white shadow-[0_8px_18px_rgba(83,53,28,0.18)] transition group-hover:bg-[#4d2a12]">
                                View
                                <FiArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    )
}

const ProductList = ({ products }: { products: ProductDataModelWithColorMap[] }) => {
    if (products.length === 0) return null

    const featuredIndex = Math.min(5, products.length - 1)
    const featuredProduct = products[featuredIndex]
    const leftProducts = products.slice(1, featuredIndex)
    const rightProducts = products.slice(featuredIndex + 1)
    const mobileGroups = products
        .slice(0, 6)
        .reduce((accumulator: ProductDataModelWithColorMap[][], _, currentIndex, array) => {
            if (currentIndex % 2 === 0) {
                accumulator.push(array.slice(currentIndex, currentIndex + 2))
            }
            return accumulator
        }, [])

    return (
        <>
            <div className="carousel carousel-center max-w-full space-x-3 px-1 pb-1 pt-1 md:hidden">
                {mobileGroups.map((group, groupIndex) => (
                    <div
                        key={(group[0]?._id ?? group[0]?.objectID ?? groupIndex).toString()}
                        className="carousel-item w-[10.75rem] flex-none flex-col gap-3"
                    >
                        {group.map((product, indexWithinGroup) => {
                            const absoluteIndex = groupIndex * 2 + indexWithinGroup
                            return (
                                <ProductCardItem
                                    key={(product._id ?? product.objectID ?? absoluteIndex).toString()}
                                    {...product}
                                    index={absoluteIndex}
                                    density="compact"
                                    imageWrapperClassName="aspect-[4/5]"
                                    titleClassName="text-[12px] leading-[16px]"
                                    imageSizes="172px"
                                />
                            )
                        })}
                    </div>
                ))}
            </div>

            <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)_minmax(0,1fr)] md:items-stretch md:gap-4 xl:gap-5">
                <div className="grid grid-cols-2 gap-3 xl:gap-4">
                    {leftProducts.map((product, index) => (
                        <ProductCardItem
                            key={(product._id ?? product.objectID ?? index).toString()}
                            {...product}
                            index={index}
                            density="compact"
                            imageWrapperClassName="aspect-[4/5]"
                            imageSizes="(max-width: 1280px) 16vw, 14vw"
                        />
                    ))}
                </div>

                <CenterFeaturedProductCard product={featuredProduct} index={featuredIndex} />

                <div className="grid grid-cols-2 gap-3 xl:gap-4">
                    {rightProducts.map((product, index) => (
                        <ProductCardItem
                            key={(product._id ?? product.objectID ?? index).toString()}
                            {...product}
                            index={featuredIndex + index + 1}
                            density="compact"
                            imageWrapperClassName="aspect-[4/5]"
                            imageSizes="(max-width: 1280px) 16vw, 14vw"
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export { ProductList }
