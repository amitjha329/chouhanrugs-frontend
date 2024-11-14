import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { randomInt } from 'crypto'
import { auth } from '@/auth'
import { ProductDataModel } from '@/types/ProductDataModel'
import { cookies } from 'next/headers'
import Currency from '@/types/Currency'
import WishlistProductDeleteButton from './WishlistProductDeleteButton'

const WishlistProductList = async ({ productList }: { productList: (ProductDataModel | null)[] }) => {
    // const { userCurrency } = useCurrencyContext()
    const session = await auth()
    const cookie = await cookies()
    const userCurrency = JSON.parse(cookie.get("userCurrency")?.value ?? "{}") as Currency
    return (
        <>
            {
                productList.length > 0 ? productList.map(product => {
                    return product ? <Link key={product._id?.toString()} href={`/products/${product._id}`} className="border-b mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start w-full">
                        <div className="pb-4 md:pb-8 w-full relative flex flex-row items-center">
                            <Image src={product.images[product.productPrimaryImageIndex]} alt="dress" height={100} width={100} />
                            <div className="w-full ml-3 ">
                                <h3 className="text-base leading-6 text-gray-800 mb-3">{product.productName}</h3>
                                <span>{userCurrency?.currencySymbol}{(product.productSellingPrice * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}</span> <span className="text-red-300 line-through"> {userCurrency?.currencySymbol}{(product.productMSRP * (userCurrency?.exchangeRates ?? 1)).toFixed(2)}</span>
                            </div>
                        </div>
                        <WishlistProductDeleteButton productId={product._id?.toString() ?? ""} userId={session?.user?.id ?? ""} />
                    </Link> : <div key={product ?? "" + randomInt(999).toString()} className='card bordered card-body card-title p-14'>Product Not Available</div>
                }) : <div className='w-full flex items-center justify-center max-sm:text-6xl text-9xl opacity-30 h-96'>No Items In Wishlist</div>
            }
        </>
    )
}

export default WishlistProductList