'use client'
import capitalize from '@/lib/utilities/capitalize'
import { customStyles } from '@/styles/dataTable'
import Link from 'next/link'
import React from 'react'
import DataTable from 'react-data-table-component'
import { FaPencilAlt } from 'react-icons/fa'
import { HiSortDescending } from 'react-icons/hi'

type pageModel = {
    page: string
}

const PagesTable = () => {
    const pagesList = [
        { page: "home" },
        { page: "about us" },
        { page: "contact us" },
        { page: "faq" },
        { page: "t&c" },
        { page: "policies" },
        { page: "jute-rugs" },
        { page: "cotton-rugs" },
        { page: "hand-bags" },
        { page: "pillow-and-cushion-covers" },
        { page: "wall-hanging-macrame" }
    ]

    const columns = [
        {
            id: "page",
            name: "Page",
            selector: (row: pageModel) => row.page,
            sortable: true,
            format: (row: pageModel) => (
                <b>{capitalize(row.page, false)}</b>
            )
        },
        {
            id: "action",
            name: "Actions",
            button: true,
            minWidth: "300px",
            cell: (row: pageModel) => (
                <div className="flex flex-row gap-x-2 items-center">
                    <Link href={`/admin/cms/pages/${row.page}`}>
                        <div className='btn btn-outline btn-success btn-sm'>
                            <FaPencilAlt className='h-4 w-4 mr-4' /> Edit Options
                        </div>
                    </Link>
                </div>
            )
        }
    ]

    return (
        <DataTable
            columns={columns}
            data={pagesList}
            customStyles={customStyles}
            responsive
            highlightOnHover
            pointerOnHover
            sortIcon={<HiSortDescending />}
        />
    )
}

export default PagesTable