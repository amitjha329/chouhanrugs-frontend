'use client';
import deleteColor from '@/lib/actions/deleteColor';
import generateNewColor from '@/lib/actions/generateNewColor';
import getColorsList from '@/lib/actions/getColorsList';
import ColorDataModel from '@/lib/types/ColorDataModel';
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

const ColorList = () => {
    const router = useRouter()
    const [colorList, setColorList] = useState<ColorDataModel[]>([])
    const [isListLoading, setIsListLoading] = useState(true)
    const subHeaderComponent = useMemo(() => {
        return (
            <div className='btn btn-outline' onClick={e => {
                generateNewColor().then(res => {
                    router.push("/admin/products/colors/edit/" + res)
                }).catch(err => console.log(err))
            }}>Add Color</div>
        )
    }, [])
    const columns = useMemo(() => ([
        {
            id: "color",
            name: "Color",
            selector: (row: ColorDataModel) => row.name,
            sortable: true,
            format: ColorName
        },
        {
            id: "sampleImage",
            name: "Sample Image",
            selector: (row: ColorDataModel) => row.sampleImg,
            sortable: true,
            format: SampleImage
        },
        {
            id: "swatch",
            sortable: false,
            maxWidth: "42px",
            cell: ColorSwatch
        },
        {
            id: "code",
            name: "Color Code",
            selector: (row: ColorDataModel) => row.colorCode.hex,
            sortable: true,
            format: ColorCode
        },
        {
            id: "action",
            name: "Action",
            button: true,
            cell: ActionRow
        }
    ]), [])

    useEffect(() => {
        getColorsList().then(result => { setColorList(result); setIsListLoading(false) }).catch(err => console.log(err))
    }, [])
    return (
        <DataTable
            columns={columns}
            data={colorList}
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

const ActionRow = (row: ColorDataModel) => {
    return <div className='lex flex-row space-x-2'>
        <button className='btn btn-outline btn-error btn-sm' onClick={e => {
            deleteColor(row._id, row.sampleImg).then(() => {
                onPageNotifications("success", "Color Deleted").then(_ => {
                    window.location.reload()
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }}>
            <MdDeleteOutline className='h-4 w-4' />
        </button>
        <Link href={'/admin/products/colors/edit/' + row._id} className='btn btn-outline btn-success btn-sm' >
            <BsPencil className='h-4 w-4' />
        </Link>
    </div>
}

const ColorCode = (row: ColorDataModel) => (
    <span>{row.colorCode.hex}</span>
)

const ColorSwatch = (row: ColorDataModel) => (
    <div className={`min-h-6 h-6 w-10`} style={{
        backgroundColor: row.colorCode.hex
    }}></div>
)

const SampleImage = (row: ColorDataModel) => (
    <div>
        <Image src={row.sampleImg} alt={row.name} className="!h-8 !relative w-auto" fill />
    </div>
)

const ColorName = (row: ColorDataModel) => (
    <span className='font-semibold'>{capitalize(row.name)}</span>
)

export default ColorList