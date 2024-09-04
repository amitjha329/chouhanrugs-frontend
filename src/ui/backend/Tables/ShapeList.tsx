'use client';
import deleteShape from '@/lib/actions/deleteShape';
import generateNewShape from '@/lib/actions/generateNewShape';
import getShapeList from '@/lib/actions/getShapeList';
import ShapeDataModel from '@/lib/types/ShapeDataModel';
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

const ShapeList = () => {
    const router = useRouter()
    const [sizeList, setSizeList] = useState<ShapeDataModel[]>([])
    const [isListLoading, setIsListLoading] = useState(true)
    const subHeaderComponent = useMemo(() => {
        return (
            <div className='btn btn-outline' onClick={e => {
                generateNewShape().then(res => {
                    router.push("/admin/products/shapes/edit/" + res)
                }).catch(err => console.log(err))
            }}>Add Shape</div>
        )
    }, [])
    const columns = useMemo(() => ([
        {
            id: "shape",
            name: "Shape",
            selector: (row: ShapeDataModel) => row.name,
            sortable: true,
            format: SizeName
        },
        {
            id: "desc",
            name: "Shape Desc.",
            selector: (row: ShapeDataModel) => row.shapeDescription,
        },
        {
            id: "action",
            name: "Action",
            button: true,
            cell: ActionRow
        }
    ]), [])

    useEffect(() => {
        getShapeList().then(result => { setSizeList(result); setIsListLoading(false) }).catch(err => console.log(err))
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

const ActionRow = (row: ShapeDataModel) => {
    return <div className='lex flex-row space-x-2'>
        <button className='btn btn-outline btn-error btn-sm' onClick={e => {
            deleteShape(row._id).then(() => {
                onPageNotifications("success", "Shape Deleted").then(_ => {
                    window.location.reload()
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }}>
            <MdDeleteOutline className='h-4 w-4' />
        </button>
        <Link href={'/admin/products/shapes/edit/' + row._id} className='btn btn-outline btn-success btn-sm' >
            <BsPencil className='h-4 w-4' />
        </Link>
    </div>
}


const SizeName = (row: ShapeDataModel) => (
    <span className='font-semibold'>{capitalize(row.name)}</span>
)

export default ShapeList