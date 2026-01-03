// @ts-nocheck
import React from 'react'
import Image from 'next/image'
import { BsExclamation } from 'react-icons/bs'
import { stringNotEmptyOrNull } from '@/lib/stringEmptyOrNull'
import CartDataModel from '@/types/CartDataModel'
import IncrementDecrement from './IncrementDecrement'
import { DeleteFromCartLg, DeleteFromCartSm } from './DeleteFromCart'

const CartItem = ({ item }: { item: CartDataModel, }) => {
    const userCurrency = null

    const calculateProductPrice = (): number => {
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
        return priceInitial * (userCurrency?.exchangeRates ?? 1) * item.quantity
    }

    return (
        <>
            {item.cartProduct[0] ? (
                <div className="group flex flex-col sm:flex-row gap-4 p-4 bg-base-100 rounded-xl border border-base-300/50 hover:border-primary/30 hover:shadow-md transition-all duration-200">
                    {/* Product Image */}
                    <a 
                        href={`/products/${item.cartProduct[0].productURL}`} 
                        className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-base-200 rounded-lg overflow-hidden"
                    >
                        <Image
                            height={112}
                            width={112}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            src={item.cartProduct[0].images[item.cartProduct[0].productPrimaryImageIndex]}
                            alt={item.cartProduct[0].productName}
                        />
                    </a>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <a 
                                href={`/products/${item.cartProduct[0].productURL}`} 
                                className="font-semibold text-base-content hover:text-primary transition-colors line-clamp-2"
                            >
                                {item.cartProduct[0].productName}
                            </a>
                            <p className="text-sm text-base-content/60 mt-1">
                                Brand: {item.cartProduct[0].productBrand}
                            </p>

                            {/* Variation Details */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {item.variationCode && item.variationCode !== "customSize" && (
                                    <>
                                        {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationSize && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                Size: {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationSize}
                                            </span>
                                        )}
                                        {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationColor && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                                                Color: {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationColor}
                                            </span>
                                        )}
                                    </>
                                )}
                                {item.variationCode === "customSize" && (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                            Custom Size
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-base-200 text-base-content/70">
                                            Shape: {item.customSize?.shape}
                                        </span>
                                        {item.customSize?.shape === "Round" && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-base-200 text-base-content/70">
                                                Ø {item.customSize?.dimensions.diameter?.toFixed(2)}
                                            </span>
                                        )}
                                        {(item.customSize?.shape === "Rectangle" || item.customSize?.shape === "Runner") && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-base-200 text-base-content/70">
                                                {item.customSize?.dimensions.length?.toFixed(2)} × {item.customSize?.dimensions.width?.toFixed(2)}
                                            </span>
                                        )}
                                        {item.customSize?.shape === "Square" && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-base-200 text-base-content/70">
                                                {item.customSize?.dimensions.length?.toFixed(2)} × {item.customSize?.dimensions.length?.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price, Quantity & Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-base-300/50">
                            <div className="flex items-center gap-4">
                                <IncrementDecrement item={item} />
                                <DeleteFromCartSm item={item} />
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-base-content">
                                    {userCurrency?.currencySymbol} {calculateProductPrice().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4 p-4 bg-error/5 border border-error/20 rounded-xl">
                    <div className="w-16 h-16 bg-error/10 rounded-lg flex items-center justify-center">
                        <BsExclamation className="w-8 h-8 text-error" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-error">Product No Longer Available</p>
                        <p className="text-sm text-base-content/60">This item has been removed from your cart</p>
                    </div>
                    <DeleteFromCartSm item={item} />
                </div>
            )}
        </>
    )
}

export default CartItem