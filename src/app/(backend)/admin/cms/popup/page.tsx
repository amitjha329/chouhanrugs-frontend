import getPopupData from '@/lib/actions/getPopupData'
import PopupForm from '@/ui/backend/Forms/PopupForm'
import clsx from 'clsx'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Popup Settings',
}

const PopUpSettings = async () => {
    const popupData = await getPopupData()
    return (
        <div className={clsx('card card-normal bg-white', popupData.isActive ? "shadow-[inset_0_-2px_4px_rgba(0,255,0,0.5)]" : "shadow-[inset_0_-2px_4px_rgba(255,0,0,0.5)]")}>
            <div className='card-body'>
                <PopupForm popupData={popupData} />
            </div>
        </div>
    )
}

export default PopUpSettings