import React from 'react'
import Link from 'next/link'
import { auth } from '@/auth'
import getUserCartitems from '@/backend/serverActions/getUserCartitems'
import CartItem from '@/ui/Cart/CartItem'
import CartTotalSection from '@/ui/Cart/CartTotalSection'
import dynamic from 'next/dynamic'
import { HiArrowLeft, HiOutlineShoppingBag, HiOutlineShieldCheck, HiOutlineTruck } from 'react-icons/hi2'

const CartLocalStorage = dynamic(() => import('@/ui/Cart/CartLocalStorage'))

const CartPage = async () => {
    const session = await auth()
    const cart = await getUserCartitems((session?.user as { id: string })?.id)
    const isLoggedIn = !!session?.user
    
    return isLoggedIn ? (
        <div className="min-h-screen bg-gradient-to-b from-base-200/50 to-base-100">
            <div className="container max-w-6xl py-6 sm:py-10 px-4 mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors mb-2">
                            <HiArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-3">
                            <HiOutlineShoppingBag className="w-8 h-8 text-primary" />
                            Shopping Cart
                        </h1>
                    </div>
                    {cart && cart.length > 0 && (
                        <div className="badge badge-primary badge-lg gap-2">
                            {cart.length} {cart.length === 1 ? 'item' : 'items'}
                        </div>
                    )}
                </div>

                {cart && cart.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <CartItem item={item} key={item?._id} />
                            ))}
                        </div>

                        {/* Cart Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <CartTotalSection cartItems={cart} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <HiOutlineShoppingBag className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="font-bold text-xl sm:text-2xl text-base-content mb-2 text-center">
                            Your cart is empty
                        </h2>
                        <p className="text-base-content/60 mb-6 text-center max-w-md">
                            Looks like you haven&apos;t added anything yet. Start exploring our collection!
                        </p>
                        <Link href="/">
                            <button className="btn btn-primary gap-2">
                                <HiArrowLeft className="w-4 h-4" />
                                Start Shopping
                            </button>
                        </Link>
                    </div>
                )}

                {/* Trust Badges */}
                {cart && cart.length > 0 && (
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-base-100 rounded-xl border border-base-300/50">
                            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <HiOutlineShieldCheck className="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-base-content">Secure Checkout</p>
                                <p className="text-xs text-base-content/60">SSL Encrypted</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-base-100 rounded-xl border border-base-300/50">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <HiOutlineTruck className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-base-content">Free Shipping</p>
                                <p className="text-xs text-base-content/60">On orders $100+</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-base-100 rounded-xl border border-base-300/50">
                            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-base-content">Easy Returns</p>
                                <p className="text-xs text-base-content/60">30-day policy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-base-100 rounded-xl border border-base-300/50">
                            <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-base-content">24/7 Support</p>
                                <p className="text-xs text-base-content/60">Dedicated help</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : <CartLocalStorage />
}

export default CartPage