import React from 'react'
import { stringNotEmptyOrNull } from '@/lib/stringEmptyOrNull'
import CartDataModel from '@/types/CartDataModel'
import GoToCheckoutBtn from './GoToCheckoutBtn'
import { HiOutlineReceiptPercent, HiOutlineShieldCheck } from 'react-icons/hi2'

const CartTotalSection = ({ cartItems }: { cartItems: CartDataModel[] }) => {
    const userCurrency = null

    const calculateProductPrice = (item: CartDataModel): number => {
        var priceInitial = 0
        if (stringNotEmptyOrNull(item.variationCode) && item.variationCode != "customSize") {
            const variationindex = item.cartProduct[0].variations.findIndex(ff => ff.variationCode == item.variationCode!);
            const variationPrice = Number(item.cartProduct[0].variations[variationindex].variationPrice);
            const variationDiscount = Number(item.cartProduct[0].variations.find(variation => variation.variationCode === item.variationCode)?.variationDiscount ?? 0);
            priceInitial = variationPrice - (variationPrice * (variationDiscount / 100));
        } else if (item.variationCode == "customSize") {
            switch (item.customSize?.shape) {
                case "Rectangle":
                case "Runner":
                case "Square":
                    priceInitial = item.cartProduct[0].productPriceSqFt * (item.customSize?.dimensions.length ?? 1) * (item.customSize?.dimensions.width ?? 1);
                    break;
                case "Round":
                    priceInitial = item.cartProduct[0].productPriceSqFt * (Math.pow((item.customSize?.dimensions.diameter ?? 1) / 2, 2) * Math.PI);
                    break;
            }
        } else {
            priceInitial = item.cartProduct[0]?.productSellingPrice ?? 0;
        }

        return priceInitial * item.quantity
    }

    let subTotal = 0
    cartItems.forEach((item: CartDataModel) => {
        subTotal = subTotal + calculateProductPrice(item)
    })
    let cartTotal = subTotal

    return (
        <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-4 border-b border-base-300/50">
                <h2 className="font-semibold text-lg text-base-content flex items-center gap-2">
                    <HiOutlineReceiptPercent className="w-5 h-5 text-primary" />
                    Order Summary
                </h2>
            </div>

            {/* Summary Details */}
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-base-content/70">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium text-base-content">$ {subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-base-content/70">
                    <span>Shipping</span>
                    <span className="text-success font-medium">Calculated at checkout</span>
                </div>
                
                <div className="border-t border-base-300/50 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-base-content">Estimated Total</span>
                        <span className="text-xl font-bold text-primary">$ {cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                <GoToCheckoutBtn isDisabled={cartItems && cartItems.length == 0} />

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-4 text-xs text-base-content/60">
                    <HiOutlineShieldCheck className="w-4 h-4 text-success" />
                    <span>Secure checkout with SSL encryption</span>
                </div>
            </div>
        </div>
    )
}

export default CartTotalSection