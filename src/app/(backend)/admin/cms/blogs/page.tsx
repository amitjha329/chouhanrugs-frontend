import BlogListTable from '@/ui/backend/Tables/BlogListTable'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Blog Manager',
}

const SiteSettings = () => {
    return (
        <>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
                <div className='card-body'>
                    <BlogListTable />
                </div>
            </div>
        </>
    )
}

export default SiteSettings