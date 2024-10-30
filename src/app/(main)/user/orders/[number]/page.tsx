import getUserOrderWithId from '@/backend/serverActions/getUserOrderWithId'
import { notFound } from 'next/navigation'
import React from 'react'
import UserOrderView from './UserOrderView'

const OrderViewPage = async (props: { params: Promise<{ number: string }> }) => {
    const params = await props.params;
    const orderItem = await getUserOrderWithId(params.number)
    if (orderItem == undefined) return notFound()
    return (
        <UserOrderView orderItem={orderItem} productsList={orderItem.productsList} shippingAddress={orderItem.shipping} />
    )
}

export default OrderViewPage