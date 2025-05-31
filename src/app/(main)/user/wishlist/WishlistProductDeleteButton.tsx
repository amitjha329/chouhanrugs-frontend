// @ts-nocheck
"use client"
import deleteProductFromWishlist from '@/backend/serverActions/deleteProductFromWishlist'
import onPageNotifications from '@/utils/onPageNotifications'
import React from 'react'
import { ImBin } from 'react-icons/im'

const WishlistProductDeleteButton = ({ productId, userId }: { productId: string, userId: string }) => {
    return (
        <button
            className="btn rounded-xl max-sm:w-full btn-error btn-outline flex items-center gap-2 hover:bg-red-500 hover:text-white transition-colors shadow-sm h-24 w-24"
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
            <ImBin className="w-4 h-4" />
            <span className="sr-only">Remove</span>
        </button>
    )
}

export default WishlistProductDeleteButton