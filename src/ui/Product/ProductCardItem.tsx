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
import { getProductFeaturedImage } from '@/lib/getProductFeaturedImage'
import { type Locale } from '@/i18n/routing'
import slugify from 'slugify'
import { FiArrowRight, FiStar } from 'react-icons/fi'

interface CompoProps extends ProductDataModelWithColorMap {
    className?: string,
    sponsered?: boolean,
    /** Index in a list - used for determining eager vs lazy loading */
    index?: number
    density?: 'default' | 'compact'
    layout?: 'default' | 'featuredOverlay'
    imageWrapperClassName?: string
    contentWrapperClassName?: string
    titleClassName?: string
    categoryClassName?: string
    priceClassName?: string
    showRating?: boolean
    ctaLabel?: string
    imageSizes?: string
    fillHeight?: boolean
}

/**
 * Product card component - optimized for SEO
 * Uses Next.js Image with blur placeholder for optimal loading without client-side state
 */
const ProductCardItem = (props: CompoProps) => {
    const t = useTranslations('product')
    const locale = useLocale() as Locale
    const name = resolveLocalizedString(props.productTitle, locale) || resolveLocalizedString(props.productName, locale)
    const url = resolveLocalizedString(props.productURL, locale)
    const primaryImage = getProductFeaturedImage(props)
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
    const density = props.density ?? 'default'
    const layout = props.layout ?? 'default'
    const showRating = props.showRating ?? true
    const fillHeight = props.fillHeight ?? false

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

    if (!primaryImage || !name) return null

    if (layout === 'featuredOverlay') {
        return (
            <div className={clsx('group relative w-full overflow-hidden rounded-[28px] border border-[#eadfd6] bg-white text-left shadow-[0_12px_30px_rgba(83,53,28,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(83,53,28,0.14)]', props.className, ProductsCardStyle.product_card)}>
                <WishListButton productDetails={props} />
                <Link href={productHref} className="block h-full" prefetch={false}>
                    <div className={clsx('relative min-h-[380px] overflow-hidden md:min-h-[460px]', props.imageWrapperClassName)}>
                        <Image
                            src={primaryImage}
                            alt={name}
                            className="!absolute inset-0 !h-full !w-full object-fill transition duration-700 group-hover:scale-[1.04]"
                            fill
                            placeholder="blur"
                            blurDataURL={blurPlaceholders.warmNeutral}
                            loading={shouldLoadEager ? "eager" : "lazy"}
                            sizes={props.imageSizes ?? "(max-width: 1024px) 100vw, 30vw"}
                            quality={imageQuality.standard}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1d150f]/88 via-[#1d150f]/15 to-transparent" />
                        {discountLabel && (
                            <div className="absolute left-4 top-4 rounded-full bg-[#546c4d] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm">
                                Featured
                            </div>
                        )}
                        <div className={clsx('absolute inset-x-0 bottom-0 p-5 text-white md:p-7', props.contentWrapperClassName)}>
                            <div className={clsx('text-[12px] font-medium text-white/75 md:text-sm', props.categoryClassName)}>{props.productCategory}</div>
                            <h2 className={clsx('mt-2 max-w-[15ch] text-[22px] font-semibold leading-[1.08] md:text-[30px]', props.titleClassName)}>
                                {name}
                            </h2>
                            <div className={clsx('mt-4 flex flex-wrap items-end gap-x-3 gap-y-1', props.priceClassName)}>
                                <span className="text-[22px] font-bold md:text-[28px]">${leastSellingPrice}</span>
                                {Number(leastMSRP) > Number(leastSellingPrice) && (
                                    <span className="pb-1 text-sm text-white/55 line-through md:text-base">${leastMSRP}</span>
                                )}
                            </div>
                            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#241a13] shadow-sm transition group-hover:bg-[#f6ede5] md:px-5 md:py-2.5">
                                {props.ctaLabel ?? 'Shop Now'}
                                <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }

    return (
        <div className={clsx('group relative w-full overflow-hidden rounded-xl border border-[#eadfd6] bg-white text-left shadow-[0_8px_24px_rgba(83,53,28,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_14px_30px_rgba(83,53,28,0.12)]', fillHeight && 'h-full', props.className, ProductsCardStyle.product_card)}>
            <WishListButton productDetails={props} />
            <Link href={productHref} className={clsx('block', fillHeight && 'flex h-full flex-col')} prefetch={false}>
                <div className={clsx(
                    'relative overflow-hidden bg-[#f8f1ea]',
                    fillHeight
                        ? 'min-h-[360px] flex-1'
                        : density === 'compact'
                            ? 'aspect-[4/5]'
                            : 'aspect-[4/5]',
                    props.imageWrapperClassName
                )}>
                    {fillHeight ? (
                        <Image
                            src={primaryImage}
                            alt={name}
                            className="!absolute inset-0 !h-full !w-full object-fill transition duration-500 group-hover:scale-[1.035]"
                            fill
                            placeholder="blur"
                            blurDataURL={blurPlaceholders.warmNeutral}
                            loading={shouldLoadEager ? "eager" : "lazy"}
                            sizes={props.imageSizes ?? productImageSizes.card}
                            quality={imageQuality.standard}
                        />
                    ) : (
                        <Image
                            src={primaryImage}
                            alt={name}
                            className="!relative !h-full !w-full object-fill transition duration-500 group-hover:scale-[1.035]"
                            width={400}
                            height={400}
                            placeholder="blur"
                            blurDataURL={blurPlaceholders.warmNeutral}
                            loading={shouldLoadEager ? "eager" : "lazy"}
                            sizes={props.imageSizes ?? productImageSizes.card}
                            quality={imageQuality.standard}
                        />
                    )}
                    {discountLabel && (
                        <div className={clsx(
                            'absolute left-2 top-2 rounded-full bg-[#d60911] font-bold uppercase leading-none text-white shadow-sm',
                            density === 'compact' ? 'px-2 py-1 text-[8px] sm:text-[9px]' : 'px-2 py-1 text-[9px] sm:text-[10px]'
                        )}>
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
                <div className={clsx(
                    density === 'compact' ? 'px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3' : 'px-2.5 pb-2.5 pt-2.5 sm:px-3 sm:pb-3',
                    fillHeight && 'shrink-0',
                    props.contentWrapperClassName
                )}>
                    <div className={clsx(
                        density === 'compact' ? 'line-clamp-1 text-[10px] font-medium leading-3 text-[#8a7d72]' : 'line-clamp-1 text-[10px] font-medium leading-3 text-[#8a7d72] sm:text-[11px]',
                        props.categoryClassName
                    )}>{props.productCategory}</div>
                    <h2 className={clsx(
                        density === 'compact'
                            ? 'mt-1 line-clamp-2 min-h-[28px] text-[11px] font-semibold leading-[15px] text-[#25170e] sm:text-[12px] sm:leading-4'
                            : 'mt-1 line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-4 text-[#25170e] sm:text-[13px] sm:leading-[18px]',
                        props.titleClassName
                    )}>
                        {name}
                    </h2>
                    <div className={clsx(
                        density === 'compact' ? 'mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1' : 'mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1',
                        props.priceClassName
                    )}>
                        <span className={clsx(density === 'compact' ? 'text-[13px] font-bold leading-4 text-[#4d2a12] sm:text-sm' : 'text-sm font-bold leading-5 text-[#4d2a12] sm:text-[15px]')}>${leastSellingPrice}</span>
                        {Number(leastMSRP) > Number(leastSellingPrice) && (
                            <span className={clsx(density === 'compact' ? 'text-[9px] font-medium leading-3 text-[#8b817a] line-through sm:text-[10px]' : 'text-[10px] font-medium leading-4 text-[#8b817a] line-through sm:text-[11px]')}>${leastMSRP}</span>
                        )}
                    </div>
                    <div className={clsx(density === 'compact' ? 'mt-2 flex items-center justify-between gap-2' : 'mt-2.5 flex items-center justify-between gap-2')}>
                        {showRating ? (
                            <div className={clsx(
                                density === 'compact'
                                    ? 'flex min-w-0 items-center gap-1 text-[9px] font-medium leading-3 text-[#5b4030] sm:text-[10px]'
                                    : 'flex min-w-0 items-center gap-1 text-[10px] font-medium leading-4 text-[#5b4030] sm:text-[11px]'
                            )}>
                                <FiStar className={clsx(density === 'compact' ? 'h-3 w-3 shrink-0 fill-[#6b360f] text-[#6b360f]' : 'h-3.5 w-3.5 shrink-0 fill-[#6b360f] text-[#6b360f]')} aria-hidden="true" />
                                <span>{reviewAverage > 0 ? reviewAverage.toFixed(1) : '4.8'}</span>
                                <span className="text-[#7d7169]">({reviewCount > 0 ? reviewCount : 32})</span>
                            </div>
                        ) : (
                            <span />
                        )}
                        <span className={clsx(
                            density === 'compact'
                                ? 'inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f2e7dc] px-2 py-1.5 text-[9px] font-bold leading-3 text-[#4d2a12] transition group-hover:bg-[#4d2a12] group-hover:text-white sm:text-[10px]'
                                : 'inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f2e7dc] px-2.5 py-1.5 text-[10px] font-bold leading-4 text-[#4d2a12] transition group-hover:bg-[#4d2a12] group-hover:text-white sm:text-[11px]',
                            props.priceClassName
                        )}>
                            <span className="max-[380px]:sr-only">{props.ctaLabel ?? 'View'}</span>
                            <FiArrowRight className={clsx(density === 'compact' ? 'h-3 w-3 transition group-hover:translate-x-0.5' : 'h-3.5 w-3.5 transition group-hover:translate-x-0.5')} aria-hidden="true" />
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCardItem
