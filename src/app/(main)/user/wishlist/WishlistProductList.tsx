import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { randomInt } from 'crypto'
import { auth } from '@/auth'
import { ProductDataModel } from '@/types/ProductDataModel'
import { cookies } from 'next/headers'
import Currency from '@/types/Currency'
import WishlistProductDeleteButton from './WishlistProductDeleteButton'

const WishlistProductList = async ({ productList, itemIds }: { productList: (ProductDataModel | null)[], itemIds: string[] }) => {
    // const { userCurrency } = useCurrencyContext()
    const session = await auth()
    const cookie = await cookies()
    const userCurrency = JSON.parse(cookie.get("userCurrency")?.value ?? "{}") as Currency
    return (
        <>
            {
                productList.length > 0 ? productList.map((product, index) => (
                    product ? (
                        <div
                            key={product._id?.toString()}
                            className="group border-b mt-2 md:mt-3 flex flex-row sm:flex-row justify-start items-center w-full bg-white hover:bg-indigo-50 transition-colors rounded-lg shadow-sm hover:shadow-lg overflow-hidden border p-2 sm:p-3 gap-2 sm:gap-3"
                        >
                            <Link
                                href={`/products/${product.productURL}`}
                                className="flex flex-row flex-1 items-center gap-2 sm:gap-3 min-w-0"
                                prefetch={false}
                            >
                                <div className="relative h-12 w-12 sm:h-18 sm:w-18 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 bg-gray-50 self-center">
                                    <Image
                                        src={product.images[product.productPrimaryImageIndex]}
                                        alt={product.productName}
                                        height={48}
                                        width={48}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 gap-0.5 text-left justify-center min-w-0">
                                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 pr-2">{product.productName}</h3>
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <span className="text-xs font-bold text-primary">{userCurrency?.currencySymbol ?? "$"}{(product.productSellingPrice * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}</span>
                                        {/* Hide MSRP on mobile, show on sm+ */}
                                        <span className="hidden sm:inline text-xs text-secondary line-through">{userCurrency?.currencySymbol}{(product.productMSRP * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}</span>
                                    </div>
                                </div>
                            </Link>
                            {/* Remove button always visible at end for mobile, on right for desktop */}
                            <div className="flex-shrink-0 flex items-center ml-2">
                                <WishlistProductDeleteButton productId={product._id?.toString() ?? ""} userId={session?.user?.id ?? ""} />
                            </div>
                        </div>
                    ) : (
                        <div
                            key={itemIds[index] ?? randomInt(999).toString()}
                            className="group border-b mt-2 md:mt-3 flex flex-row sm:flex-row justify-start items-center w-full bg-white rounded-lg shadow-sm border border-dashed border-red-200 overflow-hidden p-2 sm:p-3 gap-2 sm:gap-3"
                        >
                            <div className="relative h-12 w-12 sm:h-18 sm:w-18 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center self-center">
                                <span className="text-xl sm:text-3xl text-red-300 font-bold">!</span>
                            </div>
                            <div className="flex flex-col flex-1 gap-0.5 text-left justify-center min-w-0">
                                <h3 className="text-xs font-semibold text-red-400 line-clamp-1 pr-2">The product is no longer available</h3>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-400">This item has been removed or is out of stock.</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex items-center ml-2">
                                <WishlistProductDeleteButton productId={itemIds[index]} userId={session?.user?.id ?? ""} />
                            </div>
                        </div>
                    )
                )) : (
                    <div className="w-full flex flex-col items-center justify-center text-center p-6 h-64">
                        <div className="text-3xl sm:text-4xl md:text-5xl opacity-30 font-extrabold select-none mb-3">💝</div>
                        <div className="text-lg sm:text-xl md:text-2xl opacity-60 font-bold select-none">No Items In Wishlist</div>
                        <div className="text-xs sm:text-sm opacity-40 mt-1 max-w-md">Start adding products to your wishlist to see them here</div>
                    </div>
                )
            }
        </>
    )
}

export default WishlistProductList