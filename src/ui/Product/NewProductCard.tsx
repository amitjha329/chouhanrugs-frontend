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
  variant?: 'default' | 'feature'
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
  const isFeature = product.variant === 'feature'

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
    <article className={clsx(
      'group overflow-hidden rounded-xl border border-primary/10 bg-base-100 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md',
      isFeature && 'lg:h-full',
      product.className
    )}>
      <Link href={'/products/' + slugify(url, { lower: true, strict: true })} className={clsx('block', isFeature && 'lg:h-full')} prefetch={false}>
        <div className={clsx('relative overflow-hidden bg-secondary/30', isFeature && 'lg:h-full')}>
          <Image
            src={primaryImage}
            alt={name}
            width={420}
            height={420}
            className={clsx(
              'w-full object-cover transition duration-500 group-hover:scale-[1.03]',
              isFeature ? 'aspect-[1.25/1] lg:h-full lg:aspect-auto' : 'aspect-[1.45/1]'
            )}
            loading={shouldLoadEager ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes={isFeature ? '(max-width: 1024px) 100vw, 30vw' : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'}
          />
          <div
            className={clsx(
              'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent',
              isFeature ? 'h-2/3 opacity-100' : 'h-1/3 opacity-0 transition group-hover:opacity-100'
            )}
            aria-hidden="true"
          />
          {discountLabel && (
            <span className="absolute left-2 top-2 rounded-md bg-error px-1.5 py-1 text-[9px] font-bold uppercase leading-none text-error-content shadow-sm">
              {discountLabel}
            </span>
          )}

          {isFeature && (
            <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-3.5">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/18 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] backdrop-blur">
                <FiShoppingBag className="h-3 w-3" aria-hidden="true" />
                New arrival
              </p>
              <h3 className="mt-2 line-clamp-2 font-serif text-lg leading-tight sm:text-xl">
                {name}
              </h3>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-base font-bold leading-none">${leastSellingPrice}</span>
                  {Number(leastMSRP) > Number(leastSellingPrice) && (
                    <span className="text-xs font-medium text-white/72 line-through">${leastMSRP}</span>
                  )}
                </div>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-primary transition group-hover:translate-x-0.5" aria-hidden="true">
                  <FiArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          )}
        </div>

        {!isFeature && (
          <div className="flex min-h-[74px] flex-col p-2 sm:min-h-[82px] sm:p-2.5">
            <p className="line-clamp-1 text-[9px] font-medium leading-3 text-base-content/55">
              {product.productCategory}
            </p>
            <h3 className="line-clamp-2 text-[11px] font-semibold leading-[1.25] text-base-content">
              {name}
            </h3>

            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              <span className="text-xs font-bold leading-5 text-primary">${leastSellingPrice}</span>
              {Number(leastMSRP) > Number(leastSellingPrice) && (
                <span className="text-[9px] font-medium leading-4 text-base-content/45 line-through">${leastMSRP}</span>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-base-content/60">
                <FiShoppingBag className="h-3 w-3" aria-hidden="true" />
                New
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary/55 text-primary transition group-hover:bg-primary group-hover:text-primary-content" aria-hidden="true">
                <FiArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        )}
      </Link>
    </article>
  )
}

export default NewProductCard
