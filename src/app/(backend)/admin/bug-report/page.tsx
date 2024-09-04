import BugReportForm from '@/ui/backend/Forms/BugReportForm'
import BugReportTable from '@/ui/backend/Tables/BugReportTable'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Bug Reports',
}

const BugReportPage = async () => {
    return (
        <>
            <div className="card shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mb-8">
                <BugReportForm />
            </div>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
                <div className='card-body'>
                    <BugReportTable />
                </div>
            </div>
        </>
    )
}

export default BugReportPage