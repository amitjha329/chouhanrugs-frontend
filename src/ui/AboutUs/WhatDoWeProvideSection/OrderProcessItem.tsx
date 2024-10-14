import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React from 'react'

const OrderProcessItem = ({
    description, icon, title, className
}: {
    icon: string,
    title: string,
    description: string,
    className?: string
}) => {
    return (
        <div className={clsx(className, 'flex items-center gap-10')}>
            <div className='aspect-square rounded-full p-7 bg-secondary/70'>
                <Image src={`/vector/${icon}`} alt={title} width={60} height={60} />
            </div>
            <div className='flex flex-col'>
                <span className='text-primary'>{title}</span>
                <span className='text-xs text-gray-500 max-w-sm'>{description}</span>
            </div>
        </div>
    )
}

export default OrderProcessItem