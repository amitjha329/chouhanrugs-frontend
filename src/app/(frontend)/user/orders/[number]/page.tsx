import getProductWithId from '@/lib/actions/getProductWithId'
import getUserAddressWithId from '@/lib/actions/getUserAddressWithId'
import getUserOrderWithId from '@/lib/actions/getUserOrderWithId'
import UserOrderView from '@/ui/frontend/Sections/UserOrderView'
import { notFound } from 'next/navigation'
import React from 'react'

const OrderViewPage = async ({ params }: { params: { number: string } }) => {
    const orderItem = await getUserOrderWithId(params.number)
    if(orderItem == undefined) return notFound()
    const productPromiseList = orderItem.products.map(item => getProductWithId(item.productId))
    const productsList = await Promise.all(productPromiseList)
    const shippingAddress = await getUserAddressWithId(orderItem.shippingAddress)
    return (
        <UserOrderView orderItem={orderItem} productsList={productsList} shippingAddress={shippingAddress} />
    )
}

export default OrderViewPage