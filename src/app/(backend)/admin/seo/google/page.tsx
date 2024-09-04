import getAnalyticsData from '@/lib/actions/getAnalyticsData'
import GTMForm from '@/ui/backend/Forms/GTMForm'
import GVerificationForm from '@/ui/backend/Forms/GVerificationForm'
import clsx from 'clsx'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Google Tag Manager Configuration',
}

const GoogleTagManager = async () => {
    const GoogleTagData = await getAnalyticsData("GTM")
    const GoogleVerData = await getAnalyticsData("GOOGLE_VER")
    return (
        <>
            <div className={clsx('card card-normal bg-white', 'shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)]')}>
                <GTMForm data={GoogleTagData} />
            </div>
            <div className={clsx('card card-normal bg-white', 'shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)] mt-4')}>
                <GVerificationForm data={GoogleVerData} />
            </div>
        </>
    )
}

export default GoogleTagManager