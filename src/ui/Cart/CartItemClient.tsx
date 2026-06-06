'use client'

import CartDataModel from '@/types/CartDataModel'
import Currency from '@/types/Currency'
import CartLineItem from './CartLineItem'

const CartItemClient = ({ item, userCurrency }: { item: CartDataModel, userCurrency: Currency }) => (
    <CartLineItem item={item} userCurrency={userCurrency} />
)

export default CartItemClient
