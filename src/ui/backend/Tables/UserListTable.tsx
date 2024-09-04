'use client'
import UserProfileDataModel from '@/lib/types/UserProfileDataModel'
import { stringNotEmptyOrNull } from '@/lib/utilities/stringEmptyOrNull'
import { customStyles } from '@/styles/dataTable'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import DataTable from 'react-data-table-component'
import { FaPencilAlt } from 'react-icons/fa'
import { HiSortDescending } from 'react-icons/hi'

const UserListTable = ({ usersList }: { usersList: UserProfileDataModel[] }) => {
    const [query, setQuery] = useState("")
    const filteredList = useMemo(() => usersList.filter(item => {
        return stringNotEmptyOrNull(query) ? (item.name ?? "").toLowerCase().includes(query.toLowerCase()) || (item.email ?? "").toLowerCase().includes(query.toLowerCase()) : true
    }), [query, usersList])

    const subHeaderComponent = useMemo(() => <div>
        <input type='text' onChange={e => setQuery(e.currentTarget.value)} className='input input-bordered min-w-[300px]' placeholder='Enter Username or Email to Search' />
    </div>, [])

    const columns = React.useMemo(() => [
        {
            id: "id",
            selector: (row: UserProfileDataModel) => row._id,
            sortable: false,
            maxWidth: "70px",
            omit: true
        },
        {
            id: "image",
            selector: (row: UserProfileDataModel) => row.image,
            sortable: false,
            maxWidth: "70px",
            format: UserImage
        },
        {
            id: "name",
            name: "Name",
            selector: (row: UserProfileDataModel) => row.name,
            sortable: true,
            maxWidth: "150px",
            format: NameCell
        },
        {
            id: "email",
            name: "Email",
            selector: (row: UserProfileDataModel) => row.email,
            sortable: false
        },
        {
            id: "number",
            name: "Mo. Num.",
            selector: (row: UserProfileDataModel) => row.number,
            sortable: false,
        },
        {
            id: "roles",
            name: "Roles",
            selector: (row: UserProfileDataModel) => row.roles.join(','),
            sortable: true,
            format: (row: UserProfileDataModel) => (
                row.roles?.join(',')
            )
        },
        {
            id: "action",
            name: "Actions",
            button: true,
            minWidth: "300px",
            cell: ActionCell
        }
    ], [])


    return (
        <DataTable
            columns={columns}
            data={filteredList}
            customStyles={customStyles}
            responsive
            highlightOnHover
            pointerOnHover
            sortIcon={<HiSortDescending />}
            subHeader
            subHeaderComponent={subHeaderComponent}
            pagination
        />
    )
}

const ActionCell = (row: UserProfileDataModel) => (
    <div className="tooltip" data-tip="Edit Roles">
        <Link className='btn btn-outline btn-error btn-sm' href={`/admin/users/edit/${row._id}`}>
            <FaPencilAlt className='h-4 w-4' />
        </Link>
    </div>
)

const NameCell = (row: UserProfileDataModel) => (
    <b>{row.name}</b>
)

const UserImage = (row: UserProfileDataModel) => (
    <figure className='py-2 aspect-[2/3] max-h-28'>
        <Image src={stringNotEmptyOrNull(row.image) ? row.image : "/images/user-pic.png"} alt={row.name} height={100} width={66.66} />
    </figure>
)

export default UserListTable