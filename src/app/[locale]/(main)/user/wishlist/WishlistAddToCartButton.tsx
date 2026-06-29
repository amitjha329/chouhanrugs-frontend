'use client'

import React, { useState, useMemo } from 'react'
import { ProductDataModel } from '@/types/ProductDataModel'
import onPageNotifications from '@/utils/onPageNotifications'
import { FiShoppingCart } from 'react-icons/fi'

export default function WishlistAddToCartButton({
    product,
    userId
}: {
    product: ProductDataModel
    userId?: string
}) {
    const variations = product.variations || []
    const hasVariations = variations.length > 0

    // Extract unique colors and sizes
    const uniqueColors = useMemo(() => {
        return Array.from(new Set(variations.map(v => v.variationColor).filter(Boolean))) as string[]
    }, [variations])

    const uniqueSizes = useMemo(() => {
        return Array.from(new Set(variations.map(v => v.variationSize).filter(Boolean))) as string[]
    }, [variations])

    // Pre-select if there is only 1 option available
    const [selectedColor, setSelectedColor] = useState(uniqueColors.length === 1 ? uniqueColors[0] : '')
    const [selectedSize, setSelectedSize] = useState(uniqueSizes.length === 1 ? uniqueSizes[0] : '')
    const [isAdding, setIsAdding] = useState(false)

    // Find the matching variation object
    const selectedVariation = useMemo(() => {
        if (!hasVariations) return null
        return variations.find(v => 
            (!uniqueColors.length || v.variationColor === selectedColor) &&
            (!uniqueSizes.length || v.variationSize === selectedSize)
        )
    }, [selectedColor, selectedSize, variations, uniqueColors, uniqueSizes, hasVariations])

    // Determine if the add to cart button should be enabled
    const canAddToCart = !hasVariations || !!selectedVariation

    const handleAddToCart = async () => {
        if (!canAddToCart) return
        setIsAdding(true)

        const variationCode = selectedVariation ? selectedVariation.variationCode : ''
        const prodId = typeof product._id === 'string' ? product._id : product._id?.toString?.() || ''

        if (!userId) {
            // Guest user: save to local storage cart
            try {
                let pendingCart: any[] = JSON.parse(localStorage.getItem('pending_cart') || '[]')
                const newItem = {
                    productId: prodId,
                    quantity: 1,
                    variation: variationCode,
                    selectedColor,
                    selectedSize,
                    productData: product,
                    action: 'add_to_cart'
                }
                const existingIndex = pendingCart.findIndex((item: any) =>
                    item.productId === newItem.productId &&
                    item.variation === newItem.variation &&
                    item.selectedColor === newItem.selectedColor &&
                    item.selectedSize === newItem.selectedSize
                )
                if (existingIndex !== -1) {
                    pendingCart[existingIndex].quantity += 1
                } else {
                    pendingCart.push(newItem)
                }
                localStorage.setItem('pending_cart', JSON.stringify(pendingCart))
                window.dispatchEvent(new Event('local-cart-updated'))
                await onPageNotifications('success', 'Item added to cart.')
                window.location.reload()
            } catch (err) {
                console.error(err)
                await onPageNotifications('error', 'Failed adding to cart.')
            } finally {
                setIsAdding(false)
            }
            return
        }

        // Authenticated user: save to server database cart
        try {
            const res = await fetch('/api/user/addtocart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: prodId, userId, quantity: 1, variationCode })
            })
            if (res.ok) {
                await onPageNotifications('success', 'Item added to cart.')
                window.location.reload()
            } else {
                await onPageNotifications('error', 'Failed adding to cart.')
            }
        } catch (err) {
            console.error(err)
            await onPageNotifications('error', 'Failed adding to cart.')
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className="flex flex-col gap-2 mt-2 w-full max-w-sm sm:max-w-md">
            {/* Show variation selection dropdowns if variations exist */}
            {hasVariations && (
                <div className="flex flex-wrap gap-2">
                    {uniqueColors.length > 0 && (
                        <div className="flex-1 min-w-[120px]">
                            <select
                                className="select select-bordered select-xs w-full text-xs"
                                value={selectedColor}
                                onChange={e => setSelectedColor(e.target.value)}
                                disabled={isAdding}
                            >
                                <option value="">Select Color</option>
                                {uniqueColors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {uniqueSizes.length > 0 && (
                        <div className="flex-1 min-w-[120px]">
                            <select
                                className="select select-bordered select-xs w-full text-xs"
                                value={selectedSize}
                                onChange={e => setSelectedSize(e.target.value)}
                                disabled={isAdding}
                            >
                                <option value="">Select Size</option>
                                {uniqueSizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}

            {/* Add to Cart Button */}
            <button
                type="button"
                className={`btn btn-primary btn-sm flex items-center justify-center gap-2 w-full ${!canAddToCart ? 'btn-disabled' : ''}`}
                disabled={!canAddToCart || isAdding}
                onClick={handleAddToCart}
            >
                {isAdding ? (
                    <span className="loading loading-spinner loading-xs" />
                ) : (
                    <FiShoppingCart className="w-4 h-4" />
                )}
                {hasVariations && !canAddToCart ? 'Select Option' : 'Add to Cart'}
            </button>
        </div>
    )
}
