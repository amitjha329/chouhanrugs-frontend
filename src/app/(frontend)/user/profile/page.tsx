import getUserInfo from '@/lib/actions/getUserInfo'
import AuthOpts from '@/lib/adapters/AuthOptions'
import UserProfileSettings from '@/ui/frontend/Forms/UserProfileSettings'
import { getServerSession } from 'next-auth'
import React from 'react'

const UserProfilePage = async () => {
    const session = await getServerSession(AuthOpts)
    const userData = await getUserInfo((session?.user as { id: string }).id)
    return (
        <UserProfileSettings className="basis-full lg:basis-3/4" userData={userData} />
    )
}

export default UserProfilePage