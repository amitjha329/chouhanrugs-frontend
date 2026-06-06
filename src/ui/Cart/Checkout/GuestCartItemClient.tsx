'use client'

import Currency from '@/types/Currency'
import CartLineItem from '../CartLineItem'

const GuestCartItemClient = ({ item, userCurrency, onQuantityChange, onRemove }: {
    item: any,
    userCurrency: Currency,
    onQuantityChange: (delta: number) => void,
    onRemove: () => void
}) => (
    <CartLineItem
        item={item}
        userCurrency={userCurrency}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
    />
)

export default GuestCartItemClient
