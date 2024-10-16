import React from 'react'
import TrackOrderForm from './TrackOrderForm'

const TrackOrderPage = () => {
    return (
        <>
            <div className="w-full flex flex-col items-center justify-center mt-14 px-10">
                <div className="text-4xl font-bold mb-8">Track Order</div>
                <div className="text-xl text-center">Enter your order number to trach the current status of any placed oredr on the site and Download Invoice.</div>
            </div>
            <div className='w-full flex flex-col items-center justify-center mt-14 px-10 pb-10 gap-5'>
                <TrackOrderForm />
            </div>
        </>
    )
}

export default TrackOrderPage