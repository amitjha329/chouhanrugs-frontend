import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import WishListButton from './WishListButton'

interface itemProps extends ProductDataModelWithColorMap {
  className?: string
}

// Tiny transparent placeholder for blur effect - helps with perceived performance
const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEzNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"

const NewProductCard = (product: itemProps) => {
  const productVariations = product.variations ?? []

  // Use pre-computed priceRange from Algolia if available, else compute from variations/base price
  const priceRange = (product as any).priceRange as { min: number; max: number } | undefined
  const msrpRange = (product as any).msrpRange as { min: number; max: number } | undefined

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
      sellingPriceDisplay = `$ ${Number(product.productSellingPrice).toFixed(2)}`
    }
  } else {
    sellingPriceDisplay = `$ ${Number(product.productSellingPrice).toFixed(2)}`
  }

  if (msrpRange && msrpRange.min > 0) {
    msrpDisplay = `$ ${msrpRange.min.toFixed(2)}`
  } else if (productVariations.length > 0) {
    const msrps = productVariations.map(v => Number(v.variationPrice ?? '0')).filter(p => !isNaN(p) && p > 0)
    if (msrps.length > 0) {
      msrpDisplay = `$ ${Math.min(...msrps).toFixed(2)}`
    } else {
      msrpDisplay = `$ ${Number(product.productMSRP).toFixed(2)}`
    }
  } else {
    msrpDisplay = `$ ${Number(product.productMSRP).toFixed(2)}`
  }

  return (
    <div className={clsx('card items-center justify-around z-30 bg-base-100 card-body p-4 relative', product.className)}>
      {/* <WishListButton productDetails={product} /> */}
      <Link href={'/products/' + product.productURL} className="" prefetch={false}>
        <Image 
          src={product.images[product.productPrimaryImageIndex]} 
          alt={product.productName} 
          width={200} 
          height={135} 
          className='!w-[200px] !h-[135px] object-fill' 
          loading="lazy"
          placeholder="blur"
          blurDataURL={blurDataURL}
          sizes="200px"
        />
        <div className='text-clip line-clamp-2 text-xs max-w-40 text-center'>
          {product.productName}
        </div>        <div className='flex gap-2 text-xs flex-wrap'>
          <span className='text-primary'>{sellingPriceDisplay}</span>
          <span className='line-through text-gray-500'>{msrpDisplay}</span>
        </div>
        {/* Simple star display instead of interactive rating - reduces DOM elements */}
        <div className="flex text-orange-400 text-xs" aria-label="4 out of 5 stars">
          ★★★★☆
        </div>
      </Link>
    </div>
  )
}

export default NewProductCard