// @ts-nocheck
'use client'
import React from 'react'
import Currency from '@/types/Currency'

const GuestCartItemClient = ({ item, userCurrency, onQuantityChange, onRemove }: {
    item: any,
    userCurrency: Currency,
    onQuantityChange: (delta: number) => void,
    onRemove: () => void
}) => {
    // Helper to get variation details
    const getVariation = () => {
        if (!item.variationCode || item.variationCode === 'customSize') return null
        return item.cartProduct[0].variations.find((v: any) => v.variationCode === item.variationCode)
    }
    const variation = getVariation()
    return (
        <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-6 items-stretch bg-white rounded-xl shadow-sm p-3 sm:p-6 border border-gray-100">
            {/* Product Image & Name Row */}
            <div className="flex flex-row items-start gap-3 w-full sm:w-2/5">
                <a href={`/products/${item.cartProduct[0].productURL}`} className="flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden aspect-square min-h-[72px] max-h-[96px] w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28">
                    <img
                        height={96}
                        width={96}
                        className="object-contain w-full h-full"
                        src={item.cartProduct[0].images?.[item.cartProduct[0].productPrimaryImageIndex] || '/vector/Cart.svg'}
                        alt={item.cartProduct[0].productName || 'Product'}
                    />
                </a>
                <div className="flex flex-col flex-1 justify-center">
                    <a href={`/products/${item.cartProduct[0].productURL}`} className="font-bold text-base text-gray-800 hover:underline line-clamp-2 md:line-clamp-3 lg:line-clamp-none" style={{display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', WebkitLineClamp: 3}}>
                        {item.cartProduct[0].productName}
                    </a>
                    <span className="opacity-80 text-xs sm:text-sm truncate">Brand: {item.cartProduct[0].productBrand}</span>
                </div>
            </div>
            {/* Product Info & Controls */}
            <div className="flex flex-col flex-1 min-w-0 justify-between mt-2 sm:mt-0 sm:pl-2 md:pl-4">
                <div className="flex flex-wrap gap-2 mt-1 text-xs sm:text-sm md:text-base text-gray-500">
                    {variation && <>
                        {variation.variationSize && <span className="bg-gray-100 px-2 py-1 rounded">Size: {variation.variationSize}</span>}
                        {variation.variationColor && <span className="bg-gray-100 px-2 py-1 rounded">Color: {variation.variationColor}</span>}
                    </>}
                    {item.variationCode === 'customSize' && <div className='flex flex-col gap-1'>
                        <div className='flex gap-2'>
                            <span className="bg-gray-100 px-2 py-1 rounded">Custom Size</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Shape: {item.customSize?.shape}</span>
                        </div>
                        {item.customSize?.shape === 'Round' && <span className="bg-gray-100 px-2 py-1 rounded">Diameter: {item.customSize?.dimensions.diameter?.toFixed(2)}</span>}
                        {(item.customSize?.shape === 'Rectangle' || item.customSize?.shape === 'Runner') && <>
                            <span className="bg-gray-100 px-2 py-1 rounded">Length: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Width: {item.customSize?.dimensions.width?.toFixed(2)}</span>
                        </>}
                        {item.customSize?.shape === 'Square' && <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.customSize?.dimensions.length?.toFixed(2)}</span>}
                    </div>}
                </div>
                {/* Price & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mt-3">
                    <div className="flex items-center gap-2">
                        <button className="px-2 py-1 text-lg font-bold text-gray-600 bg-gray-100 rounded-l hover:bg-gray-200 transition" onClick={() => onQuantityChange(-1)} aria-label="Decrease quantity">-</button>
                        <span className="px-3 py-1 text-base font-medium bg-white border border-gray-200 rounded min-w-[2.5rem] text-center">{item.quantity}</span>
                        <button className="px-2 py-1 text-lg font-bold text-gray-600 bg-gray-100 rounded-r hover:bg-gray-200 transition" onClick={() => onQuantityChange(1)} aria-label="Increase quantity">+</button>
                    </div>
                    <div className="flex flex-row gap-3 items-center justify-between w-full sm:w-auto">
                        <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-700">{userCurrency?.currencySymbol}{item.totalPrice}</span>
                        <button className="ml-2 px-3 py-1 text-xs sm:text-sm md:text-base rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition" onClick={onRemove} title="Remove">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuestCartItemClient
