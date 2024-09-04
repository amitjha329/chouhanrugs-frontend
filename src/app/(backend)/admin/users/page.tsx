import getUsersList from '@/lib/actions/getUsersList'
import UserListTable from '@/ui/backend/Tables/UserListTable'
import React from 'react'

const UserListPage = async () => {
    const userList = await getUsersList()
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <UserListTable usersList={userList} />
            </div>
        </div>
    )
}

export default UserListPage