import { auth } from '@/auth'
import getUserAddressList from '@/backend/serverActions/getUserAddressList'
import React from 'react'
import UserAddressList from './UserAddressList'

const AddressPage = async () => {
    const session = await auth()
    const addressList = await getUserAddressList((session?.user as { id: string }).id)
    console.log(addressList)
    return (
        <section className="w-full flex flex-col items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full">
                    <div className="bg-gradient-to-r from-pink-100 to-indigo-100 px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b">
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 tracking-tight">Your Addresses</h1>
                        <span className="text-sm text-gray-500 font-medium">{addressList?.length ?? 0} address{(addressList?.length ?? 0) !== 1 ? 'es' : ''}</span>
                    </div>
                    <div className="p-4 sm:p-8 min-h-[300px] flex flex-col gap-6">
                        <UserAddressList addressList={addressList} />
                    </div>
                </div>
        </section>
    )
}

export default AddressPage