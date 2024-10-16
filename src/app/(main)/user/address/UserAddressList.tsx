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
        <div className='card-body'>
            <div className='w-full flex'>
                <button className={clsx(
                    addingAddress ? 'btn-active' : 'btn-outline',
                    'ml-auto btn mb-4',
                )} onClick={toggleAddingAddress}>Add Address</button>
            </div>
            {
                !addingAddress && (
                    addressList && addressList.length > 0 ?
                        < div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                            {
                                addressList.map(address => (
                                    <div key={address._id} className='card card-bordered shadow-lg'>
                                        <div className='card-body'>
                                            <div className='card-title'>{`${address.fname} ${address.lname}`}</div>
                                            <div>
                                                {`${address.streetAddress}, ${address.city}, ${address.state}, ${address.country} - ${address.postalCode}`}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        <div className='h-96 w-full flex justify-center items-center'>
                            <span className='opacity-40 text-xl md:text-5xl font-bold'>You have not added Address Yet.</span>
                        </div>
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