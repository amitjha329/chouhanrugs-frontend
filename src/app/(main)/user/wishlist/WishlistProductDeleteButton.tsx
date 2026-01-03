// @ts-nocheck
"use client"
import deleteProductFromWishlist from '@/backend/serverActions/deleteProductFromWishlist'
import onPageNotifications from '@/utils/onPageNotifications'
import React, { useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi2'

const WishlistProductDeleteButton = ({ productId, userId }: { productId: string, userId: string }) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        setIsDeleting(true)
        try {
            await deleteProductFromWishlist(productId, userId)
            window.location.reload()
        } catch (error) {
            console.log(error)
            await onPageNotifications("error", "Failed to remove from wishlist")
            setIsDeleting(false)
        }
    }

    return (
        <button
            className="btn btn-ghost btn-sm text-error hover:bg-error/10"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Remove from wishlist"
            title="Remove from wishlist"
        >
            {isDeleting ? (
                <span className="loading loading-spinner loading-xs"></span>
            ) : (
                <HiOutlineTrash className="w-5 h-5" />
            )}
        </button>
    )
}

export default WishlistProductDeleteButton