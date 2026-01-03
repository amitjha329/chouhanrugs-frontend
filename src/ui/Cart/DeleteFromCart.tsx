// @ts-nocheck
"use client"
import deleteProductFromCart from '@/backend/serverActions/deleteProductFromCart'
import CartDataModel from '@/types/CartDataModel'
import onPageNotifications from '@/utils/onPageNotifications'
import React, { useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi2'

const DeleteFromCartLg = ({ item }: { item: CartDataModel }) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const removeCartItem = async (id: string) => {
        setIsDeleting(true)
        await deleteProductFromCart(id).then((res) => {
            onPageNotifications("success", "Product Deleted")
            window.location.reload()
        }).catch(err => {
            onPageNotifications("error", "Something Went Wrong.")
            setIsDeleting(false)
        })
    }

    return (
        <button 
            className="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-2"
            onClick={() => removeCartItem(item._id)}
            disabled={isDeleting}
        >
            {isDeleting ? (
                <span className="loading loading-spinner loading-xs"></span>
            ) : (
                <HiOutlineTrash className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">Remove</span>
        </button>
    )
}

const DeleteFromCartSm = ({ item }: { item: CartDataModel }) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const removeCartItem = async (id: string) => {
        setIsDeleting(true)
        await deleteProductFromCart(id).then((res) => {
            onPageNotifications("success", "Product Deleted")
            window.location.reload()
        }).catch(err => {
            onPageNotifications("error", "Something Went Wrong.")
            setIsDeleting(false)
        })
    }

    return (
        <button 
            className="btn btn-ghost btn-sm text-error hover:bg-error/10"
            onClick={() => removeCartItem(item._id)}
            disabled={isDeleting}
            title="Remove from cart"
        >
            {isDeleting ? (
                <span className="loading loading-spinner loading-xs"></span>
            ) : (
                <HiOutlineTrash className="w-5 h-5" />
            )}
        </button>
    )
}

export { DeleteFromCartSm, DeleteFromCartLg }