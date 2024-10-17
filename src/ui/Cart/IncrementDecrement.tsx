"use client"
import deleteProductFromCart from '@/backend/serverActions/deleteProductFromCart'
import increaseDeacreaseCartItem from '@/backend/serverActions/increaseDeacreaseCartItem'
import CartDataModel from '@/types/CartDataModel'
import onPageNotifications from '@/utils/onPageNotifications'
import React from 'react'

const IncrementDecrement = ({ item }: { item: CartDataModel, }) => {
    const removeCartItem = async (id: string) => {
        await deleteProductFromCart(id).then((res) => {
            onPageNotifications("success", "Product Deleted")
            window.location.reload()
        }).catch(err => {
            onPageNotifications("error", "Something Went Wrong.")
        })
    }
    const incrementQuantity = () => {
        if (item.quantity < 10) {
            increaseDeacreaseCartItem(item._id, 1).then(() => {
                window.location.reload()
            })
        } else {
            onPageNotifications("info", "Large Quantity Can Only Be Ordered Using Bulk Request")
        }
    }

    const decrementQuantity = () => {
        if (item.quantity > 1) {
            increaseDeacreaseCartItem(item._id, -1).then(() => {
                window.location.reload()
            })
        } else {
            removeCartItem(item._id)
        }
    }
    return (
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 justify-center">
            <svg
                className="fill-current text-gray-600 w-3 cursor-pointer"
                viewBox="0 0 448 512"
                onClick={_ => decrementQuantity()}
            >
                <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
            </svg>
            <input
                className="mx-2 input input-sm input-bordered border text-center w-16"
                type="text"
                value={item.quantity}
                readOnly
            />
            <svg
                className="fill-current text-gray-600 w-3 cursor-pointer"
                viewBox="0 0 448 512"
                onClick={_ => incrementQuantity()}
            >
                <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
            </svg>
        </div>
    )
}

export default IncrementDecrement