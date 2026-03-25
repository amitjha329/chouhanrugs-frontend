import { getSession } from '@/lib/auth-server'
import UserProfileDataModel from '@/types/UserProfileDataModel'
import UserProfileSettings from './UserProfileSettings'
import React from 'react'

const UserProfilePage = async () => {
    const session = await getSession()
    return (
        <UserProfileSettings userData={session?.user as UserProfileDataModel} />
    )
}

export default UserProfilePage