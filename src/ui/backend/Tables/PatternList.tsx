'use client';
import deletePattern from '@/lib/actions/deletePattern';
import generateNewPattern from '@/lib/actions/generateNewPattern';
import getPatternList from '@/lib/actions/getPatternList';
import PatternDataModel from '@/lib/types/PatternDataModel';
import capitalize from '@/lib/utilities/capitalize';
import { customStyles } from '@/styles/dataTable';
import onPageNotifications from '@/ui/common/onPageNotifications';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { BsPencil } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';
import { PuffLoader } from 'react-spinners';

const PatternList = () => {
    const router = useRouter()
    const [sizeList, setSizeList] = useState<PatternDataModel[]>([])
    const [isListLoading, setIsListLoading] = useState(true)
    const subHeaderComponent = useMemo(() => {
        return (
            <div className='btn btn-outline' onClick={e => {
                generateNewPattern().then(res => {
                    router.push("/admin/products/patterns/edit/" + res)
                }).catch(err => console.log(err))
            }}>Add Pattern</div>
        )
    }, [])
    const columns = useMemo(() => ([
        {
            id: "pattern",
            name: "Pattern",
            selector: (row: PatternDataModel) => row.name,
            sortable: true,
            format: SizeName
        },
        {
            id: "desc",
            name: "Pattern Desc.",
            selector: (row: PatternDataModel) => row.patternDescription,
        },
        {
            id: "action",
            name: "Action",
            button: true,
            cell: ActionRow
        }
    ]), [])

    useEffect(() => {
        getPatternList().then(result => { setSizeList(result); setIsListLoading(false) }).catch(err => console.log(err))
    }, [])
    return (
        <DataTable
            columns={columns}
            data={sizeList}
            customStyles={customStyles}
            responsive
            progressPending={isListLoading}
            progressComponent={<PuffLoader />}
            highlightOnHover
            pointerOnHover
            subHeader
            subHeaderComponent={subHeaderComponent}
        />
    )
}

const ActionRow = (row: PatternDataModel) => {
    return <div className='lex flex-row space-x-2'>
        <button className='btn btn-outline btn-error btn-sm' onClick={e => {
            deletePattern(row._id).then(() => {
                onPageNotifications("success", "Pattern Deleted").then(_ => {
                    window.location.reload()
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }}>
            <MdDeleteOutline className='h-4 w-4' />
        </button>
        <Link href={'/admin/products/patterns/edit/' + row._id} className='btn btn-outline btn-success btn-sm' >
            <BsPencil className='h-4 w-4' />
        </Link>
    </div>
}

const SizeName = (row: PatternDataModel) => (
    <span className='font-semibold'>{capitalize(row.name)}</span>
)

export default PatternList