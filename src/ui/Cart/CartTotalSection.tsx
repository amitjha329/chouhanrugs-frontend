'use client'

import React from 'react'
import CartDataModel from '@/types/CartDataModel'
import GoToCheckoutBtn from './GoToCheckoutBtn'
import { HiOutlineReceiptPercent, HiOutlineShieldCheck } from 'react-icons/hi2'
import { useTranslations } from 'next-intl'
import Currency from '@/types/Currency'
import { getCartItemTotal } from './cartPricing'

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

const CartTotalSection = ({ cartItems, userCurrency = defaultCurrency }: { cartItems: CartDataModel[], userCurrency?: Currency }) => {
    const t = useTranslations('cart')

    let subTotal = 0
    cartItems.forEach((item: CartDataModel) => {
        subTotal = subTotal + getCartItemTotal(item, userCurrency.exchangeRates ?? 1)
    })
    let cartTotal = subTotal

    return (
        <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-4 border-b border-base-300/50">
                <h2 className="font-semibold text-lg text-base-content flex items-center gap-2">
                    <HiOutlineReceiptPercent className="w-5 h-5 text-primary" />
                    {t('orderSummary')}
                </h2>
            </div>

            {/* Summary Details */}
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-base-content/70">
                    <span>{t('subtotalItems', { count: cartItems.length })}</span>
                    <span className="font-medium text-base-content">{userCurrency.currencySymbol} {subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-base-content/70">
                    <span>{t('shipping')}</span>
                    <span className="text-success font-medium">{t('calculatedAtCheckout')}</span>
                </div>
                
                <div className="border-t border-base-300/50 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-base-content">{t('estimatedTotal')}</span>
                        <span className="text-xl font-bold text-primary">{userCurrency.currencySymbol} {cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                <GoToCheckoutBtn isDisabled={cartItems && cartItems.length == 0} />

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-4 text-xs text-base-content/60">
                    <HiOutlineShieldCheck className="w-4 h-4 text-success" />
                    <span>{t('secureCheckoutSSL')}</span>
                </div>
            </div>
        </div>
    )
}

export default CartTotalSection
