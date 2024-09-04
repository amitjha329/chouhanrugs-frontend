'use client'
import GitIssueDataModel from '@/lib/types/GitIssueDataModel'
import axiosInstance from '@/lib/utilities/axiosInastances'
import capitalize from '@/lib/utilities/capitalize'
import clsx from 'clsx'
import { format } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { customStyles } from '@/styles/dataTable'
import { PuffLoader } from 'react-spinners'

type propTyes = {

}

const BugReportTable = () => {
    const [data, setData] = useState<Array<GitIssueDataModel>>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        axiosInstance().post('/api/admin/get-issues').then(result => {
            setData(result.data)
            setIsLoading(false)
        })
    }, [])

    const columns = useMemo(() => {
        return [
            {
                id: "title",
                name: "Issue",
                selector: (row: GitIssueDataModel) => row.title,
                sortable: true,
                minWidth: "500px",
                format: (row: GitIssueDataModel) => (
                    <span className='font-semibold'>{capitalize(row.title)}</span>
                )
            },
            {
                id: "created",
                name: "Created",
                selector: (row: GitIssueDataModel) => row.created_at,
                sortable: true,
                format: (row: GitIssueDataModel) => (
                    <span>{format(new Date(row.created_at), "do MMM, yy")}</span>
                )
            },
            {
                id: "updated",
                name: "Updated",
                selector: (row: GitIssueDataModel) => row.updated_at,
                sortable: true,
                format: (row: GitIssueDataModel) => (
                    <span>{format(new Date(row.created_at), "do MMM, yy")}</span>
                )
            },
            {
                id: "state",
                name: "State",
                selector: (row: GitIssueDataModel) => row.state,
                sortable: true,
                format: (row: GitIssueDataModel) => (
                    <span className={clsx({ "text-red-600": (row.state == "closed") }, { "text-green-500": (row.state == "open") })} > {row.state}</span >
                )

            },
            {
                id: "state_reason",
                name: "Reason",
                sortable: false,
                selector: (row: GitIssueDataModel) => row.state_reason,
            }
        ] as TableColumn<GitIssueDataModel>[]
    }, [])

    return <DataTable
        title="Reported Bugs List"
        columns={columns}
        data={data || []}
        customStyles={customStyles}
        progressPending={isLoading}
        progressComponent={<PuffLoader />}
        highlightOnHover
        pointerOnHover
        expandableRows
        expandOnRowClicked
        expandableRowsComponent={({ data }) => { return <div className="p-4 border-b border-l border-r">{data.body}</div> }}
    />
}

export default BugReportTable