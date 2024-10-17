'use client'
import UserAddressDataModel from '@/types/UserAddressDataModel'
import { Description, Label, Radio, RadioGroup, RadioGroupOption } from '@headlessui/react'
import React from 'react'
import { MdOutlineCheckCircleOutline } from 'react-icons/md'


const ShippingSelector = ({ selectedAddress, selectionHandler, addresses }: {
    selectedAddress: UserAddressDataModel | null,
    selectionHandler: React.Dispatch<React.SetStateAction<UserAddressDataModel | null>>,
    addresses: UserAddressDataModel[]
}) => {
    return (
        <RadioGroup value={selectedAddress} onChange={selectionHandler}>
            <Label className="sr-only">Server size</Label>
            <div className="space-y-2">
                {addresses.map((address) => (
                    <Radio
                        key={address._id}
                        value={address}
                        className={({ checked, focus: active }) =>
                            `${active ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300' : ''}
                                            ${checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'} relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`}>
                        {({ checked, focus: active }) => <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                                <div className="text-sm">
                                    <Label
                                        as="p"
                                        className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'
                                            }`}
                                    >
                                        {address.fname + " " + address.lname}
                                    </Label>
                                    <Description
                                        as="span"
                                        className={`inline ${checked ? 'text-sky-100' : 'text-gray-500'
                                            }`}
                                    >
                                        <span>
                                            {address.streetAddress}, {address.city}, {address.state}, {address.country} - {address.postalCode}
                                        </span>
                                    </Description>
                                </div>
                            </div>
                            {checked && (
                                <div className="shrink-0 text-white">
                                    <MdOutlineCheckCircleOutline className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                        }
                    </Radio>
                ))}
            </div>
        </RadioGroup>
    )
}

export default ShippingSelector