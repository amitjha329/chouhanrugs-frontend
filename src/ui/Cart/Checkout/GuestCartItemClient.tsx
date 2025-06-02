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
        <div className="flex items-center justify-between hover:bg-gray-100 mb-2 w-full">
            <a href={`/products/${item.cartProduct[0].productURL}`} className="flex min-w-0 w-64">
                <div className="w-fit">
                    <img
                        height={96}
                        width={96}
                        className="sm:h-24 sm:w-24 object-scale-down w-20 h-20"
                        src={item.cartProduct[0].images[item.cartProduct[0].productPrimaryImageIndex]}
                        alt=""
                    />
                </div>
                <div className="flex flex-col justify-start ml-4 flex-grow min-w-0">
                    <span className="font-bold text-sm max-sm:text-xs max-w-[250px] truncate">{item.cartProduct[0].productName}</span>
                    <span className="opacity-80 max-sm:text-sm truncate">Brand: {item.cartProduct[0].productBrand}</span>
                    <div className='flex gap-2 flex-wrap'>
                        {variation && <>
                            {variation.variationSize && <span className="opacity-80 text-xs">Size: {variation.variationSize}</span>}
                            {variation.variationColor && <span className="opacity-80 text-xs">Color: {variation.variationColor}</span>}
                        </>}
                        {item.variationCode === 'customSize' && <div className='flex flex-col'>
                            <div className='flex gap-2'>
                                <span className="opacity-80 text-xs">Size: Custom Size</span>
                                <span className="opacity-80 text-xs">Shape: {item.customSize?.shape}</span>
                            </div>
                            {item.customSize?.shape === 'Round' && <span className="opacity-80 text-xs">Diameter: {item.customSize?.dimensions.diameter?.toFixed(2)}</span>}
                            {(item.customSize?.shape === 'Rectangle' || item.customSize?.shape === 'Runner') && <>
                                <span className="opacity-80 text-xs">Length: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                                <span className="opacity-80 text-xs">Width: {item.customSize?.dimensions.width?.toFixed(2)}</span>
                            </>}
                            {item.customSize?.shape === 'Square' && <span className="opacity-80 text-xs">Size: {item.customSize?.dimensions.length?.toFixed(2)}</span>}
                        </div>}
                    </div>
                </div>
            </a>
            <div className="flex items-center justify-center w-32">
                <button className="px-2 py-1 border rounded-l bg-gray-100 hover:bg-gray-200" onClick={() => onQuantityChange(-1)} aria-label="Decrease quantity">-</button>
                <input className="mx-2 input input-sm input-bordered border text-center w-16" type="text" value={item.quantity} readOnly />
                <button className="px-2 py-1 border rounded-r bg-gray-100 hover:bg-gray-200" onClick={() => onQuantityChange(1)} aria-label="Increase quantity">+</button>
            </div>
            <div className="flex items-center justify-center w-32">
                <span className="font-semibold text-sm">{userCurrency?.currencySymbol} {item.pricePerQty}</span>
            </div>
            <div className="flex items-center justify-center w-32">
                <span className="font-semibold text-sm">{userCurrency?.currencySymbol} {item.totalPrice}</span>
            </div>
            <div className="flex items-center justify-center w-16">
                <button className="text-red-500 hover:text-red-700 text-lg" title="Remove" onClick={onRemove}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default GuestCartItemClient
