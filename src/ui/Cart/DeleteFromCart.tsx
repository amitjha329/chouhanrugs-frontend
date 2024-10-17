"use client"
import deleteProductFromCart from '@/backend/serverActions/deleteProductFromCart'
import CartDataModel from '@/types/CartDataModel'
import onPageNotifications from '@/utils/onPageNotifications'
import React from 'react'
import { BsTrash } from 'react-icons/bs'

const DeleteFromCartLg = ({ item }: { item: CartDataModel }) => {
    const removeCartItem = async (id: string) => {
        await deleteProductFromCart(id).then((res) => {
            onPageNotifications("success", "Product Deleted")
            window.location.reload()
        }).catch(err => {
            onPageNotifications("error", "Something Went Wrong.")
        })
    }
    return (
        <div className='hidden sm:flex shrink items-center justify-center w-20 sm:px-[1.875rem] sm:py-16 btn btn-error btn-outline rounded-none' onClick={_ => { removeCartItem(item._id) }}>
            <BsTrash className='w-5 h-5' />
        </div>
    )
}

const DeleteFromCartSm = ({ item }: { item: CartDataModel }) => {
    const removeCartItem = async (id: string) => {
        await deleteProductFromCart(id).then((res) => {
            onPageNotifications("success", "Product Deleted")
            window.location.reload()
        }).catch(err => {
            onPageNotifications("error", "Something Went Wrong.")
        })
    }
    return (
        <div className='hidden sm:flex shrink items-center justify-center w-20 sm:px-[1.875rem] sm:py-16 btn btn-error btn-outline rounded-none' onClick={_ => { removeCartItem(item._id) }}>
            <BsTrash className='w-5 h-5' />
        </div>
    )
}

export { DeleteFromCartSm, DeleteFromCartLg }