import React from 'react'
import OrderProcessItem from './OrderProcessItem'
import clsx from 'clsx'
import Image from 'next/image'
import order_Process_side from '../../../../static_assets/order-process.webp'
import SectionTitle from '@/ui/SectionTitle'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const OrderProcessSection = async () => {
    const t = await getTranslations('orderProcess')
    const tHome = await getTranslations('homepage')
    const orderrocess = [
        {
            icon: "ShieldLock.svg",
            title: t('securePayments'),
            description: t('securePaymentsDesc')
        },
        {
            icon: "EasyReturn.svg",
            title: t('easyReturn'),
            description: t('easyReturnDesc')
        },
        {
            icon: "FreeShipping.svg",
            title: t('freeShipping'),
            description: t('freeShippingDesc')
        },
        {
            icon: "SafeDelivery.svg",
            title: t('safeDelivery'),
            description: t('safeDeliveryDesc')
        }
    ]
    return (
        <div className='fluid_container relative ~py-5/14 ~px-5/0'>
            <div className='~text-lg/3xl max-w-3xl mx-auto font-semibold text-center ~py-5/10'>{tHome('consideringRugs')} <h2 className='inline'><Link href='/'>{tHome('juteRugs')}</Link></h2>, <h2 className='inline'><Link href='/'>{tHome('kilimRugs')}</Link></h2> and <h2 className='inline'><Link href="/" >{tHome('cushionCovers')}</Link></h2></div>
            <div className='flex flex-col gap-5 md:~max-w-xl/3xl'>
                {
                    orderrocess.map((order, index) => (
                        <OrderProcessItem key={index} className={clsx({ 'self-end max-md:flex-row-reverse': index % 2 == 1 })} {...order} />
                    ))
                }
            </div>
            <Image src={order_Process_side} alt='Order Process Site' className='absolute bottom-0 right-0 w-1/2 max-md:hidden' />
        </div>
    )
}

export default OrderProcessSection