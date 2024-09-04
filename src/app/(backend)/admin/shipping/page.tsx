import getShippingList from '@/lib/actions/getShippingList'
import ShippingListTable from '@/ui/backend/Tables/ShippingListTable'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: "Shipping Charges Management"
}
const ShippingmanagementPage = async () => {
    const shippingList = await getShippingList()
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <ShippingListTable shippingList={shippingList} />
            </div>
        </div>
    )
}

export default ShippingmanagementPage