import React from 'react'
import OrderProcessItem from './OrderProcessItem'
import clsx from 'clsx'
import Image from 'next/image'
import order_Process_side from '../../../../static_assets/order-process.webp'
import SectionTitle from '@/ui/SectionTitle'
import Link from 'next/link'

const OrderProcessSection = () => {
    const orderrocess = [
        {
            icon: "ShieldLock.svg",
            title: "Secure Payments",
            description: "All your Transactions are secure with scure gateways like Razorpay and Stripe."
        },
        {
            icon: "EasyReturn.svg",
            title: "Easy Return",
            description: "All of your orders are eligible for easy return policy giving you complete peace of mind."
        },
        {
            icon: "FreeShipping.svg",
            title: "Free Shipping",
            description: "All of our Rugs will reach you wherever you are in the world like US, UK, Australia, etc. as fast as possible and at no extra cost."
        },
        {
            icon: "SafeDelivery.svg",
            title: "Safe Delivery",
            description: "Always be sure that your product will reach you with complete safety."
        }
    ]
    return (
        <div className='fluid_container relative ~py-5/14 ~px-5/0'>
            <div className='~text-lg/3xl max-w-3xl mx-auto font-semibold text-center ~py-5/10'>Considering Rugs for your Kitchen, Living Room, and Bed Room look at our extensive collection of <h2 className='inline'><Link href='/'>Jute Rugs</Link></h2>, <h2 className='inline'><Link href='/'>Kilim Rugs</Link></h2> and <h2 className='inline'><Link href="/" >Cushions Covers</Link></h2></div>
            <div className='flex flex-col gap-5 md:~max-w-xl/3xl'>
                {
                    orderrocess.map((order, index) => (
                        <OrderProcessItem key={order.title} className={clsx({ 'self-end max-md:flex-row-reverse': index % 2 == 1 })} {...order} />
                    ))
                }
            </div>
            <Image src={order_Process_side} alt='Order Process Site' className='absolute bottom-0 right-0 w-1/2 max-md:hidden' />
        </div>
    )
}

export default OrderProcessSection