'use client'
import BulkPurchaseDataModel from '@/lib/types/BulkPurchaseDataModel'
import { customStyles } from '@/styles/dataTable'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import DataTable from 'react-data-table-component'
import { FaEye } from 'react-icons/fa'
import { HiSortDescending } from 'react-icons/hi'
import { MdDeleteOutline } from 'react-icons/md'

const columns = [
    {
        id: "contact",
        name: "Contact",
        selector: (row: BulkPurchaseDataModel) => row.contactNum
        ,
        sortable: true,
        maxWidth: "150px",
        format: (row: BulkPurchaseDataModel) => (
            <b>{row.contactNum}</b>
        )
    },
    {
        id: "email",
        name: "email",
        selector: (row: BulkPurchaseDataModel) => row.email,
        sortable: false
    },
    {
        id: "requestDate",
        name: "Date",
        selector: (row: BulkPurchaseDataModel) => row.requestDate ?? "",
        sortable: false,
        format: (row: BulkPurchaseDataModel) => (
            new Date(row.requestDate ?? "").toLocaleString()
        )
    },
    {
        id: "message",
        name: "Message",
        selector: (row: BulkPurchaseDataModel) => row.message,
        sortable: false
    },
    {
        id: "status",
        name: "Status",
        selector: (row: BulkPurchaseDataModel) => row.status ?? false,
        sortable: false,
        format: (row: BulkPurchaseDataModel) => (
            <span className={clsx({ "text-error": !row.status }, { "text-success": row.status })}>{row.status ? "Open" : "Closed"}</span>
        )
    },
    {
        id: "action",
        name: "Actions",
        button: true,
        minWidth: "300px",
        cell: (row: BulkPurchaseDataModel) => (
            <div className="flex flex-row gap-x-2 items-center">
                <div className="tooltip" data-tip="Delete">
                    <button className='btn btn-outline btn-error btn-sm' onClick={e => {
                        // setDeletionCandidate(row)
                        // setDeleteConfirmation(true)
                    }}>
                        <MdDeleteOutline className='h-4 w-4' />
                    </button>
                </div>
                <Link href={`/admin/orders/bulk/${row._id}`} className="tooltip" data-tip="View">
                    <div className='btn btn-outline btn-success btn-sm'>
                        <FaEye className='h-4 w-4' />
                    </div>
                </Link>
            </div>
        )
    }
]
const BulkOrdersTable = ({ bulkRequestData }: { bulkRequestData: BulkPurchaseDataModel[] }) => {
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <DataTable
                    columns={columns}
                    data={bulkRequestData}
                    customStyles={customStyles}
                    responsive
                    highlightOnHover
                    pointerOnHover
                    sortIcon={<HiSortDescending />}
                    pagination
                    paginationComponent={PaginationComponent}
                />
            </div>
        </div>
    )
}

const PaginationComponent = (data: any) => {
    return (
        <div className='flex flex-row justify-between items-center mt-3'>
            <span className='opacity-70'>Showing Rows {data.rowsPerPage}</span>
            <div>
            </div>
        </div>
    )
}

export default BulkOrdersTable