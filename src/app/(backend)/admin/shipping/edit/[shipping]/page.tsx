import getShippingWithId from '@/lib/actions/getShippingWithId'
import ShippingForm from '@/ui/backend/Forms/ShippingForm'
import React from 'react'

const NewShipping = async ({ params }: { params: { shipping: string } }) => {
    const shippingData = await getShippingWithId(params.shipping)
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <div className='card-title'>
                    Enter Shipping Details
                </div>
                <ShippingForm shippingData={shippingData} />
            </div>
        </div>
    )
}

export default NewShipping