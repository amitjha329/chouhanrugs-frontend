'use client'
import React, { useEffect, useState } from 'react'
import { useCurrencyContext } from '../Contexts/CurrencyContext'
import { useRouter } from 'next/navigation'
import CartDataModel from '@/lib/types/CartDataModel'
import { stringNotEmptyOrNull } from '@/lib/utilities/stringEmptyOrNull'

const CartTotalSection = ({ cartItems }: { cartItems: CartDataModel[] }) => {
    const { userCurrency } = useCurrencyContext()
    const router = useRouter()
    const [cartTotal, setCartTotal] = useState(0)

    const calculateProductPrice = (item: CartDataModel): number => {
        var priceInitial = 0
        if (stringNotEmptyOrNull(item.variationCode)&& item.variationCode != "customSize") {
            const variationindex = item.cartProduct[0].variations.findIndex(ff => ff.variationCode == item.variationCode!)
            priceInitial = (Number(item.cartProduct[0].variations[variationindex].variationPrice) - Number(item.cartProduct[0].variations.find(variation => variation.variationCode === item.variationCode)?.variationPrice) * (Number(item.cartProduct[0].variations.find(variation => variation.variationCode === item.variationCode)?.variationDiscount ?? 0) / 100)) >> 0
        } else if (item.variationCode == "customSize") {
            switch (item.customSize?.shape) {
                case "Rectangle":
                case "Runner":
                case "Square":
                    priceInitial = item.cartProduct[0].productPriceSqFt * (item.customSize?.dimensions.length ?? 1) * (item.customSize?.dimensions.width ?? 1)
                    break;
                case "Round":
                    priceInitial = item.cartProduct[0].productPriceSqFt * (Math.pow((item.customSize?.dimensions.diameter ?? 1) / 2, 2) * Math.PI)
                    break;
            }
        } else {
            priceInitial = item.cartProduct[0].productSellingPrice
        }

        return priceInitial * item.quantity
    }

    useEffect(() => {
        let subTotal = 0
        cartItems.forEach((item: CartDataModel) => {
            subTotal = subTotal + calculateProductPrice(item)
        })
        setCartTotal(subTotal)
    }, [cartItems])

    return (
        <div className="flex flex-col border-t pt-8 items-end w-full">
            <div className="flex flex-row ml-auto items-center justify-between w-full sm:w-1/2 lg:w-1/4 border-b pb-8">
                <span className="text-xl font-thin">Subtotal:</span>
                <span className="text-xl font-semibold">{userCurrency?.currencySymbol} {(cartTotal * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}</span>
            </div>
            <button className="w-full sm:w-1/2 lg:w-1/4 btn btn-primary mt-4" onClick={e => router.push('/cart/checkout')} disabled={cartItems && cartItems.length == 0}>Proceed To Checkout</button>
        </div>
    )
}

export default CartTotalSection