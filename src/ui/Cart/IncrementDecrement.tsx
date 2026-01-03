"use client"
import deleteProductFromCart from '@/backend/serverActions/deleteProductFromCart'
import increaseDeacreaseCartItem from '@/backend/serverActions/increaseDeacreaseCartItem'
import CartDataModel from '@/types/CartDataModel'
import onPageNotifications from '@/utils/onPageNotifications'
import React, { useState } from 'react'
import { HiMinus, HiPlus } from 'react-icons/hi2'

const IncrementDecrement = ({ item }: { item: CartDataModel, }) => {
    const [quantity, updateQuantity] = useState(item.quantity)
    const [isLoading, setIsLoading] = useState(false)

    const removeCartItem = async (id: string) => {
        setIsLoading(true)
        await deleteProductFromCart(id).then((res) => {
            onPageNotifications("success", "Product Deleted")
            window.location.reload()
        }).catch(err => {
            onPageNotifications("error", "Something Went Wrong.")
            setIsLoading(false)
        })
    }

    const incrementQuantity = () => {
        if (isLoading) return
        if (quantity < 10) {
            setIsLoading(true)
            updateQuantity(quantity + 1)
            increaseDeacreaseCartItem(item._id, 1).then(() => {
                window.location.reload()
            }).catch(() => {
                updateQuantity(quantity)
                setIsLoading(false)
            })
        } else {
            onPageNotifications("info", "Large Quantity Can Only Be Ordered Using Bulk Request")
        }
    }

    const decrementQuantity = () => {
        if (isLoading) return
        if (quantity > 1) {
            setIsLoading(true)
            updateQuantity(quantity - 1)
            increaseDeacreaseCartItem(item._id, -1).then(() => {
                window.location.reload()
            }).catch(() => {
                updateQuantity(quantity)
                setIsLoading(false)
            })
        } else {
            removeCartItem(item._id)
        }
    }

    return (
        <div className="inline-flex items-center rounded-lg border border-base-300 bg-base-100 overflow-hidden">
            <button
                onClick={decrementQuantity}
                disabled={isLoading}
                className="flex items-center justify-center w-9 h-9 text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
            >
                <HiMinus className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center w-12 h-9 text-sm font-semibold text-base-content border-x border-base-300 bg-base-50">
                {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                ) : (
                    quantity
                )}
            </div>
            <button
                onClick={incrementQuantity}
                disabled={isLoading || quantity >= 10}
                className="flex items-center justify-center w-9 h-9 text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
            >
                <HiPlus className="w-4 h-4" />
            </button>
        </div>
    )
}

export default IncrementDecrement