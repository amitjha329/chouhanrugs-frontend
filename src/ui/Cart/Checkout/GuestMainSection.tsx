// @ts-nocheck
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import Link from 'next/link'
import CartDataModel from '@/types/CartDataModel'
import Currency from '@/types/Currency'
import validateCoupon from '@/backend/serverActions/validateCoupon'
import onPageNotifications from '@/utils/onPageNotifications'
import CartLineItem from '../CartLineItem'
import { getCartItemTotal } from '../cartPricing'
import {
    HiArrowLeft,
    HiOutlineLockClosed,
    HiOutlineShoppingBag,
    HiOutlineTruck,
    HiOutlineUserCircle,
} from 'react-icons/hi2'

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

const InlineProgress = ({ label }: { label: string }) => (
    <div className="flex min-h-20 items-center justify-center rounded-md border border-primary/10 bg-primary/5 px-4 py-5 text-sm font-medium text-primary">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="ml-2">{label}</span>
    </div>
)

const SummaryContent = ({
    cart,
    userCurrency,
    cartTotal,
    taxRate,
    taxation,
    totalCost,
    couponCode,
    setCouponCode,
    couponApplied,
    couponError,
    deductable,
    applyCoupon,
    loginToCheckout,
}: {
    cart: CartDataModel[]
    userCurrency: Currency
    cartTotal: number
    taxRate: number
    taxation: number
    totalCost: number
    couponCode: string
    setCouponCode: React.Dispatch<React.SetStateAction<string>>
    couponApplied: boolean
    couponError: string
    deductable: number
    applyCoupon: () => void
    loginToCheckout: () => void
}) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-base-content/70">Items ({cart.length})</span>
            <span className="shrink-0 font-medium text-base-content">{userCurrency?.currencySymbol} {cartTotal.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Delivery</label>
            <div className="rounded-md border border-primary/10 bg-primary/5 px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-base-content/70">Address required</span>
                    <span className="shrink-0 text-right font-medium text-base-content">After sign in</span>
                </div>
            </div>
        </div>

        <div className="space-y-2">
            <label htmlFor="guest-coupon" className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Promo code</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    id="guest-coupon"
                    placeholder="Enter code"
                    className={clsx(
                        'h-10 min-w-0 flex-1 rounded-md border border-primary/10 bg-base-100 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10',
                        couponApplied && 'border-success',
                        couponError && 'border-error'
                    )}
                    value={couponCode}
                    onChange={event => setCouponCode(event.target.value)}
                />
                <button className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-content transition hover:bg-primary/90 disabled:opacity-60" onClick={applyCoupon}>
                    Apply
                </button>
            </div>
            {couponApplied && <p className="text-xs text-success">Coupon applied: -{userCurrency?.currencySymbol}{deductable.toFixed(2)}</p>}
            {couponError && <p className="text-xs text-error">{couponError}</p>}
        </div>

        <div className="border-t border-base-300 pt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3 text-base-content/70">
                <span>Subtotal</span>
                <span className="shrink-0">{userCurrency?.currencySymbol} {cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-3 text-base-content/70">
                <span>Delivery</span>
                <span className="shrink-0">Calculated after sign in</span>
            </div>
            {taxRate > 0 && (
                <div className="flex justify-between gap-3 text-base-content/70">
                    <span>Tax ({taxRate}%)</span>
                    <span className="shrink-0">{userCurrency?.currencySymbol} {taxation.toFixed(2)}</span>
                </div>
            )}
            {couponApplied && (
                <div className="flex justify-between gap-3 text-success">
                    <span>Discount</span>
                    <span className="shrink-0">- {userCurrency?.currencySymbol} {deductable.toFixed(2)}</span>
                </div>
            )}
        </div>

        <div className="border-t border-base-300 pt-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <span className="font-bold text-base-content">Total</span>
                <span className="shrink-0 text-xl font-bold text-primary">{userCurrency?.currencySymbol} {totalCost.toFixed(2)}</span>
            </div>
            <button
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-content transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={cart.length === 0}
                onClick={loginToCheckout}
            >
                <HiOutlineLockClosed className="h-4 w-4" />
                Log in to checkout
            </button>
            <p className="mt-3 text-center text-xs text-base-content/50">Delivery address and payment methods unlock after sign in.</p>
        </div>
    </div>
)

const GuestMainSection = ({ userCurrency }: { userCurrency: Currency }) => {
    const [cart, setCart] = useState<CartDataModel[]>([])
    const [cartReady, setCartReady] = useState(false)
    const [couponCode, setCouponCode] = useState('')
    const [deductable, setDeductable] = useState(0)
    const [couponApplied, setCouponApplied] = useState(false)
    const [couponError, setCouponError] = useState('')
    const router = useRouter()

    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem('pending_cart') || '[]')
        setCart(localCartToCartItems(Array.isArray(localCart) ? localCart : []))
        setCartReady(true)
    }, [])

    const syncCart = (newCart: CartDataModel[]) => {
        setCart(newCart)
        localStorage.setItem('pending_cart', JSON.stringify(cartItemsToLocalCart(newCart)))
        window.dispatchEvent(new Event('local-cart-updated'))
    }

    const cartTotal = useMemo(() => (
        Number(cart.reduce((total, item) => total + getCartItemTotal(item, userCurrency?.exchangeRates ?? 1), 0).toFixed(2))
    ), [cart, userCurrency])

    const taxRate = userCurrency?.ISO === 'IN' ? 5 : 0
    const taxation = useMemo(() => Number((cartTotal * (taxRate / 100)).toFixed(2)), [cartTotal, taxRate])
    const totalCost = useMemo(() => Number((cartTotal + taxation - deductable).toFixed(2)), [cartTotal, taxation, deductable])

    const handleQuantityChange = (item: CartDataModel, delta: number) => {
        if (delta > 0 && item.quantity >= 10) {
            onPageNotifications('info', 'Large quantity orders are available through bulk request.')
            return
        }

        const nextCart = delta < 0 && item.quantity <= 1
            ? cart.filter((cartItem) => cartItem._id !== item._id)
            : cart.map((cartItem) => cartItem._id === item._id ? { ...cartItem, quantity: Math.max(1, Math.min(10, cartItem.quantity + delta)) } : cartItem)

        syncCart(nextCart)
    }

    const handleRemove = (item: CartDataModel) => {
        syncCart(cart.filter((cartItem) => cartItem._id !== item._id))
    }

    const applyCoupon = () => {
        if (!couponCode.trim()) return
        validateCoupon(couponCode, cartTotal).then(result => {
            if (result?.couponApplicable) {
                setCouponApplied(true)
                setCouponError('')
                onPageNotifications('success', 'Coupon applied')
                switch (result.couponData.type) {
                    case 2:
                        setDeductable(result.couponData.value * (userCurrency?.exchangeRates ?? 1))
                        break
                    case 1: {
                        const tempDeductable = (cartTotal * (Number(result.couponData.value) / 100)) * (userCurrency?.exchangeRates ?? 1)
                        setDeductable(tempDeductable > Number(result.couponData.maxValue) * (userCurrency?.exchangeRates ?? 1) ? Number(result.couponData.maxValue) : tempDeductable)
                        break
                    }
                }
                return
            }

            setCouponApplied(false)
            setDeductable(0)
            setCouponError('Coupon not applicable')
            onPageNotifications('error', 'Coupon not applicable')
        }).catch(() => {
            setCouponApplied(false)
            setDeductable(0)
            setCouponError('Something went wrong')
            onPageNotifications('error', 'Something went wrong')
        })
    }

    const loginToCheckout = () => router.push('/signin?cb=/cart/checkout')

    return (
        <main className="min-h-screen bg-base-100">
            <div className="container mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
                <div className="mb-4 sm:mb-6">
                    <Link href="/cart" className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-primary transition hover:text-primary/80">
                        <HiArrowLeft className="h-4 w-4" />
                        Back to cart
                    </Link>
                    <h1 className="text-xl font-semibold text-base-content sm:text-2xl">Guest checkout</h1>
                    <p className="mt-1 text-sm text-base-content/60">Review your cart before signing in to choose delivery and payment.</p>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
                    <div className="min-w-0 flex-1 space-y-4 sm:space-y-5">
                        <section className="overflow-hidden rounded-lg border border-primary/10 bg-base-100 shadow-sm">
                            <div className="border-b border-primary/10 bg-primary/5 px-4 py-3 sm:px-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">1</div>
                                    <h2 className="min-w-0 text-base font-semibold text-base-content">Account</h2>
                                </div>
                            </div>
                            <div className="p-3 sm:p-5">
                                <div className="rounded-md border border-primary/10 bg-primary/5 px-4 py-4">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                            <HiOutlineUserCircle className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-base-content">Sign in to continue</p>
                                            <p className="mt-1 text-xs leading-5 text-base-content/60">Your cart stays saved. After sign in, you can select a saved address, shipping, and payment method.</p>
                                        </div>
                                    </div>
                                    <button
                                        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-content transition hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
                                        disabled={cart.length === 0}
                                        onClick={loginToCheckout}
                                    >
                                        <HiOutlineLockClosed className="h-4 w-4" />
                                        Log in to checkout
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-lg border border-primary/10 bg-base-100 shadow-sm">
                            <div className="border-b border-primary/10 bg-primary/5 px-4 py-3 sm:px-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">2</div>
                                        <h2 className="min-w-0 text-base font-semibold text-base-content">Review items</h2>
                                    </div>
                                    <span className="shrink-0 text-xs text-base-content/60 sm:text-sm">{cart.length} item{cart.length === 1 ? '' : 's'}</span>
                                </div>
                            </div>
                            <div className="space-y-3 p-3 sm:p-5">
                                {!cartReady ? (
                                    <InlineProgress label="Loading cart" />
                                ) : cart.length > 0 ? cart.map((item) => (
                                    <CartLineItem
                                        key={item._id}
                                        item={item}
                                        userCurrency={userCurrency}
                                        onQuantityChange={(delta) => handleQuantityChange(item, delta)}
                                        onRemove={() => handleRemove(item)}
                                    />
                                )) : (
                                    <div className="rounded-md border border-primary/10 bg-primary/5 p-6 text-center">
                                        <HiOutlineShoppingBag className="mx-auto h-8 w-8 text-primary" />
                                        <p className="mt-3 font-semibold text-base-content">Your cart is empty</p>
                                        <p className="mt-1 text-sm text-base-content/60">Add products before starting checkout.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className="hidden lg:block lg:w-[380px]">
                        <div className="sticky top-[100px]">
                            <div className="overflow-hidden rounded-lg border border-primary/10 bg-base-100 shadow-sm">
                                <div className="bg-primary px-6 py-5">
                                    <h2 className="text-xl font-bold text-primary-content">Order summary</h2>
                                </div>
                                <div className="p-6">
                                    <SummaryContent
                                        cart={cart}
                                        userCurrency={userCurrency}
                                        cartTotal={cartTotal}
                                        taxRate={taxRate}
                                        taxation={taxation}
                                        totalCost={totalCost}
                                        couponCode={couponCode}
                                        setCouponCode={setCouponCode}
                                        couponApplied={couponApplied}
                                        couponError={couponError}
                                        deductable={deductable}
                                        applyCoupon={applyCoupon}
                                        loginToCheckout={loginToCheckout}
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    <aside className="lg:hidden">
                        <div className="overflow-hidden rounded-lg border border-primary/10 bg-base-100 shadow-sm">
                            <div className="bg-primary px-6 py-4">
                                <h2 className="text-lg font-bold text-primary-content">Order summary</h2>
                            </div>
                            <div className="p-5">
                                <SummaryContent
                                    cart={cart}
                                    userCurrency={userCurrency}
                                    cartTotal={cartTotal}
                                    taxRate={taxRate}
                                    taxation={taxation}
                                    totalCost={totalCost}
                                    couponCode={couponCode}
                                    setCouponCode={setCouponCode}
                                    couponApplied={couponApplied}
                                    couponError={couponError}
                                    deductable={deductable}
                                    applyCoupon={applyCoupon}
                                    loginToCheckout={loginToCheckout}
                                />
                            </div>
                        </div>
                    </aside>
                </div>

                <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        ['Saved cart', 'Guest items remain in this browser until sign in.'],
                        ['Delivery next', 'Choose address and shipping after login.'],
                        ['Secure payment', 'Payment methods unlock after login.'],
                        ['Order review', 'Quantities and discounts update here first.'],
                    ].map(([title, text]) => (
                        <div key={title} className="flex items-center gap-3 rounded-lg border border-primary/10 bg-base-100 p-3">
                            <HiOutlineTruck className="h-5 w-5 shrink-0 text-primary" />
                            <div>
                                <p className="text-xs font-semibold text-base-content">{title}</p>
                                <p className="text-[11px] text-base-content/55">{text}</p>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    )
}

export default GuestMainSection
