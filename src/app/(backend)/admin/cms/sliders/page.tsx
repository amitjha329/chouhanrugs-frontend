import SliderList from '@/ui/backend/Tables/SliderList'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Sliders & Headers',
}

const SiteSettings = () => {
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <SliderList />
            </div>
        </div>
    )
}

export default SiteSettings