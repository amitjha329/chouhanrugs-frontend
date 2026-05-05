import { getSession } from '@/lib/auth-server'
import { Metadata } from 'next'
import React from 'react'
import UserAllOrders from './UserAllOrders'
import getUserOrdersList from '@/backend/serverActions/getUserOrdersList'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'

export const metadata:Metadata = {
    title:"My Orders"
}

const UserOrdersPage = async () => {
    await connection()
    const session = await getSession()
    
    if (!session?.user || !(session.user as { id: string }).id) {
        redirect('/signin?cb=/user/orders')
    }
    
    const orderItems = await getUserOrdersList((session.user as { id: string }).id)
    return (
        <UserAllOrders orderItems={orderItems} />
    )
}

export default UserOrdersPage
