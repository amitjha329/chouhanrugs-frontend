// @ts-nocheck
"use client"
import deleteProductFromWishlist from '@/backend/serverActions/deleteProductFromWishlist'
import onPageNotifications from '@/utils/onPageNotifications'
import React from 'react'
import { ImBin } from 'react-icons/im'

const WishlistProductDeleteButton = ({ productId, userId }: { productId: string, userId: string }) => {
    return (
        <button
            className="btn rounded-lg w-full sm:w-14 sm:h-14 md:w-16 md:h-16 btn-error btn-outline flex items-center justify-center gap-1 hover:bg-red-500 hover:text-white transition-colors shadow-sm text-xs sm:text-sm"
            onClick={e => {
                e.preventDefault()
                deleteProductFromWishlist(productId, userId).then(res => {
                    window.location.reload()
                }).catch(e => {
                    console.log(e)
                    onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
                })
            }}
            aria-label="Remove from wishlist"
            title="Remove from wishlist"
        >
            <ImBin className="w-3 h-3" />
            <span className="sr-only">Remove</span>
        </button>
    )
}

export default WishlistProductDeleteButton