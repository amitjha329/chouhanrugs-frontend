'use client';
import deleteTag from '@/lib/actions/deleteTag';
import generateNewTag from '@/lib/actions/generateNewTag';
import getTagsList from '@/lib/actions/getTagsList';
import TagDataModel from '@/lib/types/TagDataModel';
import capitalize from '@/lib/utilities/capitalize';
import { customStyles } from '@/styles/dataTable';
import onPageNotifications from '@/ui/common/onPageNotifications';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { FaPencilAlt } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { PuffLoader } from 'react-spinners';

const TagsList = () => {
    const router = useRouter()
    const [tagList, setTagList] = useState<TagDataModel[]>([])
    const [isListLoading, setIsListLoading] = useState(true)
    const subHeaderComponent = useMemo(() => {
        return (
            <div className='btn btn-outline' onClick={e => {
                generateNewTag().then(res => {
                    router.push("/admin/tags/edit/" + res)
                }).catch(err => console.log(err))
            }}>Add Tag</div>
        )
    }, [])
    const columns = useMemo(() => ([
        {
            id: "tag",
            name: "Tag",
            selector: (row: TagDataModel) => row.name,
            sortable: true,
            format: TagName
        },
        {
            id: "description",
            name: "Description",
            selector: (row: TagDataModel) => row.description,
            sortable: false
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
        getTagsList().then(result => { setTagList(result); setIsListLoading(false) }).catch(err => console.log(err))
    }, [])
    return (
        <DataTable
            columns={columns}
            data={tagList}
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

const ActionRow = (row: TagDataModel) => {
    return <div className="flex flex-row gap-x-2 items-center">
        <button disabled={row.name == "Top Selling" || row.name == "New Arrivals" || row.name == "Latest" || row.name == "Hot" || row.name == "Sale"} className='btn btn-outline btn-error btn-sm' onClick={() => {
            deleteTag(row._id?.toString()).then((res) => {
                if (res.ack) {
                    onPageNotifications("success", "Tag Deleted").then(() => {
                        window.location.reload()
                    })
                } else {
                    console.log(res.result)
                }
            }).catch(err => console.log(err))
        }}>
            <MdDeleteOutline className='h-4 w-4' />
        </button>
        <Link className='btn btn-outline btn-success btn-sm' href={'/admin/tags/edit/' + row._id}>
            <FaPencilAlt className='h-4 w-4' />
        </Link>
    </div >
}

const TagName = (row: TagDataModel) => (
    <span className='font-semibold'>{capitalize(row.name)}</span>
)

export default TagsList