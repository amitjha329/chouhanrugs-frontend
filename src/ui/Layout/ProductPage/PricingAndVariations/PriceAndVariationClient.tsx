'use client'
import addProductToWishlist from '@/backend/serverActions/addProductToWishlist'
import deleteProductFromWishlist from '@/backend/serverActions/deleteProductFromWishlist'
import ColorDataModel from '@/types/ColorDataModel'
import { ProductDataModel } from '@/types/ProductDataModel'
import SiteDataModel from '@/types/SiteDataModel'
import SizeDataModel from '@/types/SizeDataModel'
import { useDataConnectionContext } from '@/utils/Contexts/DataConnectionContext'
import { useProductContext } from '@/utils/Contexts/ProductContext'
import onPageNotifications from '@/utils/onPageNotifications'
import { useGoogleAdsConfig } from '@/components/GoogleAdsProvider'
import { trackAddToCartWithDetails } from '@/lib/gtagConversion'
import clsx from 'clsx'
import { useSession } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { MouseEventHandler, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { useLocale } from 'next-intl'
import { type Locale } from '@/i18n/routing'

interface VariationExtraDataModel extends ProductDataModel {
    colorData: ColorDataModel[],
    sizeData: SizeDataModel[]
}

const PriceAndVariationClient = ({ product, siteData }: { product: VariationExtraDataModel, siteData: SiteDataModel }) => {
    const locale = useLocale() as Locale
    const productURL = resolveLocalizedString(product.productURL, locale)
    const {
        variation,
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        handleAddToCart,
        handleBuyNow,
        priceLoading, // Use context's priceLoading
    } = useProductContext() || {};

    const [wishAnimate, setWishAnimate] = useState(false)
    const { wishlistItems, refreshWishList } = useDataConnectionContext()
    const { data: session } = useSession()
    const router = useRouter()
    const googleAdsConfig = useGoogleAdsConfig()

    const addToWishlist: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        if (session?.user === undefined) {
            router.push("/signin?cb=" + encodeURIComponent(window.location.pathname))
            return
        }
        !wishlistItems.includes((product._id ?? product.objectID).toString() ?? "") ? addProductToWishlist(product._id?.toString() ?? "", (session?.user as { id: string }).id).then(res => {
            res.ack ? onPageNotifications("success", "Added To Wishlist").catch(e => console.log(e)) : res.ack && onPageNotifications("error", "Failed Adding To Wishlist").catch(e => console.log(e))
        }).catch(err => {
            onPageNotifications("error", "Failed Adding To Wishlist").catch(e => console.log(e))
            console.log(err)
        }).finally(() => { refreshWishList() }) : deleteProductFromWishlist(product._id?.toString() ?? "", (session?.user as { id: string }).id).then(res => {
            res.ack ? onPageNotifications("success", "Removed From Wishlist").catch(e => console.log(e)) : res.ack && onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
        }).catch(err => {
            onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
            console.log(err)
        }).finally(() => { refreshWishList() })
        setWishAnimate(!wishAnimate)
    }

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
            <div className="mb-3 flex items-end gap-2 border-y border-neutral-200 py-3">
                {priceLoading ? (
                    <div className="skeleton h-7 w-28 rounded" style={{ minWidth: 112 }} aria-busy="true" aria-live="polite" />
                ) : (
                    <>
                        <span className="text-xl font-semibold leading-none text-neutral-950 md:text-2xl" id='selling_price' aria-label="Selling price">${getSellingPrice().toFixed(1)}</span>
                        <span className="pb-0.5 text-xs text-neutral-400 line-through" id='msrp' aria-label="MSRP">${getMsrp().toFixed(1)}</span>
                        <span className="mb-0.5 rounded-full border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700" aria-label={`Save ${product.productDiscountPercentage}`}>Save {product.productDiscountPercentage}</span>
                    </>
                )}
            </div>
            <div className="mb-3 flex w-full flex-col gap-2 sm:flex-row">
                <div className={clsx("grid w-full grid-cols-1 gap-2 sm:grid-cols-2", { "hidden": (colorData.length == 0 && sortedSizeData.length == 0) })}>
                    {colorData.length > 0 && <div className="basis-1/2 md:basis-1/3 flex-1">
                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-500" htmlFor="color-select">Color</label>
                        <div className="relative">
                            {priceLoading ? (
                                <div className="skeleton h-10 w-full rounded-lg" aria-busy="true" />
                            ) : (
                                <select
                                    id="color-select"
                                    className="block w-full appearance-none rounded-lg border border-neutral-300 bg-white py-2 pl-8 pr-8 text-[13px] font-medium text-neutral-800 transition-all duration-150 ease-in-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                                    className="inline-block h-3.5 w-3.5 rounded border border-gray-300"
                                    id='display-color'
                                    style={{ backgroundColor: selectedColor ? colorData.find(c => c.name === selectedColor)?.colorCode.hex : "#fff" }}
                                ></span>
                            </div>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>}
                    {sortedSizeData.length > 0 && <div className="basis-1/2 md:basis-1/3 flex-1">
                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-500" htmlFor="size-select">Size</label>
                        <div className="relative">
                            {priceLoading ? (
                                <div className="skeleton h-10 w-full rounded-lg" aria-busy="true" />
                            ) : (
                                <select
                                    id="size-select"
                                    className="block w-full appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-8 text-[13px] font-medium text-neutral-800 transition-all duration-150 ease-in-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>}
                </div>
                {/* On desktop, show quantity in the same row, else in next row */}
                <div className="hidden md:block basis-1/3 flex-1">
                    <div className="w-full max-w-40">
                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-500" htmlFor="product_quantity_desktop">Quantity</label>
                        <div className="relative">
                            {priceLoading ? (
                                <div className="skeleton h-10 w-full rounded-lg" aria-busy="true" />
                            ) : (
                                <select
                                    className="block w-full appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-8 text-[13px] font-medium text-neutral-800 transition-all duration-150 ease-in-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    id='product_quantity_desktop'
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
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* On mobile, show quantity in its own row */}
            <div className="mb-3 flex w-full flex-row gap-3 md:hidden">
                <div className="w-full">
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-500" htmlFor="product_quantity_mobile">Quantity</label>
                    <div className="relative">
                        {priceLoading ? (
                            <div className="skeleton h-10 w-full rounded-lg" aria-busy="true" />
                        ) : (
                            <select
                                className="block w-full appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-8 text-[13px] font-medium text-neutral-800 transition-all duration-150 ease-in-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                id='product_quantity_mobile'
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
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-3 flex w-full flex-col gap-2">
                {priceLoading ? (
                    <>
                        <div className="skeleton h-10 w-full rounded-lg" aria-busy="true" />
                        <div className="skeleton h-10 w-full rounded-lg" aria-busy="true" />
                        <div className="skeleton h-9 w-full rounded-lg" aria-busy="true" />
                    </>
                ) : (
                    <>
                        {/* Primary Action Buttons Row */}
                        <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
                            <button
                                className={`w-full flex-1 rounded-lg bg-primary px-3.5 py-2.5 text-[13px] font-semibold tracking-wide text-white shadow-primary/20 transition-all duration-150 ease-in-out hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                                        trackAddToCartWithDetails(googleAdsConfig, {
                                            product,
                                            variationCode: variation || '',
                                            quantity,
                                        })
                                        // Save to localStorage for both add to cart and buy now, allowing multiple items
                                        let pendingCart: any[] = JSON.parse(localStorage.getItem('pending_cart') || '[]');
                                        const newItem = {
                                            productId,
                                            quantity,
                                            variation: variation || '',
                                            selectedColor,
                                            selectedSize,
                                            productData: product,
                                            action: 'buy_now'
                                        };
                                        // Check for existing item with same productId, variation, selectedColor, selectedSize
                                        const existingIndex = pendingCart.findIndex((item: any) =>
                                            item.productId === newItem.productId &&
                                            item.variation === newItem.variation &&
                                            item.selectedColor === newItem.selectedColor &&
                                            item.selectedSize === newItem.selectedSize
                                        );
                                        if (existingIndex !== -1) {
                                            pendingCart[existingIndex].quantity += newItem.quantity;
                                            pendingCart[existingIndex].action = 'buy_now';
                                        } else {
                                            pendingCart.push(newItem);
                                        }
                                        localStorage.setItem('pending_cart', JSON.stringify(pendingCart));
                                        setActionLoading(false);
                                        onPageNotifications('success', 'Item added to cart.').then(() => {
                                            window.location.href = "/cart/checkout";
                                        }
                                        );
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
                            >
                                Buy Now
                            </button>

                            <button
                                className={`w-full flex-1 rounded-lg border border-primary bg-white px-3.5 py-2.5 text-[13px] font-semibold tracking-wide text-primary transition-all duration-150 ease-in-out hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                                        trackAddToCartWithDetails(googleAdsConfig, {
                                            product,
                                            variationCode: variation || '',
                                            quantity,
                                        })
                                        // Save to localStorage for both add to cart and buy now, allowing multiple items
                                        let pendingCart: any[] = JSON.parse(localStorage.getItem('pending_cart') || '[]');
                                        const newItem = {
                                            productId,
                                            quantity,
                                            variation: variation || '',
                                            selectedColor,
                                            selectedSize,
                                            productData: product,
                                            action: 'add_to_cart'
                                        };
                                        // Check for existing item with same productId, variation, selectedColor, selectedSize
                                        const existingIndex = pendingCart.findIndex((item: any) =>
                                            item.productId === newItem.productId &&
                                            item.variation === newItem.variation &&
                                            item.selectedColor === newItem.selectedColor &&
                                            item.selectedSize === newItem.selectedSize
                                        );
                                        if (existingIndex !== -1) {
                                            pendingCart[existingIndex].quantity += newItem.quantity;
                                            pendingCart[existingIndex].action = 'add_to_cart';
                                        } else {
                                            pendingCart.push(newItem);
                                        }
                                        localStorage.setItem('pending_cart', JSON.stringify(pendingCart));
                                        setActionLoading(false);
                                        onPageNotifications('success', 'Item added to cart.').then(() => {
                                            window.location.reload();
                                        });
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
                            >
                                Add to Cart
                            </button>

                            {/* Wishlist button - only on desktop, fixed size */}
                            <button
                                className={`hidden h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 bg-white text-primary transition-all duration-150 ease-in-out hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:flex ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                onClick={addToWishlist}
                                aria-label={wishlistItems.includes((product._id ?? product.objectID).toString() ?? "") ? "Remove from wishlist" : "Add to wishlist"}
                                disabled={actionLoading}
                            >
                                <FaHeart className={clsx(
                                    "text-base",
                                    wishlistItems.includes((product._id ?? product.objectID).toString() ?? "")
                                        ? "text-red-600"
                                        : "text-gray-400"
                                )} />
                            </button>
                        </div>

                        {/* Secondary Action Buttons Row */}
                        <div className="flex flex-row gap-2 w-full">
                            <Link
                                className={`w-full flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-center text-[11px] font-semibold tracking-wide text-neutral-700 transition-all duration-150 ease-in-out hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                aria-label="Request bulk order"
                                target='_blank'
                                href={`https://wa.me/${siteData.contact_details.whatsapp}?text=I%20want%20to%20request%20a%20bulk%20order%20for%3A%0Ahttps://chouhanrugs.com/products/${productURL ? encodeURIComponent(productURL) : ''}`}
                            >
                                Bulk Order
                            </Link>

                            <Link
                                className={`w-full flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-center text-[11px] font-semibold tracking-wide text-neutral-700 transition-all duration-150 ease-in-out hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                aria-label="Request custom order"
                                target='_blank'
                                href={`https://wa.me/${siteData.contact_details.whatsapp}?text=I%20want%20to%20request%20a%20custom%20order%20for%3A%0Ahttps://chouhanrugs.com/products/${productURL ? encodeURIComponent(productURL) : ''}`}
                            >
                                Custom Order
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default PriceAndVariationClient;
