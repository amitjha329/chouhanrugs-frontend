import React from 'react'
import OrderProcessItem from './OrderProcessItem'
import clsx from 'clsx'
import Image from '@/ui/components/OptimizedImage'
import order_Process_side from '../../../../static_assets/order-process.webp'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { type Locale } from '@/i18n/routing'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { getHomePageOrderProcessInformation } from '@/backend/serverActions/getHomePageOrderProcessInformation'

const OrderProcessSection = async () => {
    const [t, tHome, loc, data] = await Promise.all([
        getTranslations('orderProcess'),
        getTranslations('homepage'),
        getLocale(),
        getHomePageOrderProcessInformation(),
    ])
    const locale = loc as Locale

    const resolvedTitle = data?.title ? resolveLocalizedString(data.title, locale) : null
    const HeadingTag = (data?.headingTag || "h2") as any

    const stepsData = data?.steps
    const orderrocess = stepsData
        ? [
            {
                icon: stepsData.stepOne.icon || "ShieldLock.svg",
                title: resolveLocalizedString(stepsData.stepOne.title, locale) || t('securePayments'),
                description: resolveLocalizedString(stepsData.stepOne.description, locale) || t('securePaymentsDesc')
            },
            {
                icon: stepsData.stepTwo.icon || "EasyReturn.svg",
                title: resolveLocalizedString(stepsData.stepTwo.title, locale) || t('easyReturn'),
                description: resolveLocalizedString(stepsData.stepTwo.description, locale) || t('easyReturnDesc')
            },
            {
                icon: stepsData.stepThree.icon || "FreeShipping.svg",
                title: resolveLocalizedString(stepsData.stepThree.title, locale) || t('freeShipping'),
                description: resolveLocalizedString(stepsData.stepThree.description, locale) || t('freeShippingDesc')
            },
            {
                icon: stepsData.stepFour.icon || "SafeDelivery.svg",
                title: resolveLocalizedString(stepsData.stepFour.title, locale) || t('safeDelivery'),
                description: resolveLocalizedString(stepsData.stepFour.description, locale) || t('safeDeliveryDesc')
            }
        ]
        : [
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
            {resolvedTitle ? (
                <HeadingTag className='~text-lg/3xl max-w-3xl mx-auto font-semibold text-center ~py-5/10'>
                    {resolvedTitle}
                </HeadingTag>
            ) : (
                <HeadingTag className='~text-lg/3xl max-w-3xl mx-auto font-semibold text-center ~py-5/10'>
                    {tHome('consideringRugs')}{' '}
                    <strong className='inline font-semibold'><Link href='/'>{tHome('juteRugs')}</Link></strong>,{' '}
                    <strong className='inline font-semibold'><Link href='/'>{tHome('kilimRugs')}</Link></strong> and{' '}
                    <strong className='inline font-semibold'><Link href="/">{tHome('cushionCovers')}</Link></strong>
                </HeadingTag>
            )}
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