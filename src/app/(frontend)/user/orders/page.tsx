import getUserOrdersList from '@/lib/actions/getUserOrdersList'
import AuthOpts from '@/lib/adapters/AuthOptions'
import UserAllOrders from '@/ui/frontend/Sections/UserAllOrders'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import React from 'react'

export const metadata:Metadata = {
    title:"My Orders"
}

const UserOrdersPage = async () => {
    const session = await getServerSession(AuthOpts)
    const orderItems = await getUserOrdersList((session?.user as { id: string }).id)
    return (
        <UserAllOrders className="basis-full lg:basis-3/4" orderItems={orderItems} />
    )
}

export default UserOrdersPage