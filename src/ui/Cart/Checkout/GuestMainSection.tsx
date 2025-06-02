// @ts-nocheck
'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import CartDataModel from '@/types/CartDataModel'
import Currency from '@/types/Currency'
import GuestCartItemClient from './GuestCartItemClient'
import validateCoupon from '@/backend/serverActions/validateCoupon'
import onPageNotifications from '@/utils/onPageNotifications'

const GuestMainSection = ({ userCurrency }: { userCurrency: Currency }) => {
    const [cart, setCart] = useState<CartDataModel[]>([])
    const router = useRouter()

    // Load cart from localStorage (pending_cart)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const localCart = JSON.parse(localStorage.getItem('pending_cart') || '[]')
            setCart(localCart.map((item: any) => ({
                _id: item.productId,
                quantity: item.quantity,
                cartProduct: [item.productData],
                variationCode: item.variation || '',
                customSize: item.customSize || null
            })))
        }
    }, [])

    // Update localStorage and state
    const syncCart = (newCart: any[]) => {
        setCart(newCart)
        localStorage.setItem('pending_cart', JSON.stringify(newCart.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            productData: item.cartProduct[0],
            variation: item.variationCode,
            customSize: item.customSize
        }))))
    }

    // Calculate price for each item (mimic logic from MainSection)
    const calculateProductPrice = useCallback((item: CartDataModel): number => {
        var priceInitial = 0
        if (item.variationCode && item.variationCode !== 'customSize') {
            const variationindex = item.cartProduct[0].variations.findIndex(ff => ff.variationCode == item.variationCode)
            const variationPrice = Number(item.cartProduct[0].variations[variationindex]?.variationPrice ?? 0)
            const variationDiscount = Number(item.cartProduct[0].variations[variationindex]?.variationDiscount ?? 0)
            priceInitial = variationPrice - (variationPrice * (variationDiscount / 100))
        } else if (item.variationCode === 'customSize') {
            switch (item.customSize?.shape) {
                case 'Rectangle':
                case 'Runner':
                case 'Square':
                    priceInitial = item.cartProduct[0].productPriceSqFt * (item.customSize?.dimensions.length ?? 1) * (item.customSize?.dimensions.width ?? 1)
                    break
                case 'Round':
                    priceInitial = item.cartProduct[0].productPriceSqFt * (Math.pow((item.customSize?.dimensions.diameter ?? 1) / 2, 2) * Math.PI)
                    break
            }
        } else {
            priceInitial = item.cartProduct[0]?.productSellingPrice ?? 0
        }
        return priceInitial * item.quantity
    }, [])

    const cartWithPrices = cart.map((item, idx) => {
        const pricePerQty = calculateProductPrice({ ...item, quantity: 1 })
        const totalPrice = calculateProductPrice(item)
        return { ...item, pricePerQty: pricePerQty.toFixed(2), totalPrice: totalPrice.toFixed(2) }
    })

    const cartTotal = useMemo(() => {
        let subTotal = 0
        cart.forEach(item => {
            subTotal += calculateProductPrice(item)
        })
        return Number((subTotal * (userCurrency?.exchangeRates ?? 1)).toFixed(2))
    }, [cart, userCurrency, calculateProductPrice])

    // Taxation logic (mimic MainSection)
    const taxRate = userCurrency?.ISO === 'IN' ? 5 : 0;
    const taxation = useMemo(() => Number((cartTotal * (taxRate / 100)).toFixed(2)), [cartTotal, taxRate]);
    const delivery = 'Free';

    // Coupon logic mimicking MainSection (local only)
    const [couponCode, setCouponCode] = useState("");
    const [deductable, setDeductable] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [debouncedCoupon, setDebouncedCoupon] = useState("");
    const [couponData, setCouponData] = useState();

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedCoupon(couponCode), 400);
        return () => clearTimeout(handler);
    }, [couponCode]);

    // Only validate coupon when debouncedCoupon changes
    useEffect(() => {
        if (!debouncedCoupon) return;
        validateCoupon(debouncedCoupon, cartTotal).then(result => {
            setCouponData(result)
            if (result?.couponApplicable) {
                setCouponApplied(true);
                setCouponError("");
                onPageNotifications("success", "Coupon Applied");
                switch (result.couponData.type) {
                    case 2:
                        setDeductable(result.couponData.value * (userCurrency?.exchangeRates ?? 1));
                        break;
                    case 1:
                        const tempDeductable = (cartTotal * (Number(result.couponData.value) / 100)) * (userCurrency?.exchangeRates ?? 1);
                        setDeductable(tempDeductable > Number(result.couponData.maxValue) * (userCurrency?.exchangeRates ?? 1) ? Number(result.couponData.maxValue) : tempDeductable);
                        break;
                }
            } else {
                setCouponApplied(false);
                setDeductable(0);
                setCouponError("Copon Not Apllicable");
                onPageNotifications("error", "Copon Not Apllicable");
            }
        }).catch(err => {
            setCouponApplied(false);
            setDeductable(0);
            setCouponError("Something Went Wrong");
            onPageNotifications("error", "Something Went Wrong");
        })
    }, [debouncedCoupon, cartTotal, userCurrency]);

    // Reset coupon on currency change
    useEffect(() => { setDeductable(0); setCouponCode(""); setCouponApplied(false); setCouponError(""); }, [userCurrency]);

    const totalCost = useMemo(() => Number((cartTotal + taxation - deductable).toFixed(2)), [cartTotal, taxation, deductable]);

    // Handlers for quantity and remove
    const handleQuantityChange = (idx: number, delta: number) => {
        setCart(prev => {
            const newCart = prev.map((item, i) => {
                if (i === idx) {
                    const newQty = item.quantity + delta
                    return { ...item, quantity: newQty > 1 ? newQty : 1 }
                }
                return item
            })
            syncCart(newCart)
            return newCart
        })
    }
    const handleRemove = (idx: number) => {
        setCart(prev => {
            const newCart = prev.filter((_, i) => i !== idx)
            syncCart(newCart)
            return newCart
        })
    }

    return (
        <div className="container py-0 sm:py-10 mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Cart Items Section */}
                <div className="flex flex-col w-full md:w-2/3 px-4 sm:px-8 md:px-0 md:pl-5">
                    <div className="text-lg font-bold w-full border-b pb-3 mb-10 mt-8 sm:mt-0">Your Cart</div>
                    {cartWithPrices && cartWithPrices.length > 0 ? (
                        cartWithPrices.map((item, idx) => (
                            <GuestCartItemClient
                                key={item._id + '-' + idx}
                                item={item}
                                userCurrency={userCurrency}
                                onQuantityChange={delta => handleQuantityChange(idx, delta)}
                                onRemove={() => handleRemove(idx)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-64 sm:h-80 bg-base-100 rounded-lg shadow-inner my-8 px-4 sm:px-0">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-primary mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
                            </svg>
                            <h2 className="font-bold text-lg sm:text-2xl text-gray-700 mb-2 text-center">Your cart is empty</h2>
                            <p className="text-gray-500 mb-4 text-center text-sm sm:text-base">Looks like you haven&apos;t added anything yet.</p>
                        </div>
                    )}
                </div>
                {/* Order Summary Section - Desktop */}
                <div className="hidden md:block w-full md:w-1/3 px-0 md:px-10 py-10 sticky bottom-0 top-[170px]">
                    <div id="summary" className="flex flex-col justify-between bg-gray-200 px-8 pt-10 pb-16 sm:pb-10 rounded-xl">
                        <h1 className="font-semibold text-2xl border-b border-black pb-8">Order Summary</h1>
                        <div className="flex justify-between mt-10 mb-5">
                            <span className="font-semibold text-sm uppercase">Items {cart.length}</span>
                            <span className="font-semibold text-sm">{userCurrency?.currencySymbol} {cartTotal}</span>
                        </div>
                        <div className="border-t border-black mt-8">
                            <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                <span>Sub Total</span>
                                <span>{userCurrency?.currencySymbol} {cartTotal}</span>
                            </div>
                            <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                <span>Delivery</span>
                                <span>{delivery}</span>
                            </div>
                            <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                <span>Taxation</span>
                                <span>{userCurrency?.currencySymbol} {taxation}</span>
                            </div>
                            {/* Coupon section */}
                            <div className="py-3">
                                <label htmlFor="guest-coupon" className="font-semibold inline-block mb-2 text-sm uppercase">Promo Code</label>
                                <div className="join w-full">
                                    <input
                                        type="text"
                                        id="guest-coupon"
                                        placeholder="Enter your code"
                                        className={clsx("input input-bordered w-full join-item", { "border-success": couponApplied }, { "border-error": couponError })}
                                        value={couponCode}
                                        onChange={e => setCouponCode(e.target.value)}
                                    />
                                    <button className="btn btn-active join-item" onClick={() => setCouponCode(couponCode)}>
                                        Apply
                                    </button>
                                </div>
                                {couponApplied && (
                                    <div className="text-success text-xs mt-1">Coupon Applied: {couponCode.trim().toUpperCase()} (-{userCurrency?.currencySymbol}{deductable.toFixed(2)})</div>
                                )}
                                {couponError && (
                                    <div className="text-error text-xs mt-1">{couponError}</div>
                                )}
                            </div>
                            {couponApplied && (
                                <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                    <span>Coupon Applied</span>
                                    <span>-{userCurrency?.currencySymbol}{deductable.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                <span>Total cost</span>
                                <span>{userCurrency?.currencySymbol} {totalCost}</span>
                            </div>
                        </div>
                        <div className="my-8 flex flex-col items-center">
                            <p className="text-center text-gray-700 mb-4">To proceed to checkout, please log in or create an account.</p>
                            <button className="btn btn-primary w-full" onClick={() => router.push('/signin?cb=/cart/checkout')}>Log in to Checkout</button>
                        </div>
                    </div>
                </div>
                {/* Order Summary Section - Mobile */}
                <div className="block md:hidden w-full px-0 sm:px-10 py-10">
                    <div id="summary" className="flex flex-col justify-between bg-gray-200 px-4 sm:px-8 pt-10 pb-16 sm:pb-10 rounded-xl">
                        <h1 className="font-semibold text-2xl border-b border-black pb-8">Order Summary</h1>
                        <div className="flex justify-between mt-10 mb-5">
                            <span className="font-semibold text-sm uppercase">Items {cart.length}</span>
                            <span className="font-semibold text-sm">{userCurrency?.currencySymbol} {cartTotal}</span>
                        </div>
                        <div className="border-t border-black mt-8">
                            <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                <span>Sub Total</span>
                                <span>{userCurrency?.currencySymbol} {cartTotal}</span>
                            </div>
                            <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                <span>Delivery</span>
                                <span>{delivery}</span>
                            </div>
                            <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                <span>Taxation</span>
                                <span>{userCurrency?.currencySymbol} {taxation}</span>
                            </div>
                            {/* Coupon section */}
                            <div className="py-3">
                                <label htmlFor="guest-coupon-mobile" className="font-semibold inline-block mb-2 text-sm uppercase">Promo Code</label>
                                <div className="join w-full">
                                    <input
                                        type="text"
                                        id="guest-coupon-mobile"
                                        placeholder="Enter your code"
                                        className={clsx("input input-bordered w-full join-item", { "border-success": couponApplied }, { "border-error": couponError })}
                                        value={couponCode}
                                        onChange={e => setCouponCode(e.target.value)}
                                    />
                                    <button className="btn btn-active join-item" onClick={() => setCouponCode(couponCode)}>
                                        Apply
                                    </button>
                                </div>
                                {couponApplied && (
                                    <div className="text-success text-xs mt-1">Coupon Applied: {couponCode.trim().toUpperCase()} (-{userCurrency?.currencySymbol}{deductable.toFixed(2)})</div>
                                )}
                                {couponError && (
                                    <div className="text-error text-xs mt-1">{couponError}</div>
                                )}
                            </div>
                            {couponApplied && (
                                <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                    <span>Coupon Applied</span>
                                    <span>-{userCurrency?.currencySymbol}{deductable.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex font-semibold justify-between py-3 text-sm uppercase">
                                <span>Total cost</span>
                                <span>{userCurrency?.currencySymbol} {totalCost}</span>
                            </div>
                        </div>
                        <div className="my-8 flex flex-col items-center">
                            <p className="text-center text-gray-700 mb-4">To proceed to checkout, please log in or create an account.</p>
                            <button className="btn btn-primary w-full" onClick={() => router.push('/signin?cb=/cart/checkout')}>Log in to Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuestMainSection
