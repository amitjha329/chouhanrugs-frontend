'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import CartDataModel from '@/types/CartDataModel'
import Currency from '@/types/Currency'
import CartLineItem from './CartLineItem'
import CartTotalSection from './CartTotalSection'
import deleteProductFromCart from '@/backend/serverActions/deleteProductFromCart'
import increaseDeacreaseCartItem from '@/backend/serverActions/increaseDeacreaseCartItem'
import onPageNotifications from '@/utils/onPageNotifications'
import { useDataConnectionContext } from '@/utils/Contexts/DataConnectionContext'
import { HiArrowLeft, HiOutlineShoppingBag, HiOutlineShieldCheck, HiOutlineTruck } from 'react-icons/hi2'
import type { IconType } from 'react-icons'
import { useTranslations } from 'next-intl'

const defaultCurrency: Currency = {
    _id: '',
    active: true,
    country: 'US',
    currency: 'USD',
    currencySymbol: '$',
    default: true,
    exchangeRates: 1,
    ISO: 'US',
}

const localCartToCartItems = (items: any[]): CartDataModel[] => items.map((item) => ({
    _id: item.productId,
    quantity: item.quantity,
    cartProduct: [item.productData],
    variationCode: item.variation || '',
    customSize: item.customSize || null,
}))

const cartItemsToLocalCart = (items: CartDataModel[]) => items.map((item) => ({
    productId: item._id,
    quantity: item.quantity,
    productData: item.cartProduct[0],
    variation: item.variationCode,
    customSize: item.customSize,
}))

const CartPageClient = ({
    initialCart = [],
    source,
    userCurrency = defaultCurrency,
}: {
    initialCart?: CartDataModel[]
    source: 'user' | 'guest'
    userCurrency?: Currency
}) => {
    const t = useTranslations('cart')
    const tCommon = useTranslations('common')
    const { refreshCartItems } = useDataConnectionContext()
    const [cart, setCart] = useState<CartDataModel[]>(initialCart)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [cartReady, setCartReady] = useState(source === 'user')

    useEffect(() => {
        if (source !== 'guest') {
            setCartReady(true)
            return
        }
        const localCart = JSON.parse(localStorage.getItem('pending_cart') || '[]')
        setCart(localCartToCartItems(Array.isArray(localCart) ? localCart : []))
        setCartReady(true)
    }, [source])

    const syncGuestCart = (items: CartDataModel[]) => {
        localStorage.setItem('pending_cart', JSON.stringify(cartItemsToLocalCart(items)))
        window.dispatchEvent(new Event('local-cart-updated'))
    }

    const updateQuantity = async (item: CartDataModel, delta: number) => {
        if (updatingId) return
        if (delta > 0 && item.quantity >= 10) {
            onPageNotifications('info', 'Large quantity orders are available through bulk request.')
            return
        }

        if (delta < 0 && item.quantity <= 1) {
            await removeItem(item)
            return
        }

        const previousCart = cart
        const nextCart = cart.map((cartItem) => cartItem._id === item._id ? { ...cartItem, quantity: Math.max(1, Math.min(10, cartItem.quantity + delta)) } : cartItem)
        setCart(nextCart)

        if (source === 'guest') {
            syncGuestCart(nextCart)
            return
        }

        setUpdatingId(item._id)
        try {
            const result = await increaseDeacreaseCartItem(item._id, delta)
            if (!result?.ack) throw new Error('Cart quantity update failed')
            refreshCartItems()
        } catch {
            setCart(previousCart)
            onPageNotifications('error', 'Unable to update cart quantity.')
        } finally {
            setUpdatingId(null)
        }
    }

    const removeItem = async (item: CartDataModel) => {
        if (updatingId) return
        const previousCart = cart
        const nextCart = cart.filter((cartItem) => cartItem._id !== item._id)
        setCart(nextCart)

        if (source === 'guest') {
            syncGuestCart(nextCart)
            return
        }

        setUpdatingId(item._id)
        try {
            const result = await deleteProductFromCart(item._id)
            if (!result?.ack) throw new Error('Cart deletion failed')
            refreshCartItems()
            onPageNotifications('success', 'Product removed')
        } catch {
            setCart(previousCart)
            onPageNotifications('error', 'Unable to remove product.')
        } finally {
            setUpdatingId(null)
        }
    }

    const activeCart = useMemo(() => cart.filter((item) => item.cartProduct.length > 0), [cart])

    return (
        <main className="min-h-screen bg-base-100">
            <div className="fluid_container mx-auto px-3 py-4 sm:px-5 sm:py-6 md:px-0 md:py-8">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <Link href="/" className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-primary transition hover:text-primary/80">
                            <HiArrowLeft className="h-4 w-4" />
                            {tCommon('continueShopping')}
                        </Link>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold text-base-content md:text-3xl">
                            <HiOutlineShoppingBag className="h-7 w-7 text-primary" />
                            {t('shoppingCart')}
                        </h1>
                    </div>
                    {activeCart.length > 0 && (
                        <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
                            {activeCart.length} {activeCart.length === 1 ? tCommon('item') : tCommon('items')}
                        </span>
                    )}
                </div>

                {!cartReady ? (
                    <section className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-primary/10 bg-base-100 px-4 py-10 text-center sm:min-h-[420px]">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                        </div>
                        <h2 className="text-xl font-semibold text-base-content">{t('shoppingCart')}</h2>
                        <p className="mt-2 max-w-md text-sm text-base-content/60">Loading cart items</p>
                    </section>
                ) : activeCart.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
                        <section className="space-y-3">
                            {activeCart.map((item) => (
                                <CartLineItem
                                    key={item._id}
                                    item={item}
                                    userCurrency={userCurrency}
                                    isUpdating={updatingId === item._id}
                                    onQuantityChange={(delta) => updateQuantity(item, delta)}
                                    onRemove={() => removeItem(item)}
                                />
                            ))}
                        </section>
                        <aside className="lg:sticky lg:top-24 lg:self-start">
                            <CartTotalSection cartItems={activeCart} userCurrency={userCurrency} />
                        </aside>
                    </div>
                ) : (
                    <section className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-primary/10 bg-base-100 px-4 py-10 text-center sm:min-h-[420px]">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <HiOutlineShoppingBag className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold text-base-content">{t('emptyCart')}</h2>
                        <p className="mt-2 max-w-md text-sm text-base-content/60">{t('emptyCartMessage')}</p>
                        <Link href="/" className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-content transition hover:bg-primary/90">
                            {tCommon('startShopping')}
                        </Link>
                    </section>
                )}

                {cartReady && activeCart.length > 0 && (
                    <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {([
                            [HiOutlineShieldCheck, t('secureCheckout'), t('sslEncrypted')],
                            [HiOutlineTruck, t('freeShipping'), t('freeShippingMin')],
                            [HiOutlineShieldCheck, t('easyReturns'), t('returnPolicy')],
                            [HiOutlineShieldCheck, t('support247'), t('dedicatedHelp')],
                        ] as Array<[IconType, string, string]>).map(([Icon, title, text]) => (
                            <div key={String(title)} className="flex items-center gap-3 rounded-lg border border-primary/10 bg-base-100 p-3">
                                <Icon className="h-5 w-5 shrink-0 text-primary" />
                                <div>
                                    <p className="text-xs font-semibold text-base-content">{String(title)}</p>
                                    <p className="text-[11px] text-base-content/55">{String(text)}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </main>
    )
}

export default CartPageClient
