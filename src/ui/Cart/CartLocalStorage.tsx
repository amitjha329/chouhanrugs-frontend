'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CartTotalSection from './CartTotalSection';
import { Variation } from '@/types/ProductDataModel';

// Helper to calculate price (simplified, as we don't have all backend logic)
function calculateProductPrice(item: any) {
    let price = 0;
    if (item.productData && item.productData.variations && item.variation) {
        const variation = item.productData.variations.find((v: any) => v.variationCode === item.variation);
        if (variation) {
            const base = Number(variation.variationPrice ?? 0);
            const discount = Number(variation.variationDiscount ?? 0);
            price = base - (base * (discount / 100));
        } else {
            price = item.productData.productSellingPrice ?? 0;
        }
    } else {
        price = item.productData?.productSellingPrice ?? 0;
    }
    return price * item.quantity;
}

const CartLocalStorage = () => {
    const [cart, setCart] = useState<any[]>([]);

    // Helper to sync cart state with localStorage
    const syncCart = (newCart: any[]) => {
        setCart(newCart);
        localStorage.setItem('pending_cart', JSON.stringify(newCart));
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const localCart = JSON.parse(localStorage.getItem('pending_cart') || '[]');
            setCart(localCart);
        }
    }, []);

    const handleRemove = (idx: number) => {
        const newCart = cart.filter((_, i) => i !== idx);
        syncCart(newCart);
    };

    const handleQuantityChange = (idx: number, delta: number) => {
        const newCart = cart.map((item, i) => {
            if (i === idx) {
                const newQty = item.quantity + delta;
                // Ensure quantity is between 1 and 10
                const clampedQty = Math.max(1, Math.min(10, newQty));
                return { ...item, quantity: clampedQty };
            }
            return item;
        });
        syncCart(newCart);
    };

    // CartTotalSection expects CartDataModel[]
    // We'll map local cart items to a compatible structure for display
    const mappedCart = cart.map((item: any) => ({
        _id: item.productId,
        quantity: item.quantity,
        cartProduct: [item.productData],
        variationCode: item.variation || '',
        customSize: item.customSize || null
    }));

    return (
        <div className="container py-0 sm:py-10 mx-auto">
            <div className="flex shadow-none sm:shadow-lg rounded-none sm:rounded-md overflow-hidden flex-col">
                <div className="bg-base-100 px-10 py-10">
                    <Link href="/">
                        <div className="flex font-semibold text-primary text-sm mb-7 cursor-pointer">
                            <svg className="fill-current mr-2 text-primary w-4" viewBox="0 0 448 512">
                                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                            </svg>
                            Continue Shopping
                        </div>
                    </Link>
                    <div className="flex justify-between border-b pb-8 mb-5 sm:mb-auto">
                        <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                        <h2 className="font-semibold text-2xl">{cart.length} Items</h2>
                    </div>
                    <div className="hidden sm:flex mt-10 mb-5 justify-between items-center">
                        <h3 className="font-semibold text-gray-600 text-xs uppercase w-64">Product Details</h3>
                        <h3 className="font-semibold text-center text-gray-600 text-xs uppercase ">Quantity</h3>
                        <h3 className="font-semibold text-center text-gray-600 text-xs uppercase">Price/Qty.</h3>
                        <h3 className="font-semibold text-center text-gray-600 text-xs uppercase">Total</h3>
                        <span></span>
                    </div>
                    {cart && cart.length > 0 ? (
                        <>
                            {/* Desktop Table Rows */}
                            {mappedCart.map((item, idx) => {
                                // Cache variation lookup to avoid redundant .find() calls
                                const currentVariation = item.variationCode && item.cartProduct[0]
                                    ? item.cartProduct[0].variations.find((varItem:Variation) => varItem.variationCode == item.variationCode)
                                    : null;
                                
                                return item.cartProduct[0] ? (
                                    <div key={idx} className="hidden sm:flex items-center justify-between hover:bg-gray-100 mb-2 w-full">
                                        {/* Product Details */}
                                        <div className="flex min-w-0 w-64">
                                            <a href={`/products/${item.cartProduct[0].productURL}`} className="flex items-center min-w-0">
                                                <div className="w-fit">
                                                    <img
                                                        height={140}
                                                        width={140}
                                                        className="sm:h-36 sm:w-36 object-scale-down w-28 h-28"
                                                        src={item.cartProduct[0].images[item.cartProduct[0].productPrimaryImageIndex]}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-start ml-4 flex-grow min-w-0">
                                                    <span className="font-medium text-xs max-w-[250px] truncate">{item.cartProduct[0].productName}</span>
                                                    <span className="opacity-80 max-sm:text-sm truncate">Brand: {item.cartProduct[0].productBrand}</span>
                                                    <div className='flex gap-2 flex-wrap'>
                                                        {currentVariation && <>
                                                            {currentVariation.variationSize != null && <span className="opacity-80 text-xs">Size: {currentVariation.variationSize}</span>}
                                                            {currentVariation.variationColor != null && <span className="opacity-80 text-xs">Color: {currentVariation.variationColor}</span>}
                                                        </>}
                                                        {item.variationCode == "customSize" && <div className='flex flex-col'>
                                                            <div className='flex gap-2'>
                                                                <span className="opacity-80 text-xs">Size: Custom Size</span>
                                                                <span className="opacity-80 text-xs">Shape: {item.customSize?.shape}</span>
                                                            </div>
                                                            {item.customSize?.shape == "Round" && <span className="opacity-80 text-xs">Diameter: {item.customSize?.dimensions.diameter?.toFixed(2)}</span>}
                                                            {item.customSize?.shape == "Rectangle" && <>
                                                                <span className="opacity-80 text-xs">Length: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                                                                <span className="opacity-80 text-xs">Width: {item.customSize?.dimensions.width?.toFixed(2)}</span>
                                                            </>}
                                                            {item.customSize?.shape == "Runner" && <>
                                                                <span className="opacity-80 text-xs">Length: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                                                                <span className="opacity-80 text-xs">Width: {item.customSize?.dimensions.width?.toFixed(2)}</span>
                                                            </>}
                                                            {item.customSize?.shape == "Square" && <span className="opacity-80 text-xs">Size: {item.customSize?.dimensions.length?.toFixed(2)}</span>}
                                                        </div>}
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                        {/* Quantity */}
                                        <div className="flex items-center justify-center w-32">
                                            <button
                                                className="px-2 py-1 border rounded-l bg-gray-100 hover:bg-gray-200"
                                                onClick={() => handleQuantityChange(idx, -1)}
                                                aria-label="Decrease quantity"
                                            >-</button>
                                            <input
                                                className="mx-2 input input-sm input-bordered border text-center w-16"
                                                type="text"
                                                value={item.quantity}
                                                readOnly
                                            />
                                            <button
                                                className="px-2 py-1 border rounded-r bg-gray-100 hover:bg-gray-200"
                                                onClick={() => handleQuantityChange(idx, 1)}
                                                aria-label="Increase quantity"
                                            >+</button>
                                        </div>
                                        {/* Price/Qty. */}
                                        <div className="flex items-center justify-center w-32">
                                            <span className="font-semibold text-xs">${calculateProductPrice({ productData: item.cartProduct[0], variation: item.variationCode, quantity: 1, customSize: item.customSize })?.toFixed(2)}</span>
                                        </div>
                                        {/* Total */}
                                        <div className="flex items-center justify-center w-32">
                                            <span className="font-semibold text-xs">${calculateProductPrice({ productData: item.cartProduct[0], variation: item.variationCode, quantity: item.quantity, customSize: item.customSize })?.toFixed(2)}</span>
                                        </div>
                                        {/* Remove */}
                                        <div className="flex items-center justify-center w-16">
                                            <button
                                                className="text-red-500 hover:text-red-700 text-lg"
                                                title="Remove"
                                                onClick={() => handleRemove(idx)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={idx} className="hidden sm:flex items-center justify-between hover:bg-gray-100 mb-2 w-full">
                                        <div className="flex flex-1 min-w-0 w-64">
                                            <span className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 text-gray-400">No Image</span>
                                            <div className="flex flex-col justify-start ml-4 flex-grow min-w-0">
                                                <span className="font-bold text-sm max-sm:text-xs max-w-[250px] truncate">Product no Longer Available</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center w-32">
                                            <input
                                                className="mx-2 input input-sm input-bordered border text-center w-12"
                                                type="text"
                                                value={item.quantity}
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex items-center justify-center w-32"></div>
                                        <div className="flex items-center justify-center w-32"></div>
                                        <div className="flex items-center justify-center w-16"></div>
                                    </div>
                                )
                            })}
                            {/* Mobile Card Rows */}
                            {mappedCart.map((item, idx) => {
                                // Cache variation lookup to avoid redundant .find() calls
                                const currentVariation = item.variationCode && item.cartProduct[0]
                                    ? item.cartProduct[0].variations.find((varItem:Variation) => varItem.variationCode == item.variationCode)
                                    : null;
                                
                                return item.cartProduct[0] ? (
                                    <div key={idx} className="flex flex-col sm:hidden bg-base-100 rounded-lg shadow mb-4 p-4 border border-base-300">
                                        <div className="flex items-center mb-2">
                                            <a href={`/products/${item.cartProduct[0].productURL}`} className="flex items-center">
                                                <div className="w-fit">
                                                    <img
                                                        height={140}
                                                        width={140}
                                                        className="h-28 w-28 object-scale-down rounded"
                                                        src={item.cartProduct[0].images[item.cartProduct[0].productPrimaryImageIndex]}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-start ml-3 flex-grow">
                                                    <span className="font-medium text-xs max-w-[180px] truncate">{item.cartProduct[0].productName}</span>
                                                    <span className="opacity-80 text-sm">Brand: {item.cartProduct[0].productBrand}</span>
                                                    <div className='flex gap-2 flex-wrap mt-1'>
                                                        {currentVariation && <>
                                                            {currentVariation.variationSize != null && <span className="opacity-80 text-xs">Size: {currentVariation.variationSize}</span>}
                                                            {currentVariation.variationColor != null && <span className="opacity-80 text-xs">Color: {currentVariation.variationColor}</span>}
                                                        </>}
                                                        {item.variationCode == "customSize" && <div className='flex flex-col'>
                                                            <div className='flex gap-2'>
                                                                <span className="opacity-80 text-xs">Size: Custom Size</span>
                                                                <span className="opacity-80 text-xs">Shape: {item.customSize?.shape}</span>
                                                            </div>
                                                            {item.customSize?.shape == "Round" && <span className="opacity-80 text-xs">Diameter: {item.customSize?.dimensions.diameter?.toFixed(2)}</span>}
                                                            {item.customSize?.shape == "Rectangle" && <>
                                                                <span className="opacity-80 text-xs">Length: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                                                                <span className="opacity-80 text-xs">Width: {item.customSize?.dimensions.width?.toFixed(2)}</span>
                                                            </>}
                                                            {item.customSize?.shape == "Runner" && <>
                                                                <span className="opacity-80 text-xs">Length: {item.customSize?.dimensions.length?.toFixed(2)}</span>
                                                                <span className="opacity-80 text-xs">Width: {item.customSize?.dimensions.width?.toFixed(2)}</span>
                                                            </>}
                                                            {item.customSize?.shape == "Square" && <span className="opacity-80 text-xs">Size: {item.customSize?.dimensions.length?.toFixed(2)}</span>}
                                                        </div>}
                                                    </div>
                                                </div>
                                            </a>
                                            <button
                                                className="ml-auto text-red-500 hover:text-red-700 text-lg"
                                                title="Remove"
                                                onClick={() => handleRemove(idx)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 items-center justify-between mt-2">
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium mr-2">Qty:</span>
                                                <button
                                                    className="px-2 py-1 border rounded-l bg-gray-100 hover:bg-gray-200"
                                                    onClick={() => handleQuantityChange(idx, -1)}
                                                    aria-label="Decrease quantity"
                                                >-</button>
                                                <input
                                                    className="mx-2 input input-sm input-bordered border text-center w-12"
                                                    type="text"
                                                    value={item.quantity}
                                                    readOnly
                                                />
                                                <button
                                                    className="px-2 py-1 border rounded-r bg-gray-100 hover:bg-gray-200"
                                                    onClick={() => handleQuantityChange(idx, 1)}
                                                    aria-label="Increase quantity"
                                                >+</button>
                                            </div>
                                            <div className="flex flex-col text-right ml-auto">
                                                <span className="text-xs text-gray-500">Price/Qty.</span>
                                                <span className="font-semibold text-sm">${calculateProductPrice({ productData: item.cartProduct[0], variation: item.variationCode, quantity: 1, customSize: item.customSize })?.toFixed(2)}</span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-xs text-gray-500">Total</span>
                                                <span className="font-semibold text-sm">${calculateProductPrice({ productData: item.cartProduct[0], variation: item.variationCode, quantity: item.quantity, customSize: item.customSize })?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={idx} className="flex flex-col sm:hidden bg-base-100 rounded-lg shadow mb-4 p-4 border border-base-300">
                                        <div className="flex items-center mb-2">
                                            <span className="inline-flex items-center justify-center w-20 h-20 bg-base-200 text-base-content/40">No Image</span>
                                            <div className="flex flex-col justify-start ml-3 flex-grow">
                                                <span className="font-bold text-base max-w-[180px] truncate">Product no Longer Available</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <input
                                                className="mx-2 input input-sm input-bordered border text-center w-12"
                                                type="text"
                                                value={item.quantity}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-64 sm:h-80 bg-base-100 rounded-lg shadow-inner my-8 px-4 sm:px-0">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-primary mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
                            </svg>
                            <h2 className="font-bold text-lg sm:text-2xl text-gray-700 mb-2 text-center">Your cart is empty</h2>
                            <p className="text-gray-500 mb-4 text-center text-sm sm:text-base">Looks like you haven&apos;t added anything yet.</p>
                            <Link href="/">
                                <button className="btn btn-primary w-full sm:w-auto">Continue Shopping</button>
                            </Link>
                        </div>
                    )}
                    {cart && cart.length > 0 && (
                        <CartTotalSection cartItems={mappedCart} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartLocalStorage;