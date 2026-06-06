'use client'

import React from 'react'
import Image from '@/ui/components/OptimizedImage'
import Link from 'next/link'
import CartDataModel from '@/types/CartDataModel'
import Currency from '@/types/Currency'
import { getProductFeaturedImage } from '@/lib/getProductFeaturedImage'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { type Locale } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { imageQuality } from '@/utils/imageOptimization'
import { getCartItemTotal, getCartItemUnitPrice } from './cartPricing'
import { HiMinus, HiOutlineTrash, HiPlus } from 'react-icons/hi2'

const fallbackCurrency: Currency = {
    _id: '',
    active: true,
    country: 'US',
    currency: 'USD',
    currencySymbol: '$',
    default: true,
    exchangeRates: 1,
    ISO: 'US',
}

const Chip = ({ children }: { children: React.ReactNode }) => (
    <span className="rounded-full border border-primary/10 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">
        {children}
    </span>
)

const CartLineItem = ({
    item,
    userCurrency = fallbackCurrency,
    onQuantityChange,
    onRemove,
    isUpdating = false,
}: {
    item: CartDataModel
    userCurrency?: Currency
    onQuantityChange?: (delta: number) => void
    onRemove?: () => void
    isUpdating?: boolean
}) => {
    const locale = useLocale() as Locale
    const product = item.cartProduct[0]
    const variation = product?.variations?.find(value => value.variationCode === item.variationCode)
    const name = product ? resolveLocalizedString(product.productName, locale) || resolveLocalizedString(product.productTitle, locale) : ''
    const productUrl = product ? resolveLocalizedString(product.productURL, locale) : ''
    const unitPrice = getCartItemUnitPrice(item) * (userCurrency.exchangeRates ?? 1)
    const totalPrice = getCartItemTotal(item, userCurrency.exchangeRates ?? 1)

    if (!product) {
        return (
            <div className="flex items-center gap-4 rounded-lg border border-error/20 bg-error/5 p-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-error/10 text-error">!</div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-error">Product no longer available</p>
                    <p className="text-xs text-base-content/60">Remove this item to continue.</p>
                </div>
                {onRemove && (
                    <button className="btn btn-ghost btn-sm text-error" onClick={onRemove} disabled={isUpdating}>
                        <HiOutlineTrash className="h-4 w-4" />
                    </button>
                )}
            </div>
        )
    }

    return (
        <article className="grid gap-3 rounded-lg border border-primary/10 bg-base-100 p-3 shadow-sm transition hover:border-primary/25 sm:grid-cols-[112px_minmax(0,1fr)] sm:p-4">
            <Link href={`/products/${productUrl}`} prefetch={false} className="relative aspect-square overflow-hidden rounded-md bg-base-200">
                <Image
                    src={getProductFeaturedImage(product)}
                    alt={name}
                    fill
                    sizes="112px"
                    quality={imageQuality.preview}
                    className="object-cover transition duration-300 hover:scale-105"
                />
            </Link>

            <div className="min-w-0">
                <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link href={`/products/${productUrl}`} prefetch={false} className="line-clamp-2 text-sm font-semibold leading-5 text-base-content hover:text-primary sm:text-[15px]">
                            {name}
                        </Link>
                        {product.productBrand && <p className="mt-1 text-xs text-base-content/50">{product.productBrand}</p>}
                    </div>
                    {onRemove && (
                        <button className="btn btn-ghost btn-xs h-8 min-h-8 w-8 rounded-full p-0 text-error hover:bg-error/10" onClick={onRemove} disabled={isUpdating} aria-label="Remove item">
                            <HiOutlineTrash className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                    {variation?.variationSize && <Chip>Size: {variation.variationSize}</Chip>}
                    {variation?.variationColor && <Chip>Color: {variation.variationColor}</Chip>}
                    {item.variationCode === 'customSize' && (
                        <>
                            <Chip>Custom size</Chip>
                            <Chip>{item.customSize?.shape}</Chip>
                            {item.customSize?.shape === 'Round' && <Chip>Diameter {item.customSize.dimensions.diameter?.toFixed(2)}</Chip>}
                            {(item.customSize?.shape === 'Rectangle' || item.customSize?.shape === 'Runner') && <Chip>{item.customSize.dimensions.length?.toFixed(2)} x {item.customSize.dimensions.width?.toFixed(2)}</Chip>}
                            {item.customSize?.shape === 'Square' && <Chip>{item.customSize.dimensions.length?.toFixed(2)} x {item.customSize.dimensions.length?.toFixed(2)}</Chip>}
                        </>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-base-200 pt-3">
                    <div>
                        <p className="text-[11px] uppercase tracking-wide text-base-content/45">Quantity</p>
                        <div className="mt-1 inline-flex overflow-hidden rounded-md border border-base-300 bg-base-100">
                            <button className="flex h-9 w-9 items-center justify-center text-base-content/70 transition hover:bg-base-200 disabled:opacity-40" onClick={() => onQuantityChange?.(-1)} disabled={isUpdating} aria-label="Decrease quantity">
                                <HiMinus className="h-4 w-4" />
                            </button>
                            <div className="flex h-9 min-w-11 items-center justify-center border-x border-base-300 px-3 text-sm font-semibold">
                                {isUpdating ? <span className="loading loading-spinner loading-xs" /> : item.quantity}
                            </div>
                            <button className="flex h-9 w-9 items-center justify-center text-base-content/70 transition hover:bg-base-200 disabled:opacity-40" onClick={() => onQuantityChange?.(1)} disabled={isUpdating || item.quantity >= 10} aria-label="Increase quantity">
                                <HiPlus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-base-content/50">{userCurrency.currencySymbol}{unitPrice.toFixed(2)} each</p>
                        <p className="text-lg font-bold text-primary">{userCurrency.currencySymbol}{totalPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default CartLineItem
