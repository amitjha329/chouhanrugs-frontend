import React from 'react'
import OrderProcessItem from './OrderProcessItem'
import clsx from 'clsx'
import Image from 'next/image'
import order_Process_side from '../../../../static_assets/cardboard-boxes.webp'
import SectionTitle from '@/ui/SectionTitle'

const WhatDoWeProvideSection = () => {
    const orderrocess = [
        {
            icon: "custom_size.svg",
            title: "Custom Product Size",
            description: "With the bespoke products and sizes offered by us, find the ideal match for your area. Customize our magnificent hemp, cotton, and jute rugs to meet your exact requirements. Add a personal touch to your décor and make sure that every Chouhan Rugs product complements your unique style and space needs."
        },
        {
            icon: "fast_support.svg",
            title: "Fast Support",
            description: "We offer steadfast assistance at any time. Our 24/7 customer service guarantees help anytime you need it. You can rely on us to provide you with timely, dependable service so that you can enjoy your time exploring our amazing selection of hemp, cotton, and jute rugs,  jute pillow covers among other options."
        },
        {
            icon: "free_shipping.svg",
            title: "Free Shipping Across The Globe",
            description: "Experience the elegance of Chouhan Rugs at your door thanks to our free international delivery. Take advantage of free worldwide shipping to ensure that your finely made jute rugs, cotton rugs, hemp rugs, and other jute products arrive without incident and improve your space no matter where you are need."
        }
    ]
    return (
        <div className='fluid_container relative ~py-5/14 ~px-5/0'>
            <SectionTitle title='What do we Provide?' className='md:text-center ~py-5/10' />
            <div className='flex flex-col gap-5 md:~max-w-xl/3xl z-20 relative'>
                {
                    orderrocess.map((order, index) => (
                        <OrderProcessItem key={order.title} className={clsx({ 'self-end max-md:flex-row-reverse': index % 2 == 1 })} {...order} />
                    ))
                }
            </div>
            <Image src={order_Process_side} alt='Order Process Site' className='absolute bottom-0 right-0 w-2/5 max-md:hidden z-10' />
        </div>
    )
}

export default WhatDoWeProvideSection