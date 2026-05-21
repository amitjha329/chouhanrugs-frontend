import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import React from 'react'
import WishListButton from './WishListButton'
import ProductsCardStyle from './WishlistButton.module.scss'
import { blurPlaceholders, productImageSizes, imageQuality } from '@/utils/imageOptimization'
import { useTranslations, useLocale } from 'next-intl'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { type Locale } from '@/i18n/routing'
import slugify from 'slugify'
import { FiShoppingBag, FiStar } from 'react-icons/fi'

interface CompoProps extends ProductDataModelWithColorMap {
    className?: string,
    sponsered?: boolean,
    /** Index in a list - used for determining eager vs lazy loading */
    index?: number
}

/**
 * Product card component - optimized for SEO
 * Uses Next.js Image with blur placeholder for optimal loading without client-side state
 */
const ProductCardItem = (props: CompoProps) => {
    const t = useTranslations('product')
    const locale = useLocale() as Locale
    const name = resolveLocalizedString(props.productName, locale)
    const url = resolveLocalizedString(props.productURL, locale)
    const productVariations = props.variations ?? []
    const productHref = '/products/' + slugify(url, {
        lower: true,
        strict: true
    })
    const discountValue = Number.parseFloat(String(props.productDiscountPercentage ?? '0'))
    const discountLabel = Number.isFinite(discountValue) && discountValue > 0
        ? `${discountValue}% OFF`
        : null
    const reviewAverage = Number(props.productReviews?.average ?? 0)
    const reviewCount = Number(props.productReviews?.totalReviews ?? 0)

    // Load first 4 images eagerly, rest lazy
    const shouldLoadEager = (props.index ?? 0) < 4

    // Calculate least selling price (after discount) among all variations and the main product
    let leastSellingPrice: string;
    if (props.priceRange) {
        leastSellingPrice = Number(props.priceRange.min).toFixed(2);
    } else if (productVariations.length > 0) {
        leastSellingPrice = Number(
            productVariations.reduce((min, variation) => {
                const price = Number(variation.variationPrice ?? '0');
                const discount = Number(variation.variationDiscount ?? '0');
                const sellingPrice = price - (discount / 100) * price;
                if (isNaN(sellingPrice) || sellingPrice < 0) {
                    return min;
                }
                return Math.min(min, sellingPrice);
            }, Number.POSITIVE_INFINITY)
        ).toFixed(2);
    } else {
        leastSellingPrice = Number(props.productSellingPrice).toFixed(2);
    }

    // Calculate least MSRP among all variations and the main product
    let leastMSRP: string;
    if (props.msrpRange) {
        leastMSRP = Number(props.msrpRange.min).toFixed(2);
    } else if (productVariations.length > 0) {
        leastMSRP = Number(
            productVariations.reduce((min, variation) => {
                const msrp = Number(variation.variationPrice ?? '0');
                if (isNaN(msrp) || msrp < 0) {
                    return min;
                }
                return Math.min(min, msrp);
            }, Number.POSITIVE_INFINITY)
        ).toFixed(2);
    } else {
        leastMSRP = Number(props.productMSRP).toFixed(2);
    }

    return (
        <div className={clsx('group relative w-full overflow-hidden rounded-2xl border border-[#eadfd6] bg-[#fffaf7] text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg', props.className, ProductsCardStyle.product_card)}>
            <WishListButton productDetails={props} />
            <Link href={productHref} className="block" prefetch={false}>
                <div className="relative overflow-hidden bg-[#f8f1ea]">
                    <Image 
                        src={props.images[props.productPrimaryImageIndex]} 
                        alt={name} 
                        className="!w-full !relative aspect-[4/5] object-fill"
                        width={400} 
                        height={500}
                        placeholder="blur"
                        blurDataURL={blurPlaceholders.warmNeutral}
                        loading={shouldLoadEager ? "eager" : "lazy"}
                        sizes={productImageSizes.card}
                        quality={imageQuality.standard}
                    />
                    {discountLabel && (
                        <div className="absolute left-3 top-3 rounded-md bg-[#d60911] px-2 py-1 text-[10px] font-bold uppercase leading-none text-white shadow-sm sm:text-xs">
                            {discountLabel}
                        </div>
                    )}
                    {props.sponsered && <div className='rounded-full text-primary py-1 px-2 text-xs bg-white absolute max-md:bottom-2 md:top-2 left-1/2 -translate-x-1/2'>{t('sponsored')}</div>}
                    {props.colorMap && props.colorMap.length > 0 && <div className='absolute bottom-2 left-2'>
                        <div className="avatar-group -space-x-3 rtl:space-x-reverse">
                            {
                                props.colorMap.slice(0, 3).map(color => (
                                    <div className="avatar border border-black" key={color._id?.toString()}>
                                        <div className="w-6 h-6" style={{ backgroundColor: color.colorCode.hex }}></div>
                                    </div>
                                ))
                            }
                            {props.colorMap.length > 3 && (
                                <div className="ml-2 w-6 h-6 avatar border border-black bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                    +{props.colorMap.length - 3}
                                </div>
                            )}
                        </div>
                    </div>}
                </div>
                <div className="px-3 pb-3 pt-3 sm:px-3.5 sm:pb-3.5">
                    <div className="line-clamp-1 text-xs font-light leading-4 text-[#7d7169] sm:text-xs">{props.productCategory}</div>
                    <h2 className="mt-1 line-clamp-2 min-h-9 text-xs font-medium leading-[18px] text-[#25170e] sm:text-sm sm:leading-5">
                        {name}
                    </h2>
                    <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-[15px] font-bold leading-5 text-[#4d2a12] sm:text-base">${leastSellingPrice}</span>
                        {Number(leastMSRP) > Number(leastSellingPrice) && (
                            <span className="text-xs font-medium leading-4 text-[#8b817a] line-through">${leastMSRP}</span>
                        )}
                    </div>
                    <div className="mt-2.5 flex items-center justify-end gap-2">
                        {/* <div className="flex min-w-0 items-center gap-1 text-[11px] font-medium leading-4 text-[#5b4030] sm:text-xs">
                            <FiStar className="h-3.5 w-3.5 shrink-0 fill-[#6b360f] text-[#6b360f]" aria-hidden="true" />
                            <span>{reviewAverage > 0 ? reviewAverage.toFixed(1) : '4.8'}</span>
                            <span className="text-[#7d7169]">({reviewCount > 0 ? reviewCount : 32})</span>
                        </div> */}
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#c8b7a8] bg-white px-2.5 py-1.5 text-[11px] font-semibold leading-4 text-[#4d2a12] transition group-hover:border-[#4d2a12] group-hover:bg-[#4d2a12] group-hover:text-white sm:px-3 sm:text-xs">
                            <FiShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="max-[380px]:sr-only">Add to cart</span>
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCardItem
