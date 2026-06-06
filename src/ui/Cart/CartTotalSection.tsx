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
        <div className="overflow-hidden rounded-lg border border-primary/10 bg-base-100">
            {/* Header */}
            <div className="border-b border-primary/10 bg-primary/5 px-4 py-3 sm:px-5">
                <h2 className="flex items-center gap-2 text-base font-semibold text-base-content">
                    <HiOutlineReceiptPercent className="h-5 w-5 text-primary" />
                    {t('orderSummary')}
                </h2>
            </div>

            {/* Summary Details */}
            <div className="space-y-4 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 text-sm text-base-content/70">
                    <span>{t('subtotalItems', { count: cartItems.length })}</span>
                    <span className="shrink-0 font-medium text-base-content">{userCurrency.currencySymbol} {subTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm text-base-content/70">
                    <span>{t('shipping')}</span>
                    <span className="shrink-0 text-right font-medium text-success">{t('calculatedAtCheckout')}</span>
                </div>
                
                <div className="mt-4 border-t border-primary/10 pt-4">
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-base-content">{t('estimatedTotal')}</span>
                        <span className="shrink-0 text-xl font-bold text-primary">{userCurrency.currencySymbol} {cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                <GoToCheckoutBtn isDisabled={cartItems && cartItems.length == 0} />

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-4 text-center text-xs text-base-content/60">
                    <HiOutlineShieldCheck className="h-4 w-4 shrink-0 text-success" />
                    <span>{t('secureCheckoutSSL')}</span>
                </div>
            </div>
        </div>
    )
}

export default CartTotalSection
