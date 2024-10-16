import { auth } from '@/auth'
import { Metadata } from 'next'
import React from 'react'
import UserAllOrders from './UserAllOrders'
import getUserOrdersList from '@/backend/serverActions/getUserOrdersList'

export const metadata:Metadata = {
    title:"My Orders"
}

const UserOrdersPage = async () => {
    const session = await auth()
    const orderItems = await getUserOrdersList((session?.user as { id: string }).id)
    return (
        <UserAllOrders className="basis-full lg:basis-3/4" orderItems={orderItems} />
    )
}

export default UserOrdersPage