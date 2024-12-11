// @ts-nocheck
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { FaFileInvoiceDollar } from 'react-icons/fa'

const DownloadInvoiceButton = ({ orderId, className, text, iconDisplay }: { orderId: string, className: string, text: string, iconDisplay?: boolean }) => {
    return (
        <Link href={`/invoice/${orderId}`} className={className} target='_blank'><FaFileInvoiceDollar className={clsx({ "hidden": !iconDisplay })} /> {text}</Link>
    )
}

export default DownloadInvoiceButton