import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import React from 'react'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { useLocale } from 'next-intl'
import { type Locale } from '@/i18n/routing'
import slugify from 'slugify'
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi'

interface itemProps extends ProductDataModelWithColorMap {
  className?: string
  index?: number
}

// Tiny transparent placeholder for blur effect - helps with perceived performance
const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEzNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"

const NewProductCard = (product: itemProps) => {
  const locale = useLocale() as Locale
  const name = resolveLocalizedString(product.productName, locale)
  const url = resolveLocalizedString(product.productURL, locale)
  const productVariations = product.variations ?? []
  const primaryImage = product.images?.[product.productPrimaryImageIndex] ?? product.images?.[0]
  const discountValue = Number.parseFloat(String(product.productDiscountPercentage ?? '0'))
  const discountLabel = Number.isFinite(discountValue) && discountValue > 0 ? `${discountValue}% OFF` : null
  const shouldLoadEager = (product.index ?? 0) < 2

  // Calculate least selling price (after discount) among all variations and the main product
  let leastSellingPrice: string;
  if (product.priceRange) {
    leastSellingPrice = Number(product.priceRange.min).toFixed(2);
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
    leastSellingPrice = Number(product.productSellingPrice).toFixed(2);
  }

  // Calculate least MSRP among all variations and the main product
  let leastMSRP: string;
  if (product.msrpRange) {
    leastMSRP = Number(product.msrpRange.min).toFixed(2);
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
    leastMSRP = Number(product.productMSRP).toFixed(2);
  }

  if (!primaryImage) return null

  return (
    <article className={clsx('group overflow-hidden rounded-2xl border border-[#eadfd6] bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#d6bda9] hover:shadow-lg', product.className)}>
      <Link href={'/products/' + slugify(url, { lower: true, strict: true })} className="block h-full" prefetch={false}>
        <div className="relative overflow-hidden bg-[#f6eee7]">
          <Image
            src={primaryImage}
            alt={name}
            width={420}
            height={520}
            className="aspect-[4/5] w-full object-fill transition duration-300 group-hover:scale-[1.03]"
            loading={shouldLoadEager ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {discountLabel && (
            <span className="absolute left-2 top-2 rounded-md bg-[#d60911] px-2 py-1 text-[10px] font-bold uppercase leading-none text-white shadow-sm sm:left-3 sm:top-3">
              {discountLabel}
            </span>
          )}
        </div>

        <div className="flex min-h-[128px] flex-col p-3 sm:min-h-[142px] sm:p-4">
          <p className="line-clamp-1 text-[11px] leading-4 text-[#7d7169] sm:text-xs">{product.productCategory}</p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#25170e] sm:text-[15px]">
            {name}
          </h3>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-sm font-bold leading-5 text-[#5b2f12] sm:text-base">${leastSellingPrice}</span>
            {Number(leastMSRP) > Number(leastSellingPrice) && (
              <span className="text-[11px] font-medium leading-4 text-[#8b817a] line-through sm:text-xs">${leastMSRP}</span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6c584b] sm:text-xs">
              <FiShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              New
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f1e6dd] text-[#5b2f12] transition group-hover:bg-[#5b2f12] group-hover:text-white" aria-hidden="true">
              <FiArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default NewProductCard
