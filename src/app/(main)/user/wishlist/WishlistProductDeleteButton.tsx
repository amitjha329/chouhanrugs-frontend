"use client"
import deleteProductFromWishlist from '@/backend/serverActions/deleteProductFromWishlist'
import onPageNotifications from '@/utils/onPageNotifications'
import React from 'react'
import { ImBin } from 'react-icons/im'

const WishlistProductDeleteButton = ({ productId, userId }: { productId: string, userId: string }) => {
    return (
        <div className='btn btn-sm rounded-none max-sm:w-full sm:h-20 btn-error btn-outline' onClick={e => {
            e.preventDefault()
            deleteProductFromWishlist(productId, userId).then(res => {
                window.location.reload()
            }).catch(e => {
                console.log(e)
                onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
            })
        }}><ImBin className='w-4 h-4' /></div>
    )
}

export default WishlistProductDeleteButton