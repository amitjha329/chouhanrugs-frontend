// @ts-nocheck
'use client'
import React from 'react'
import Image from 'next/image'
import { BsExclamation, BsTrash } from 'react-icons/bs'
import { stringNotEmptyOrNull } from '@/lib/stringEmptyOrNull'
import CartDataModel from '@/types/CartDataModel'
import IncrementDecrement from './IncrementDecrement'
import { DeleteFromCartLg, DeleteFromCartSm } from './DeleteFromCart'
import Currency from '@/types/Currency'

const CartItemClient = ({ item, userCurrency }: { item: CartDataModel, userCurrency: Currency }) => {

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

    // useEffect(() => {
    //     productSubtotalItem = quantity * item.cartProduct[0].productPrimaryImageIndex
    // }, [quantity])

    return (
        <>
            {item.cartProduct[0] ? (
                <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-6 items-stretch bg-white rounded-xl shadow-sm p-3 sm:p-6 border border-gray-100">
                    {/* Product Image & Name Row */}
                    <div className="flex flex-row items-start gap-3 w-full sm:w-2/5">
                        <a href={`/products/${item.cartProduct[0].productURL}`} className="flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden aspect-square min-h-[72px] max-h-[96px] w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28">
                            <Image
                                height={96}
                                width={96}
                                quality={10}
                                className="object-contain w-full h-full"
                                src={item.cartProduct[0].images[item.cartProduct[0].productPrimaryImageIndex]}
                                alt={item.cartProduct[0].productName || ''}
                            />
                        </a>
                        <div className="flex flex-col flex-1 min-w-0 justify-center">
                            <a href={`/products/${item.cartProduct[0].productURL}`} className="font-bold text-base text-gray-800 hover:underline line-clamp-2 md:line-clamp-3 lg:line-clamp-none" style={{display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', WebkitLineClamp: 3}}>
                                {item.cartProduct[0].productName}
                            </a>
                            <span className="opacity-80 text-xs sm:text-sm truncate">Brand: {item.cartProduct[0].productBrand}</span>
                        </div>
                    </div>
                    {/* Product Info & Controls */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between mt-2 sm:mt-0 sm:pl-2 md:pl-4">
                        <div className="flex flex-wrap gap-2 mt-1 text-xs sm:text-sm md:text-base text-gray-500">
                            {item.variationCode && item.variationCode !== 'customSize' && (
                                <>
                                    {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationSize && (
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm md:text-base">Size: {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationSize}</span>
                                    )}
                                    {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationColor && (
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm md:text-base">Color: {item.cartProduct[0].variations.find(varItem => varItem.variationCode == item.variationCode)?.variationColor}</span>
                                    )}
                                </>
                            )}
                            {item.variationCode === 'customSize' && (
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2'>
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm md:text-base">Custom Size</span>
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm md:text-base">Shape: {item.customSize?.shape}</span>
                                    </div>
                                    {item.customSize?.shape === 'Round' && (
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm md:text-base">Diameter: {item.customSize?.dimensions.diameter?.toFixed(2)}</span>
                                    )}
                                    {(item.customSize?.shape === 'Rectangle' || item.customSize?.shape === 'Runner') && (
                                        <>
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm md:text-base">Length: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm md:text-base">Width: {item.customSize?.dimensions.width?.toFixed(2)}</span>
                                        </>
                                    )}
                                    {item.customSize?.shape === 'Square' && (
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm md:text-base">Size: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Price & Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mt-3">
                            <div className="flex items-center gap-2">
                                {/* Custom increment/decrement UI to match GuestCartItemClient */}
                                <button className="px-2 py-1 text-lg font-bold text-gray-600 bg-gray-100 rounded-l hover:bg-gray-200 transition" onClick={() => IncrementDecrement({item, delta: -1})} aria-label="Decrease quantity">-</button>
                                <span className="px-3 py-1 text-base sm:text-lg md:text-xl font-medium bg-white border border-gray-200 rounded min-w-[2.5rem] text-center">{item.quantity}</span>
                                <button className="px-2 py-1 text-lg font-bold text-gray-600 bg-gray-100 rounded-r hover:bg-gray-200 transition" onClick={() => IncrementDecrement({item, delta: 1})} aria-label="Increase quantity">+</button>
                            </div>
                            <div className="flex flex-row gap-3 items-center justify-between w-full sm:w-auto">
                                <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-700">{userCurrency?.currencySymbol} {calculateProductPrice().toFixed(2)}</span>
                                <button className="ml-2 px-3 py-1 text-xs sm:text-sm md:text-base rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition" onClick={() => DeleteFromCartLg({item})} title="Remove">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between hover:bg-gray-100 mb-2 ">
                    <div className="flex">
                        {" "}
                        {/* product */}
                        <div className="w-fit">
                            <BsExclamation
                                height={96}
                                width={96}
                                className="sm:h-24 sm:w-24 object-scale-down w-20 h-20"
                            />
                        </div>
                        <div className="flex flex-col justify-start ml-4 flex-grow">
                            <span className="font-bold text-sm max-sm:text-xs max-w-[250px]">Product no Longer Available</span>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row items-center gap-3 justify-center">
                        <svg
                            className="fill-current text-gray-600 w-3 cursor-pointer"
                            viewBox="0 0 448 512"
                            // onClick={_ => { }}
                        >
                            <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                        </svg>
                        <input
                            className="mx-2 input input-sm input-bordered border text-center w-16"
                            type="text"
                            value={item.quantity}
                            readOnly
                        />
                        <svg
                            className="fill-current text-gray-600 w-3 cursor-pointer"
                            viewBox="0 0 448 512"
                            // onClick={_ => { }}
                        >
                            <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                        </svg>
                    </div>
                    <DeleteFromCartSm item={item} />
                </div>
            )}
            <div className='divider'></div>
        </>
    )
}

export default CartItemClient