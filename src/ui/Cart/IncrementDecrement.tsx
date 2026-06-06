"use client"
import deleteProductFromCart from '@/backend/serverActions/deleteProductFromCart'
import increaseDeacreaseCartItem from '@/backend/serverActions/increaseDeacreaseCartItem'
import CartDataModel from '@/types/CartDataModel'
import onPageNotifications from '@/utils/onPageNotifications'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { HiMinus, HiPlus } from 'react-icons/hi2'

const UpdatingDot = () => <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-label="Updating" />

const IncrementDecrement = ({ item }: { item: CartDataModel, }) => {
    const router = useRouter()
    const [quantity, updateQuantity] = useState(item.quantity)
    const [isLoading, setIsLoading] = useState(false)

    const removeCartItem = async (id: string) => {
        setIsLoading(true)
        await deleteProductFromCart(id).then((res) => {
            if (!res?.ack) {
                throw new Error('Failed to delete cart item')
            }
            onPageNotifications("success", "Product Deleted")
            router.refresh()
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
            increaseDeacreaseCartItem(item._id, 1).then((res) => {
                if (!res?.ack) {
                    throw new Error('Failed to increase quantity')
                }
                router.refresh()
            }).catch(() => {
                updateQuantity(quantity)
                setIsLoading(false)
            })
        } else {
            onPageNotifications("info", "Large Quantity Can Only Be Ordered Using Bulk Request")
        }
    }

    const decrementQuantity = async () => {
        if (isLoading) return
        if (quantity <= 1) {
            await removeCartItem(item._id)
            return
        }

        setIsLoading(true)
        updateQuantity(quantity - 1)
        increaseDeacreaseCartItem(item._id, -1).then((res) => {
            if (!res?.ack) {
                throw new Error('Failed to decrease quantity')
            }
            router.refresh()
        }).catch(() => {
            updateQuantity(quantity)
            setIsLoading(false)
        })
    }

    return (
        <div className="inline-flex items-center overflow-hidden rounded-md border border-primary/10 bg-base-100">
            <button
                onClick={decrementQuantity}
                disabled={isLoading}
                className="flex h-9 w-9 items-center justify-center text-base-content/70 transition-colors hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Decrease quantity"
            >
                <HiMinus className="w-4 h-4" />
            </button>
            <div className="flex h-9 w-12 items-center justify-center border-x border-primary/10 text-sm font-semibold text-base-content">
                {isLoading ? (
                    <UpdatingDot />
                ) : (
                    quantity
                )}
            </div>
            <button
                onClick={incrementQuantity}
                disabled={isLoading || quantity >= 10}
                className="flex h-9 w-9 items-center justify-center text-base-content/70 transition-colors hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Increase quantity"
            >
                <HiPlus className="w-4 h-4" />
            </button>
        </div>
    )
}

export default IncrementDecrement
