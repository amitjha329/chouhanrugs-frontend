// @ts-nocheck
"use client"
import deleteProductFromCart from '@/backend/serverActions/deleteProductFromCart'
import CartDataModel from '@/types/CartDataModel'
import onPageNotifications from '@/utils/onPageNotifications'
import React, { useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi2'

const UpdatingDot = () => <span className="h-2 w-2 animate-pulse rounded-full bg-error" aria-label="Removing" />

const DeleteFromCartLg = ({ item }: { item: CartDataModel }) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const removeCartItem = async (id: string) => {
        setIsDeleting(true)
        await deleteProductFromCart(id).then((res) => {
            onPageNotifications("success", "Product Deleted")
        }).catch(err => {
            onPageNotifications("error", "Something Went Wrong.")
            setIsDeleting(false)
        })
    }

    return (
        <button 
            className="inline-flex h-8 items-center gap-2 rounded-md border border-error/15 px-3 text-sm font-semibold text-error transition hover:bg-error/5 disabled:opacity-50"
            onClick={() => removeCartItem(item._id)}
            disabled={isDeleting}
        >
            {isDeleting ? (
                <UpdatingDot />
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
        }).catch(err => {
            onPageNotifications("error", "Something Went Wrong.")
            setIsDeleting(false)
        })
    }

    return (
        <button 
            className="inline-flex h-8 items-center justify-center rounded-md border border-error/15 px-2.5 text-error transition hover:bg-error/5 disabled:opacity-50"
            onClick={() => removeCartItem(item._id)}
            disabled={isDeleting}
            title="Remove from cart"
        >
            {isDeleting ? (
                <UpdatingDot />
            ) : (
                <HiOutlineTrash className="w-5 h-5" />
            )}
        </button>
    )
}

export { DeleteFromCartSm, DeleteFromCartLg }
