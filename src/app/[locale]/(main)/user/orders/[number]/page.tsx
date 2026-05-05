import getUserOrderWithId from '@/backend/serverActions/getUserOrderWithId'
import { notFound } from 'next/navigation'
import React from 'react'
import UserOrderView from './UserOrderView'
import { getLocale } from 'next-intl/server'
import { type Locale } from '@/i18n/routing'
import { connection } from 'next/server'

const OrderViewPage = async (props: { params: Promise<{ number: string }> }) => {
    await connection()
    const params = await props.params;
    const orderItem = await getUserOrderWithId(params.number)
    if (orderItem == undefined) return notFound()
    const locale = await getLocale() as Locale
    return (
        <UserOrderView orderItem={orderItem} productsList={orderItem.productsList} shippingAddress={orderItem.shipping} locale={locale} />
    )
}

export default OrderViewPage
