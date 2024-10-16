import { auth } from '@/auth'
import UserProfileDataModel from '@/types/UserProfileDataModel'
import UserProfileSettings from '@/app/(main)/user/profile/UserProfileSettings'
import React from 'react'

const UserProfilePage = async () => {
    const session = await auth()
    return (
        <UserProfileSettings className="basis-full lg:basis-3/4" userData={session?.user as UserProfileDataModel} />
    )
}

export default UserProfilePage