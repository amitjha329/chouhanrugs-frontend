import React from 'react'
import TrackOrderForm from './TrackOrderForm'
import { getTranslations } from 'next-intl/server'

const TrackOrderPage = async () => {
    const t = await getTranslations('trackOrder')
    return (
        <>
            <div className="w-full flex flex-col items-center justify-center mt-14 px-10">
                <div className="text-4xl font-bold mb-8">{t('title')}</div>
                <div className="text-xl text-center">{t('description')}</div>
            </div>
            <div className='w-full flex flex-col items-center justify-center mt-14 px-10 pb-10 gap-5'>
                <TrackOrderForm />
            </div>
        </>
    )
}

export default TrackOrderPage