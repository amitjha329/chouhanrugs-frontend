import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { randomInt } from 'crypto'
import { auth } from '@/auth'
import { ProductDataModel } from '@/types/ProductDataModel'
import { cookies } from 'next/headers'
import Currency from '@/types/Currency'
import WishlistProductDeleteButton from './WishlistProductDeleteButton'
import { HiOutlineHeart, HiOutlineExclamationTriangle } from 'react-icons/hi2'

const WishlistProductList = async ({ productList, itemIds }: { productList: (ProductDataModel | null)[], itemIds: string[] }) => {
    const session = await auth()
    const cookie = await cookies()
    const userCurrency = JSON.parse(cookie.get("userCurrency")?.value ?? "{}") as Currency
    return (
        <div className="space-y-3">
            {
                productList.length > 0 ? productList.map((product, index) => (
                    product ? (
                        <div
                            key={product._id?.toString()}
                            className="group flex flex-col sm:flex-row gap-4 p-4 bg-base-100 rounded-xl border border-base-300/50 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                        >
                            <Link
                                href={`/products/${product.productURL}`}
                                className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-base-200 rounded-lg overflow-hidden"
                                prefetch={false}
                            >
                                <Image
                                    src={product.images[product.productPrimaryImageIndex]}
                                    alt={product.productName}
                                    height={96}
                                    width={96}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <Link
                                        href={`/products/${product.productURL}`}
                                        className="font-semibold text-base-content hover:text-primary transition-colors line-clamp-2"
                                        prefetch={false}
                                    >
                                        {product.productName}
                                    </Link>
                                    <p className="text-sm text-base-content/60 mt-1">
                                        Brand: {product.productBrand}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-base-300/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-primary">
                                            {userCurrency?.currencySymbol ?? "$"}{(product.productSellingPrice * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}
                                        </span>
                                        {product.productMSRP > product.productSellingPrice && (
                                            <span className="text-sm text-base-content/50 line-through">
                                                {userCurrency?.currencySymbol ?? "$"}{(product.productMSRP * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <WishlistProductDeleteButton productId={product._id?.toString() ?? ""} userId={session?.user?.id ?? ""} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            key={itemIds[index] ?? randomInt(999).toString()}
                            className="flex items-center gap-4 p-4 bg-error/5 border border-error/20 rounded-xl"
                        >
                            <div className="w-16 h-16 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <HiOutlineExclamationTriangle className="w-8 h-8 text-error" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-error">Product No Longer Available</p>
                                <p className="text-sm text-base-content/60">This item has been removed from our store</p>
                            </div>
                            <WishlistProductDeleteButton productId={itemIds[index]} userId={session?.user?.id ?? ""} />
                        </div>
                    )
                )) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <HiOutlineHeart className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-base-content mb-1">Your wishlist is empty</h3>
                        <p className="text-sm text-base-content/60 max-w-sm mb-4">
                            Start adding products to your wishlist to see them here
                        </p>
                        <Link href="/" className="btn btn-primary btn-sm">
                            Explore Products
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

export default WishlistProductList