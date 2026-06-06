// @ts-nocheck
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import CartDataModel from '@/types/CartDataModel'
import Currency from '@/types/Currency'
import validateCoupon from '@/backend/serverActions/validateCoupon'
import onPageNotifications from '@/utils/onPageNotifications'
import CartLineItem from '../CartLineItem'
import { getCartItemTotal } from '../cartPricing'
import { HiArrowLeft, HiOutlineLockClosed, HiOutlineShoppingBag } from 'react-icons/hi2'
import Link from 'next/link'

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

const GuestMainSection = ({ userCurrency }: { userCurrency: Currency }) => {
    const [cart, setCart] = useState<CartDataModel[]>([])
    const [couponCode, setCouponCode] = useState('')
    const [deductable, setDeductable] = useState(0)
    const [couponApplied, setCouponApplied] = useState(false)
    const [couponError, setCouponError] = useState('')
    const router = useRouter()

    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem('pending_cart') || '[]')
        setCart(localCartToCartItems(Array.isArray(localCart) ? localCart : []))
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

    return (
        <main className="min-h-screen bg-[#fbfaf7]">
            <div className="fluid_container mx-auto px-4 py-5 md:px-0 md:py-8">
                <div className="mb-5">
                    <Link href="/cart" className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-primary">
                        <HiArrowLeft className="h-4 w-4" />
                        Back to cart
                    </Link>
                    <h1 className="flex items-center gap-2 text-2xl font-semibold text-base-content md:text-3xl">
                        <HiOutlineShoppingBag className="h-7 w-7 text-primary" />
                        Guest checkout
                    </h1>
                    <p className="mt-1 text-sm text-base-content/60">Review your cart, then sign in to choose delivery and payment.</p>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <section className="space-y-3">
                        {cart.length > 0 ? cart.map((item) => (
                            <CartLineItem
                                key={item._id}
                                item={item}
                                userCurrency={userCurrency}
                                onQuantityChange={(delta) => handleQuantityChange(item, delta)}
                                onRemove={() => handleRemove(item)}
                            />
                        )) : (
                            <div className="rounded-lg border border-primary/10 bg-base-100 p-10 text-center">
                                <p className="font-semibold text-base-content">Your cart is empty</p>
                                <p className="mt-1 text-sm text-base-content/60">Add products before starting checkout.</p>
                            </div>
                        )}
                    </section>

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="overflow-hidden rounded-lg border border-primary/10 bg-base-100 shadow-sm">
                            <div className="border-b border-base-200 bg-primary px-5 py-4 text-primary-content">
                                <h2 className="text-lg font-semibold">Order summary</h2>
                                <p className="text-xs text-primary-content/75">{cart.length} item{cart.length === 1 ? '' : 's'} in cart</p>
                            </div>
                            <div className="space-y-4 p-5">
                                <div className="flex justify-between text-sm text-base-content/70">
                                    <span>Subtotal</span>
                                    <span>{userCurrency?.currencySymbol} {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-base-content/70">
                                    <span>Delivery</span>
                                    <span className="text-success">Free</span>
                                </div>
                                {taxRate > 0 && (
                                    <div className="flex justify-between text-sm text-base-content/70">
                                        <span>Tax ({taxRate}%)</span>
                                        <span>{userCurrency?.currencySymbol} {taxation.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label htmlFor="guest-coupon" className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Promo code</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="guest-coupon"
                                            placeholder="Enter code"
                                            className={clsx('input input-bordered input-sm flex-1 bg-base-200/50', couponApplied && 'border-success', couponError && 'border-error')}
                                            value={couponCode}
                                            onChange={event => setCouponCode(event.target.value)}
                                        />
                                        <button className="btn btn-primary btn-sm" onClick={applyCoupon}>Apply</button>
                                    </div>
                                    {couponApplied && <p className="text-xs text-success">Coupon applied: -{userCurrency?.currencySymbol}{deductable.toFixed(2)}</p>}
                                    {couponError && <p className="text-xs text-error">{couponError}</p>}
                                </div>
                                <div className="border-t border-base-200 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-base-content">Total</span>
                                        <span className="text-2xl font-bold text-primary">{userCurrency?.currencySymbol} {totalCost.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary w-full gap-2"
                                    disabled={cart.length === 0}
                                    onClick={() => router.push('/signin?cb=/cart/checkout')}
                                >
                                    <HiOutlineLockClosed className="h-4 w-4" />
                                    Log in to checkout
                                </button>
                                <p className="text-center text-xs text-base-content/50">Delivery address and payment methods unlock after sign in.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}

export default GuestMainSection
