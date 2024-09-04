import getOrdersList from '@/lib/actions/getOrdersList'
import OrderListTable from '@/ui/backend/Tables/OrderListTable'
import { Metadata } from 'next'
import React from 'react'

export const metadata:Metadata={
    title:"All Orders"
}

const AdminAllOrderPage = async () => {
    const orderData = await getOrdersList()
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <OrderListTable orderList={orderData} pageTitle='All Orders' />
            </div>
        </div>
    )
}

export default AdminAllOrderPage