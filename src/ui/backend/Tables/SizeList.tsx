'use client';
import deleteSize from '@/lib/actions/deleteSize';
import generateNewSize from '@/lib/actions/generateNewSize';
import getSizeList from '@/lib/actions/getSizeList';
import SizeDataModel from '@/lib/types/SizeDataModel';
import capitalize from '@/lib/utilities/capitalize';
import { customStyles } from '@/styles/dataTable';
import onPageNotifications from '@/ui/common/onPageNotifications';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { BsPencil } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';
import { PuffLoader } from 'react-spinners';

const SizeList = () => {
    const router = useRouter()
    const [sizeList, setSizeList] = useState<SizeDataModel[]>([])
    const [isListLoading, setIsListLoading] = useState(true)
    const subHeaderComponent = useMemo(() => {
        return (
            <div className='btn btn-outline' onClick={e => {
                generateNewSize().then(res => {
                    router.push("/admin/products/sizes/edit/" + res)
                }).catch(err => console.log(err))
            }}>Add Size</div>
        )
    }, [])
    const columns = useMemo(() => ([
        {
            id: "size",
            name: "Size",
            selector: (row: SizeDataModel) => row.name,
            sortable: true,
            format: SizeName
        },
        {
            id: "code",
            name: "Size Code",
            selector: (row: SizeDataModel) => row.sizeCode,
            sortable: true,
            format: SizeCode
        },
        {
            id: "sampleImage",
            name: "Sample Image",
            selector: (row: SizeDataModel) => row.sizeBanner,
            sortable: true,
            format: SampleImage
        },
        {
            id: "action",
            name: "Action",
            button: true,
            cell: ActionRow
        }
    ]), [])

    useEffect(() => {
        getSizeList().then(result => { setSizeList(result); setIsListLoading(false) }).catch(err => console.log(err))
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

const ActionRow = (row: SizeDataModel) => {
    return <div className='lex flex-row space-x-2'>
        <button className='btn btn-outline btn-error btn-sm' onClick={e => {
            deleteSize(row._id, row.sizeBanner).then(() => {
                onPageNotifications("success", "Color Deleted").then(_ => {
                    window.location.reload()
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }}>
            <MdDeleteOutline className='h-4 w-4' />
        </button>
        <Link href={'/admin/products/sizes/edit/' + row._id} className='btn btn-outline btn-success btn-sm' >
            <BsPencil className='h-4 w-4' />
        </Link>
    </div>
}

const SizeCode = (row: SizeDataModel) => (
    <b>{row.sizeCode}</b>
)

const SampleImage = (row: SizeDataModel) => (
    <div>
        <Image src={row.sizeBanner} alt={row.name} className="!h-8 !relative w-auto" fill />
    </div>
)

const SizeName = (row: SizeDataModel) => (
    <span className='font-semibold'>{capitalize(row.name)}</span>
)

export default SizeList