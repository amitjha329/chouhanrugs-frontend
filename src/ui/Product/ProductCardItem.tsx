import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import WishListButton from './WishListButton'
import ProductsCardStyle from './WishlistButton.module.scss'
import { blurPlaceholders, productImageSizes, imageQuality } from '@/utils/imageOptimization'

interface CompoProps extends ProductDataModelWithColorMap {
    className?: string,
    sponsered?: boolean,
    /** Index in a list - used for determining eager vs lazy loading */
    index?: number
}

/**
 * Server Component for product cards - optimized for SEO
 * Uses Next.js Image with blur placeholder for optimal loading without client-side state
 */
const ProductCardItem = (props: CompoProps) => {
    const productVariations = props.variations ?? []
    
    // Load first 4 images eagerly, rest lazy
    const shouldLoadEager = (props.index ?? 0) < 4

    // Use pre-computed priceRange from Algolia if available, else compute from variations/base price
    const priceRange = (props as any).priceRange as { min: number; max: number } | undefined
    const msrpRange = (props as any).msrpRange as { min: number; max: number } | undefined

    let sellingPriceDisplay: string
    let msrpDisplay: string

    if (priceRange && priceRange.min > 0) {
        sellingPriceDisplay = `$ ${priceRange.min.toFixed(2)}`
    } else if (productVariations.length > 0) {
        const prices = productVariations.map(v => {
            const price = Number(v.variationPrice ?? '0')
            const discount = Number(v.variationDiscount ?? '0')
            return price - (discount / 100) * price
        }).filter(p => !isNaN(p) && p > 0)
        if (prices.length > 0) {
            sellingPriceDisplay = `$ ${Math.min(...prices).toFixed(2)}`
        } else {
            sellingPriceDisplay = `$ ${Number(props.productSellingPrice).toFixed(2)}`
        }
    } else {
        sellingPriceDisplay = `$ ${Number(props.productSellingPrice).toFixed(2)}`
    }

    if (msrpRange && msrpRange.min > 0) {
        msrpDisplay = `$ ${msrpRange.min.toFixed(2)}`
    } else if (productVariations.length > 0) {
        const msrps = productVariations.map(v => Number(v.variationPrice ?? '0')).filter(p => !isNaN(p) && p > 0)
        if (msrps.length > 0) {
            msrpDisplay = `$ ${Math.min(...msrps).toFixed(2)}`
        } else {
            msrpDisplay = `$ ${Number(props.productMSRP).toFixed(2)}`
        }
    } else {
        msrpDisplay = `$ ${Number(props.productMSRP).toFixed(2)}`
    }

    return (
        <div className={clsx('bg-white rounded-xl overflow-hidden w-full text-center relative mr-3', props.className, ProductsCardStyle.product_card)}>
            <WishListButton productDetails={props} />
            <Link href={'/products/' + props.productURL} className="" prefetch={false}>
                <div className="relative rounded-2xl overflow-hidden">
                    <Image 
                        src={props.images[props.productPrimaryImageIndex]} 
                        alt={props.productName} 
                        className="!w-full !relative aspect-[4/5] object-fill"
                        width={400}
                        height={500}
                        placeholder="blur"
                        blurDataURL={blurPlaceholders.warmNeutral}
                        loading={shouldLoadEager ? "eager" : "lazy"}
                        sizes={productImageSizes.card}
                        quality={imageQuality.standard}
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{props.productDiscountPercentage}</div>
                    {props.sponsered && <div className='rounded-full text-primary py-1 px-2 text-xs bg-white absolute max-md:bottom-2 md:top-2 left-1/2 -translate-x-1/2'>Sponsored</div>}
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
                <div className="p-4">
                    <div className="font-light text-gray-500 text-center max-md:text-xs">{props.productCategory}</div>
                    <div className="text-xs font-medium text-gray-800 mt-1 line-clamp-2">{props.productName}</div>
                    <div className="flex items-center mt-2 justify-center max-md:text-sm flex-wrap gap-x-2">
                        <div className="text-primary">{sellingPriceDisplay}</div>
                        <div className="text-gray-500 line-through max-md:text-xs">{msrpDisplay}</div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCardItem