import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import React from 'react'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { getProductFeaturedImage } from '@/lib/getProductFeaturedImage'
import { useLocale } from 'next-intl'
import { type Locale } from '@/i18n/routing'
import { FiArrowRight } from 'react-icons/fi'
import { productHrefFromUrl } from '@/lib/productRouting'

interface itemProps extends ProductDataModelWithColorMap {
  className?: string
  index?: number
}

const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjZGMUYwIi8+PC9zdmc+"

const getProductPrices = (product: itemProps) => {
  const productVariations = product.variations ?? []

  if (product.priceRange) {
    return {
      sellingPrice: Number(product.priceRange.min),
      msrp: Number(product.msrpRange?.min ?? product.priceRange.min),
    }
  }

  if (productVariations.length > 0) {
    const sellingPrice = productVariations.reduce((min, variation) => {
      const price = Number(variation.variationPrice ?? 0)
      const discount = Number(variation.variationDiscount ?? 0)
      const discountedPrice = price - (price * discount) / 100
      return Number.isFinite(discountedPrice) && discountedPrice >= 0 ? Math.min(min, discountedPrice) : min
    }, Number.POSITIVE_INFINITY)

    const msrp = productVariations.reduce((min, variation) => {
      const price = Number(variation.variationPrice ?? 0)
      return Number.isFinite(price) && price >= 0 ? Math.min(min, price) : min
    }, Number.POSITIVE_INFINITY)

    return {
      sellingPrice,
      msrp,
    }
  }

  return {
    sellingPrice: Number(product.productSellingPrice),
    msrp: Number(product.productMSRP),
  }
}

const NewProductCard = (product: itemProps) => {
  const locale = useLocale() as Locale
  const name = resolveLocalizedString(product.productName, locale) || resolveLocalizedString(product.productTitle, locale)
  const primaryImage = getProductFeaturedImage(product)
  const shouldLoadEager = (product.index ?? 0) < 4
  const { sellingPrice, msrp } = getProductPrices(product)
  const hasDiscount = Number.isFinite(msrp) && Number.isFinite(sellingPrice) && msrp > sellingPrice
  const productHref = productHrefFromUrl(product.productURL, locale)

  if (!primaryImage || !name || !productHref || !Number.isFinite(sellingPrice)) return null

  return (
    <article className="group overflow-hidden rounded-xl border border-[#eadfd4] bg-white shadow-[0_10px_30px_rgba(83,53,28,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_16px_36px_rgba(83,53,28,0.12)]">
      <Link href={productHref} prefetch={false} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f6f1ec]">
          <Image
            src={primaryImage}
            alt={name}
            fill
            className="object-fill transition duration-500 group-hover:scale-[1.035]"
            loading={shouldLoadEager ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {hasDiscount && (
            <span className="absolute left-2 top-2 rounded-full bg-error px-2 py-1 text-[10px] font-bold leading-none text-error-content shadow-sm">
              Sale
            </span>
          )}
        </div>

        <div className="p-3">
          <p className="line-clamp-1 text-[11px] font-medium text-base-content/55">
            {product.productCategory || 'Handcrafted'}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[34px] text-[13px] font-semibold leading-[1.3] text-base-content">
            {name}
          </h3>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
              <span className="text-sm font-bold text-primary">${sellingPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-[11px] font-medium text-base-content/40 line-through">${msrp.toFixed(2)}</span>
              )}
            </div>

            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2e7dc] text-primary transition group-hover:bg-primary group-hover:text-primary-content" aria-hidden="true">
              <FiArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default NewProductCard
