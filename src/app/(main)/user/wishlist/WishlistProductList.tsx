import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ImBin } from 'react-icons/im'
import { randomInt } from 'crypto'
import onPageNotifications from '@/utils/onPageNotifications'
import { auth } from '@/auth'
import { ProductDataModel } from '@/types/ProductDataModel'
import { cookies } from 'next/headers'
import Currency from '@/types/Currency'
import deleteProductFromWishlist from '@/backend/serverActions/deleteProductFromWishlist'

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
                        <div className='btn btn-sm rounded-none max-sm:w-full sm:h-20 btn-error btn-outline' onClick={e => {
                            e.preventDefault()
                            deleteProductFromWishlist(product._id?.toString() ?? "", (session?.user as { id: string }).id).then(res => {
                                window.location.reload()
                            }).catch(e => {
                                console.log(e)
                                onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
                            })
                        }}><ImBin className='w-4 h-4' /></div>
                    </Link> : <div key={product ?? "" + randomInt(999).toString()} className='card bordered card-body card-title p-14'>Product Not Available</div>
                }) : <div className='w-full flex items-center justify-center max-sm:text-6xl text-9xl opacity-30 h-96'>No Items In Wishlist</div>
            }
        </>
    )
}

export default WishlistProductList