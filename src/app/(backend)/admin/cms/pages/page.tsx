import PagesTable from '@/ui/backend/Tables/PagesTable'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Page Settings',
}

const PageSettings = () => {
    return (
        <>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
                <div className='card-body'>
                    <PagesTable />
                </div>
            </div>
        </>
    )
}

export default PageSettings