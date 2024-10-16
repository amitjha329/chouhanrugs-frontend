import { auth } from '@/auth'
import getUserAddressList from '@/backend/serverActions/getUserAddressList'
import React from 'react'
import UserAddressList from './UserAddressList'

const AddressPage = async () => {
    const session = await auth()
    const addressList = await getUserAddressList((session?.user as { id: string }).id)
    console.log(addressList)
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