import { auth } from '@/auth'
import getUserAllWishlist from '@/backend/serverActions/getUserAllWishlist'
import React from 'react'
import WishlistProductList from './WishlistProductList'

const WishListPage = async () => {
    const session = await auth()
    const wishList = await getUserAllWishlist((session?.user as { id: string }).id, true)
    return (        <section className="w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl px-2 sm:px-6">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-100 to-indigo-100 px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Your Wishlist</h1>
                        <span className="text-sm text-gray-500 font-medium">{wishList?.items?.length ?? 0} item{(wishList?.items?.length ?? 0) !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="p-3 sm:p-6 min-h-[400px] flex flex-col gap-4">
                        <WishlistProductList itemIds={wishList?.itemIds ?? []} productList={wishList?.items ?? []} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WishListPage