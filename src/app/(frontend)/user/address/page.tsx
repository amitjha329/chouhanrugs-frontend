import getUserAddressList from '@/lib/actions/getUserAddressList'
import AuthOpts from '@/lib/adapters/AuthOptions'
import UserAddressList from '@/ui/frontend/Sections/UserAddressList'
import { getServerSession } from 'next-auth'
import React from 'react'

const AddressPage = async () => {
    const session = await getServerSession(AuthOpts)
    const addressList = await getUserAddressList((session?.user as { id: string }).id)
    return (
        <div className="basis-full lg:basis-3/4" >
            <div className="mx-auto px-4 sm:px-6">
                <div className="container mx-auto my-8 drop-shadow-lg card card-bordered bg-white">
                    <UserAddressList addressList={addressList} />
                </div>
            </div>
        </div>

    )
}

export default AddressPage