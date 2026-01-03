import { auth } from '@/auth'
import getUserAllWishlist from '@/backend/serverActions/getUserAllWishlist'
import React from 'react'
import WishlistProductList from './WishlistProductList'
import { HiOutlineHeart } from 'react-icons/hi2'

const WishListPage = async () => {
    const session = await auth()
    const wishList = await getUserAllWishlist((session?.user as { id: string }).id, true)
    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-3">
                    <HiOutlineHeart className="w-8 h-8 text-primary" />
                    My Wishlist
                </h1>
                <p className="text-base-content/60 mt-1">Products you&apos;ve saved for later</p>
            </div>

            {/* Wishlist Content Card */}
            <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-base-300/50 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
                    <h2 className="font-semibold text-base-content">Saved Items</h2>
                    <span className="badge badge-primary badge-outline">
                        {wishList?.items?.length ?? 0} {(wishList?.items?.length ?? 0) === 1 ? 'item' : 'items'}
                    </span>
                </div>
                <div className="p-4 sm:p-6 min-h-[400px]">
                    <WishlistProductList itemIds={wishList?.itemIds ?? []} productList={wishList?.items ?? []} />
                </div>
            </div>
        </div>
    )
}

export default WishListPage