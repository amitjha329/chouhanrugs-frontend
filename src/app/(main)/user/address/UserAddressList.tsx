'use client'
import clsx from 'clsx'
import { useState } from 'react'
import UserAddressDataModel from '@/types/UserAddressDataModel'
import UserAddressForm from './UserAddressForm'

const UserAddressList = ({ addressList }: { addressList: UserAddressDataModel[] }) => {
    const [addingAddress, setAddingAddress] = useState(false)

    const toggleAddingAddress = () => {
        setAddingAddress(!addingAddress)
    }
    return (
        <div className="p-0">
            <div className="w-full flex mb-4">
                <button
                    className={clsx(
                        addingAddress ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
                        'ml-auto btn px-5 py-2 rounded-md border font-medium shadow-sm transition-colors duration-150'
                    )}
                    onClick={toggleAddingAddress}
                >
                    {addingAddress ? 'Cancel' : 'Add Address'}
                </button>
            </div>
            {
                !addingAddress && (
                    addressList && addressList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {
                                addressList.map(address => (
                                    <div key={address._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-200">
                                        <div className="p-6 flex-1 flex flex-col gap-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="inline-block bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">{address.fname[0]}{address.lname[0]}</span>
                                                <span className="text-lg font-bold text-gray-800">{address.fname} {address.lname}</span>
                                            </div>
                                            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                                                {address.streetAddress}
                                                <br />
                                                {address.city}, {address.state}
                                                <br />
                                                {address.country} - {address.postalCode}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="h-72 w-full flex justify-center items-center">
                            <span className="opacity-40 text-xl md:text-4xl font-bold">You have not added any address yet.</span>
                        </div>
                    )
                )
            }
            {
                addingAddress && (
                    <UserAddressForm addAddressHandler={setAddingAddress} />
                )
            }
        </div>
    )
}

export default UserAddressList