import getAnalyticsData from '@/lib/actions/getAnalyticsData'
import BingForm from '@/ui/backend/Forms/BingForm'
import clsx from 'clsx'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Google Tag Manager Configuration',
}

const GoogleTagManager = async () => {
    const BingTagData = await getAnalyticsData("BING")
    return (
        <>
            <div className={clsx('card card-normal bg-white', 'shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)]')}>
                <BingForm data={BingTagData} />
            </div>
        </>
    )
}

export default GoogleTagManager