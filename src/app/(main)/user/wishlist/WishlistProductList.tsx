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
        <>            {
                productList.length > 0 ? productList.map((product, index) => {
                    return product ? <Link key={product._id?.toString()} href={`/products/${product.productURL}`} className="group border-b mt-2 md:mt-3 flex flex-col sm:flex-row justify-start items-start w-full bg-white hover:bg-indigo-50 transition-colors rounded-lg shadow-sm hover:shadow-lg overflow-hidden border" prefetch={false}>
                        <div className="w-full relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3">
                            <div className="relative h-16 w-16 sm:h-18 sm:w-18 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 bg-gray-50 self-center sm:self-start">
                                <Image
                                    src={product.images[product.productPrimaryImageIndex]}
                                    alt={product.productName}
                                    height={80}
                                    width={80}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                                />
                            </div>
                            <div className="w-full flex flex-col gap-1 text-center sm:text-left">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">{product.productName}</h3>
                                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-primary">{userCurrency?.currencySymbol}{(product.productSellingPrice * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}</span>
                                    <span className="text-xs text-secondary line-through">{userCurrency?.currencySymbol}{(product.productMSRP * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end p-3 pt-0 sm:pt-3 sm:ml-2 w-full sm:w-auto">
                            <WishlistProductDeleteButton productId={product._id?.toString() ?? ""} userId={session?.user?.id ?? ""} />
                        </div>
                    </Link> : (                        <div
                            key={product ?? "" + randomInt(999).toString()}
                            className="group border-b mt-2 md:mt-3 flex flex-col sm:flex-row justify-start items-start w-full bg-white rounded-lg shadow-sm border border-dashed border-red-200 overflow-hidden"
                        >
                            <div className="w-full relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3">
                                <div className="relative h-16 w-16 sm:h-18 sm:w-18 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center self-center sm:self-start">
                                    <span className="text-2xl sm:text-3xl text-red-300 font-bold">!</span>
                                </div>
                                <div className="w-full flex flex-col gap-1 text-center sm:text-left">
                                    <h3 className="text-sm sm:text-base font-semibold text-red-400">The product is no longer available</h3>
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <span className="text-xs text-gray-400">This item has been removed from our catalog or is out of stock.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center sm:justify-end p-3 pt-0 sm:pt-3 sm:ml-2 w-full sm:w-auto">
                                <WishlistProductDeleteButton productId={itemIds[index]} userId={session?.user?.id ?? ""} />
                            </div>
                        </div>
                    )                }) : <div className="w-full flex flex-col items-center justify-center text-center p-6 h-64">
                    <div className="text-3xl sm:text-4xl md:text-5xl opacity-30 font-extrabold select-none mb-3">💝</div>
                    <div className="text-lg sm:text-xl md:text-2xl opacity-60 font-bold select-none">No Items In Wishlist</div>
                    <div className="text-xs sm:text-sm opacity-40 mt-1 max-w-md">Start adding products to your wishlist to see them here</div>
                </div>
            }
        </>
    )
}

export default WishlistProductList