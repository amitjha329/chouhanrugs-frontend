'use client';
import deleteCategory from '@/lib/actions/deleteCategory';
import generateNewCategory from '@/lib/actions/generateNewCategory';
import getCategoriesList from '@/lib/actions/getCategoriesList';
import saveCategoryActivation from '@/lib/actions/saveCategoryActivation';
import CategoriesDataModel from '@/lib/types/CategoriesDataModel';
import capitalize from '@/lib/utilities/capitalize';
import { customStyles } from '@/styles/dataTable';
import onPageNotifications from '@/ui/common/onPageNotifications';
import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { FaPencilAlt } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { PuffLoader } from 'react-spinners';

const CategoriesList = () => {
    const router = useRouter()
    const [categoriesList, setCategoriesList] = useState<CategoriesDataModel[]>([])
    const [isListLoading, setIsListLoading] = useState(true)
    const subHeaderComponent = useMemo(() => {
        return (
            <div className='btn btn-outline' onClick={e => {
                generateNewCategory().then(res => {
                    router.push("/admin/categories/edit/" + res)
                }).catch(err => console.log(err))
            }}>Add Category</div>
        )
    }, [])
    const columns = useMemo(() => ([
        {
            id: "category",
            name: "Category",
            selector: (row: CategoriesDataModel) => row.name,
            sortable: true,
            format: CategoryName
        }, {
            id: "parent",
            name: "Parent Cat",
            selector: (row: CategoriesDataModel) => row.parent ?? "",
            sortable: true,
            format: ParentCategory
        },
        {
            id: "description",
            name: "Description",
            selector: (row: CategoriesDataModel) => row.description,
            sortable: false
        },
        {
            id: "img",
            name: "Image",
            sortable: true,
            selector: (row: CategoriesDataModel) => row.imgSrc,
            maxWidth: "55px",
            format: SampleImage
        },
        {
            id: "status",
            name: "Status",
            selector: (row: CategoriesDataModel) => row.active,
            sortable: true,
            format: CategoryStatus
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
        getCategoriesList().then(result => { setCategoriesList(result); setIsListLoading(false) }).catch(err => console.log(err))
    }, [])
    return (
        <DataTable
            columns={columns}
            data={categoriesList}
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

const ActionRow = (row: CategoriesDataModel) => {
    return <div className="flex flex-row gap-x-2 items-center">
        <button className='btn btn-outline btn-error btn-sm' onClick={() => {
            deleteCategory(row._id?.toString()).then((res) => {
                if (res.ack) {
                    onPageNotifications("success", "Category Deleted").then(() => {
                        window.location.reload()
                    })
                } else {
                    console.log(res.result)
                }
            }).catch(err => console.log(err))
        }}>
            <MdDeleteOutline className='h-4 w-4' />
        </button>
        <Switch
            checked={row.active}
            onChange={e => {
                saveCategoryActivation(row._id?.toString() ?? "", e.valueOf()).then((res) => {
                    if (res.ack) {
                        onPageNotifications("success", "Cateogry Activation/Deactivation Success").then(() => {
                            window.location.reload()
                        })
                    } else {
                        console.log(res.result)
                    }
                }).catch(err => console.log(err))
            }}
            className={`${row.active ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}>
            <span
                className={`${row.active ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
        </Switch>
        <Link className='btn btn-outline btn-success btn-sm' href={'/admin/categories/edit/' + row._id}>
            <FaPencilAlt className='h-4 w-4' />
        </Link>
    </div >
}

const CategoryStatus = (row: CategoriesDataModel) => (
    <span className={clsx(
        row.active ? 'text-success' : 'text-error',
        'font-semibold'
    )}>{row.active ? "Active" : "Inactive"}</span>
)

const CategoryName = (row: CategoriesDataModel) => (
    <span className='font-semibold'>{capitalize(row.name)}</span>
)

const SampleImage = (row: CategoriesDataModel) => (
    <figure className='object-fill py-3 mx-auto'>
        <Image src={row.imgSrc} alt={row.name} height={50} width={50} sizes="100vw" />
    </figure>
)

const ParentCategory = (row: CategoriesDataModel) => (
    <span className='font-semibold'>{capitalize(row.parent?.split('>').filter(String).at(-1) ?? "N/a")}</span>
)

export default CategoriesList