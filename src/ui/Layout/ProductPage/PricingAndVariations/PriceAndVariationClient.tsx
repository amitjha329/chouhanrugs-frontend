'use client'
import ColorDataModel from '@/types/ColorDataModel'
import { ProductDataModel } from '@/types/ProductDataModel'
import SizeDataModel from '@/types/SizeDataModel'
import { useProductContext } from '@/utils/Contexts/ProductContext'
import React from 'react'

interface VariationExtraDataModel extends ProductDataModel {
    colorData: ColorDataModel[],
    sizeData: SizeDataModel[]
}

const PriceAndVariationClient = ({ product }: { product: VariationExtraDataModel }) => {
    const {
        variation,
        setVariation,
        isVariation,
        setIsVariation,
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        handleAddToCart,
        handleBuyNow,
        priceLoading, // Use context's priceLoading
    } = useProductContext() || {};

    // Add state for quantity
    const [quantity, setQuantity] = React.useState(1);
    // Add state for button loading/disabled
    const [actionLoading, setActionLoading] = React.useState(false);

    // Use context's current variation object for price and msrp
    const getCurrentVariation = React.useCallback(() => {
        if (!product.variations) return undefined;
        if (selectedColor && selectedSize) {
            return product.variations.find((v) => v.variationColor === selectedColor && v.variationSize === selectedSize);
        } else if (selectedColor) {
            return product.variations.find((v) => v.variationColor === selectedColor);
        } else if (selectedSize) {
            return product.variations.find((v) => v.variationSize === selectedSize);
        }
        return undefined;
    }, [product.variations, selectedColor, selectedSize]);

    function getMsrp() {
        const v = getCurrentVariation();
        if (v) {
            return Number(v.variationPrice ?? 0);
        }
        return product.productMSRP;
    }

    function getSellingPrice() {
        const v = getCurrentVariation();
        if (v) {
            return Number(v.variationPrice ?? 0) - (Number(v.variationDiscount ?? 0) / 100 * Number(v.variationPrice ?? 0));
        }
        return product.productSellingPrice;
    }

    // Memoize sorted sizeData for performance
    const sortedSizeData = React.useMemo(() => {
        return [...product.sizeData].sort((a, b) => {
            const parse = (s: string) => {
                const match = s.match(/(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)/);
                if (!match) return [0, 0];
                return [parseFloat(match[1]), parseFloat(match[2])];
            };
            const [aw, ah] = parse(a.sizeCode);
            const [bw, bh] = parse(b.sizeCode);
            return (aw * ah) - (bw * bh);
        });
    }, [product.sizeData]);

    // Memoize colorData for performance
    const colorData = React.useMemo(() => product.colorData, [product.colorData]);

    // Accessibility: set aria attributes for selects and buttons
    return (
        <>
            <div className="flex items-center mb-4">
                {priceLoading ? (
                    <div className="skeleton h-8 w-32 rounded" style={{ minWidth: 120 }} aria-busy="true" aria-live="polite" />
                ) : (
                    <>
                        <span className="~text-xl/3xl font-bold text-brown-700" id='selling_price' aria-label="Selling price">${getSellingPrice().toFixed(1)}</span>
                        <span className="line-through ml-2 text-gray-500" id='msrp' aria-label="MSRP">${getMsrp().toFixed(1)}</span>
                        <button className="bg-green-500 text-white ~px-1/3 py-1 rounded ml-4 ~text-sm/base" aria-label={`Save ${product.productDiscountPercentage}`}>Save {product.productDiscountPercentage}
                        </button>
                    </>
                )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
                <div className="flex flex-row gap-3 mb-3 w-full">
                    {colorData.length > 0 && <div className="basis-1/2 md:basis-1/3 flex-1">
                        <label className="block mb-1 font-semibold text-gray-700" htmlFor="color-select">Color</label>
                        <div className="relative">
                            {priceLoading ? (
                                <div className="skeleton h-12 w-full rounded-xl" aria-busy="true" />
                            ) : (
                                <select
                                    id="color-select"
                                    className="block w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-10 pr-10 text-base font-medium text-gray-700 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition-all duration-150 ease-in-out appearance-none"
                                    name="color"
                                    value={selectedColor}
                                    onChange={e => setSelectedColor && setSelectedColor(e.target.value)}
                                    aria-label="Select color"
                                    disabled={actionLoading}
                                >
                                    {colorData.map((color) => (
                                        <option key={color.colorCode.hex} value={color.name}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span
                                    className="inline-block w-5 h-5 rounded border border-gray-300"
                                    id='display-color'
                                    style={{ backgroundColor: selectedColor ? colorData.find(c => c.name === selectedColor)?.colorCode.hex : "#fff" }}
                                ></span>
                            </div>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>}
                    {sortedSizeData.length > 0 && <div className="basis-1/2 md:basis-1/3 flex-1">
                        <label className="block mb-1 font-semibold text-gray-700" htmlFor="size-select">Size</label>
                        <div className="relative">
                            {priceLoading ? (
                                <div className="skeleton h-12 w-full rounded-xl" aria-busy="true" />
                            ) : (
                                <select
                                    id="size-select"
                                    className="block w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-4 pr-10 text-base font-medium text-gray-700 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition-all duration-150 ease-in-out appearance-none"
                                    value={selectedSize}
                                    onChange={e => setSelectedSize && setSelectedSize(e.target.value)}
                                    aria-label="Select size"
                                    disabled={actionLoading}
                                >
                                    {sortedSizeData.map((size) => (
                                        <option key={size.sizeCode} value={size.sizeCode}>
                                            {size.sizeCode}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>}
                </div>
                {/* On desktop, show quantity in the same row, else in next row */}
                <div className="hidden md:block basis-1/3 flex-1">
                    <div className="w-full">
                        <label className="block mb-1 font-semibold text-gray-700" htmlFor="product_quantity">Quantity</label>
                        <div className="relative">
                            {priceLoading ? (
                                <div className="skeleton h-12 w-full rounded-xl" aria-busy="true" />
                            ) : (
                                <select
                                    className="block w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-4 pr-10 text-base font-medium text-gray-700 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition-all duration-150 ease-in-out appearance-none"
                                    id='product_quantity'
                                    aria-label="Select quantity"
                                    value={quantity}
                                    onChange={e => setQuantity(Number(e.target.value))}
                                    disabled={priceLoading || actionLoading}
                                >
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            )}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* On mobile, show quantity in its own row */}
            <div className="flex flex-row gap-3 mb-6 w-full md:hidden">
                <div className="w-full">
                    <label className="block mb-1 font-semibold text-gray-700" htmlFor="product_quantity">Quantity</label>
                    <div className="relative">
                        {priceLoading ? (
                            <div className="skeleton h-12 w-full rounded-xl" aria-busy="true" />
                        ) : (
                            <select
                                className="block w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-4 pr-10 text-base font-medium text-gray-700 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition-all duration-150 ease-in-out appearance-none"
                                id='product_quantity'
                                aria-label="Select quantity"
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                disabled={priceLoading || actionLoading}
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        )}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 w-full">
                {priceLoading ? (
                    <>
                        <div className="skeleton h-12 w-full sm:w-40 rounded-xl" aria-busy="true" />
                        <div className="skeleton h-12 w-full sm:w-40 rounded-xl" aria-busy="true" />
                    </>
                ) : (
                    <>
                        <button
                            className={`w-full sm:w-auto rounded-full bg-accent text-white font-bold py-3 px-8 shadow-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-150 ease-in-out text-base tracking-wide ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            id='buy_now_btn'
                            tabIndex={0}
                            aria-label="Buy Now"
                            disabled={actionLoading}
                            onClick={async () => {
                                if (!handleBuyNow) return;
                                setActionLoading(true);
                                const userId = (document.getElementById('session_user') as HTMLInputElement)?.value;
                                const productId = typeof product._id === 'string' ? product._id : product._id?.toString?.() || '';
                                if (!userId) {
                                    window.location.href = "/signin?cb=" + window.location.pathname;
                                    setActionLoading(false);
                                    return;
                                }
                                await handleBuyNow(
                                    userId,
                                    productId,
                                    quantity,
                                    variation || '',
                                    () => { window.location.href = "/cart/checkout"; },
                                    () => setActionLoading(false)
                                );
                            }}
                        >Buy Now</button>
                        <button
                            className={`w-full sm:w-auto rounded-full border-2 border-accent text-accent font-bold py-3 px-8 shadow-lg hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-150 ease-in-out text-base tracking-wide ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            id='add_to_cart_btn'
                            tabIndex={0}
                            aria-label="Add to Cart"
                            disabled={actionLoading}
                            onClick={async () => {
                                if (!handleAddToCart) return;
                                setActionLoading(true);
                                const userId = (document.getElementById('session_user') as HTMLInputElement)?.value;
                                const productId = typeof product._id === 'string' ? product._id : product._id?.toString?.() || '';
                                if (!userId) {
                                    window.location.href = "/signin?cb=" + window.location.pathname;
                                    setActionLoading(false);
                                    return;
                                }
                                await handleAddToCart(
                                    userId,
                                    productId,
                                    quantity,
                                    variation || '',
                                    () => { window.location.reload(); },
                                    () => setActionLoading(false)
                                );
                            }}
                        >Add to Cart</button>
                    </>
                )}
            </div>
            <input className='hidden' type='hidden' value={JSON.stringify(product)} id='prod_data' />
        </>
    )
}

export default PriceAndVariationClient