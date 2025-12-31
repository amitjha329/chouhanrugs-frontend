'use client'
// @ts-nocheck
import clsx from 'clsx'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { FaFileInvoiceDollar } from 'react-icons/fa'

const DownloadInvoiceButton = ({ orderId, className, text, iconDisplay }: { orderId: string, className: string, text: ReactNode, iconDisplay?: boolean }) => {
    return (
        <Link href={`/invoice/${orderId}`} className={className} target='_blank' onClick={(e) => e.stopPropagation()}>
            <FaFileInvoiceDollar className={clsx({ "hidden": !iconDisplay })} /> {text}
        </Link>
    )
}

export default DownloadInvoiceButton