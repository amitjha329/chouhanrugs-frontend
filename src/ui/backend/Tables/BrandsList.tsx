'use client';
import deleteBrand from '@/lib/actions/deleteBrand';
import generateNewBrand from '@/lib/actions/generateNewBrand';
import getBrandsList from '@/lib/actions/getBrandsList';
import BrandDataModel from '@/lib/types/BrandDataModel';
import capitalize from '@/lib/utilities/capitalize';
import { customStyles } from '@/styles/dataTable';
import onPageNotifications from '@/ui/common/onPageNotifications';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { FaPencilAlt } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { PuffLoader } from 'react-spinners';

const BrandsList = () => {
    const router = useRouter()
    const [brandList, setTagList] = useState<BrandDataModel[]>([])
    const [isListLoading, setIsListLoading] = useState(true)
    const subHeaderComponent = useMemo(() => {
        return (
            <div className='btn btn-outline' onClick={e => {
                generateNewBrand().then(res => {
                    router.push("/admin/brands/edit/" + res)
                }).catch(err => console.log(err))
            }}>Add Brand</div>
        )
    }, [])
    const columns = useMemo(() => ([
        {
            id: "brand",
            name: "Brand",
            selector: (row: BrandDataModel) => row.name,
            sortable: true,
            format: BrandName
        },
        {
            id: "description",
            name: "Description",
            selector: (row: BrandDataModel) => row.description,
            sortable: false
        },
        {
            id: "img",
            name: "Image",
            sortable: true,
            selector: (row: BrandDataModel) => row.imgSrc,
            maxWidth: "55px",
            format: BrandImage
        },
        {
            id: "status",
            name: "Status",
            selector: row => row.active,
            sortable: true,
            format: BrandStatus
        },
        {
            id: "action",
            name: "Action",
            button: true,
            minWidth: "300px",
            cell: ActionRow
        }
    ]), [])

    useEffect(() => {
        getBrandsList().then(result => { setTagList(result); setIsListLoading(false) }).catch(err => console.log(err))
    }, [])
    return (
        <DataTable
            columns={columns}
            data={brandList}
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

const ActionRow = (row: BrandDataModel) => {
    return <div className="flex flex-row gap-x-2 items-center">
        <button className='btn btn-outline btn-error btn-sm' onClick={() => {
            deleteBrand(row._id?.toString()).then((res) => {
                if (res.ack) {
                    onPageNotifications("success", "Brand Deleted").then(() => {
                        window.location.reload()
                    }).catch(e => console.log(e))
                } else {
                    console.log(res.result)
                }
            }).catch(err => console.log(err))
        }}>
            <MdDeleteOutline className='h-4 w-4' />
        </button>
        <Link className='btn btn-outline btn-success btn-sm' href={'/admin/brands/edit/' + row._id}>
            <FaPencilAlt className='h-4 w-4' />
        </Link>
    </div >
}

const BrandName = (row: BrandDataModel) => (
    <span className='font-semibold'>{capitalize(row.name ?? " ")}</span>
)

const BrandImage = (row: BrandDataModel) => (
    <figure className='object-fill py-3 mx-auto'>
        <Image src={row.imgSrc} alt={row.name} height={50} width={50} sizes="100vw" />
    </figure>
)

const BrandStatus = (row: BrandDataModel) => (
    <span className={clsx(
        row.active ? 'text-success' : 'text-error',
        'font-semibold'
    )}>{row.active ? "Active" : "Inactive"}</span>
)

export default BrandsList