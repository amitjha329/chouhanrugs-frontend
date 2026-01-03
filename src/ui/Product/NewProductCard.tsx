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

  // Calculate least selling price (after discount) among all variations and the main product
  let leastSellingPrice: string;
  if (productVariations.length > 0) {
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
    leastSellingPrice = Number(product.productSellingPrice).toFixed(2);
  }

  // Calculate least MSRP among all variations and the main product
  let leastMSRP: string;
  if (productVariations.length > 0) {
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
    leastMSRP = Number(product.productMSRP).toFixed(2);
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
          className='!w-[200px] !h-[135px]' 
          loading="lazy"
          placeholder="blur"
          blurDataURL={blurDataURL}
          sizes="200px"
        />
        <div className='text-clip line-clamp-2 text-xs max-w-40 text-center'>
          {product.productName}
        </div>        <div className='flex gap-2 text-xs'>
          <span className='text-primary'>$ {leastSellingPrice}</span>
          <span className='line-through text-gray-500'>$ {leastMSRP}</span>
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