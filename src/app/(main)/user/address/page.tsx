import { auth } from '@/auth'
import getUserAddressList from '@/backend/serverActions/getUserAddressList'
import React from 'react'
import UserAddressList from './UserAddressList'
import { HiOutlineMapPin } from 'react-icons/hi2'

const AddressPage = async () => {
    const session = await auth()
    const addressList = await getUserAddressList((session?.user as { id: string }).id)
    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-3">
                    <HiOutlineMapPin className="w-8 h-8 text-primary" />
                    Address Book
                </h1>
                <p className="text-base-content/60 mt-1">Manage your shipping and billing addresses</p>
            </div>

            {/* Address List Card */}
            <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-base-300/50 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
                    <h2 className="font-semibold text-base-content">Saved Addresses</h2>
                    <span className="badge badge-primary badge-outline">
                        {addressList?.length ?? 0} {(addressList?.length ?? 0) === 1 ? 'address' : 'addresses'}
                    </span>
                </div>
                <div className="p-4 sm:p-6">
                    <UserAddressList addressList={addressList} />
                </div>
            </div>
        </div>
    )
}

export default AddressPage