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
                productList.length > 0 ? productList.map((product, index) => {
                    return product ? <Link key={product._id?.toString()} href={`/products/${product.productURL}`} className="group border-b mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start w-full bg-white hover:bg-indigo-50 transition-colors rounded-xl shadow-sm hover:shadow-lg overflow-hidden border" prefetch={false}>
                        <div className="w-full relative flex flex-row items-center gap-4">
                            <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <Image
                                    src={product.images[product.productPrimaryImageIndex]}
                                    alt={product.productName}
                                    height={100}
                                    width={100}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                                />
                            </div>
                            <div className="w-full ml-3 flex flex-col gap-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{product.productName}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-bold text-primary">{userCurrency?.currencySymbol}{(product.productSellingPrice * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}</span>
                                    <span className="text-sm text-secondary line-through">{userCurrency?.currencySymbol}{(product.productMSRP * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center ml-4">
                            <WishlistProductDeleteButton productId={product._id?.toString() ?? ""} userId={session?.user?.id ?? ""} />
                        </div>
                    </Link> : (
                        <div
                            key={product ?? "" + randomInt(999).toString()}
                            className="group border-b mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start w-full bg-white rounded-xl shadow-sm border border-dashed border-red-200 overflow-hidden"
                        >
                            <div className="w-full relative flex flex-row items-center gap-4">
                                <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                                    <span className="text-4xl text-red-300 font-bold">!</span>
                                </div>
                                <div className="w-full ml-3 flex flex-col gap-2">
                                    <h3 className="text-lg font-semibold text-red-400 mb-1">The product is no longer available</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">This item has been removed from our catalog or is out of stock.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center ml-4">
                                <WishlistProductDeleteButton productId={itemIds[index]} userId={session?.user?.id ?? ""} />
                            </div>
                        </div>
                    )
                }) : <div className="w-full flex items-center justify-center text-5xl sm:text-7xl opacity-30 h-96 font-extrabold select-none">No Items In Wishlist</div>
            }
        </>
    )
}

export default WishlistProductList