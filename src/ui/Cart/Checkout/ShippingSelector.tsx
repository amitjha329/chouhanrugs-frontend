// @ts-nocheck
'use client'
import UserAddressDataModel from '@/types/UserAddressDataModel'
import { Description, Label, Radio, RadioGroup } from '@headlessui/react'
import React, { useState } from 'react'
import { MdOutlineCheckCircleOutline, MdEdit, MdDelete } from 'react-icons/md'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { GrFormClose } from 'react-icons/gr'
import { Fragment } from 'react'

const ShippingSelector = ({ selectedAddress, selectionHandler, addresses, onEditAddress, onDeleteAddress }: {
    selectedAddress: UserAddressDataModel | null,
    selectionHandler: React.Dispatch<React.SetStateAction<UserAddressDataModel | null>>,
    addresses: UserAddressDataModel[],
    onEditAddress?: (address: UserAddressDataModel) => void,
    onDeleteAddress?: (addressId: string) => void
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [addressToDelete, setAddressToDelete] = useState<UserAddressDataModel | null>(null)

    const handleEdit = (e: React.MouseEvent, address: UserAddressDataModel) => {
        e.stopPropagation()
        onEditAddress?.(address)
    }

    const handleDeleteClick = (e: React.MouseEvent, address: UserAddressDataModel) => {
        e.stopPropagation()
        setAddressToDelete(address)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        if (addressToDelete) {
            onDeleteAddress?.(addressToDelete._id)
            setShowDeleteModal(false)
            setAddressToDelete(null)
        }
    }

    const cancelDelete = () => {
        setShowDeleteModal(false)
        setAddressToDelete(null)
    }

    return (
        <>            <RadioGroup value={selectedAddress} onChange={selectionHandler}>
                <div className="space-y-3">
                    {addresses.map((address) => (
                        <Radio
                            key={address._id}
                            value={address}
                            className={({ checked, focus: active }) =>
                                `${active ? 'ring-2 ring-primary ring-opacity-60 ring-offset-2' : ''}
                                ${checked ? 'bg-primary text-primary-content border-primary shadow-lg' : 'bg-base-100 border-base-300 hover:border-primary/50 hover:shadow-md'} 
                                relative flex cursor-pointer rounded-xl border-2 px-6 py-5 shadow-sm transition-all duration-200 ease-in-out focus:outline-none group`}>
                            {({ checked }) => (
                                <div className="flex w-full items-start justify-between">
                                    <div className="flex items-start flex-1 min-w-0">
                                        <div className="text-sm flex-1">
                                            <Label
                                                as="p"
                                                className={`font-semibold text-lg mb-2 ${checked ? 'text-primary-content' : 'text-base-content'}`}
                                            >
                                                {address.fname + " " + address.lname}
                                            </Label>
                                            <Description
                                                as="div"
                                                className={`${checked ? 'text-primary-content/85' : 'text-base-content/75'} text-sm leading-relaxed space-y-1`}
                                            >
                                                <div className="font-medium">{address.streetAddress}</div>
                                                <div>{address.city}, {address.state}</div>
                                                <div className="flex items-center gap-2">
                                                    <span>{address.country}</span>
                                                    <span className="w-1 h-1 bg-current rounded-full opacity-50"></span>
                                                    <span>{address.postalCode}</span>
                                                </div>
                                            </Description>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-4">
                                        {/* Action Buttons */}
                                        <div className={`flex gap-1 transition-opacity duration-200 ${checked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <button
                                                onClick={(e) => handleEdit(e, address)}
                                                className={`btn btn-xs btn-ghost ${checked ? 'text-primary-content hover:bg-primary-content/20' : 'text-base-content/60 hover:bg-base-200 hover:text-primary'} transition-colors`}
                                                title="Edit Address"
                                            >
                                                <MdEdit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteClick(e, address)}
                                                className={`btn btn-xs btn-ghost ${checked ? 'text-primary-content hover:bg-error/20' : 'text-error hover:bg-error/10'} transition-colors`}
                                                title="Delete Address"
                                            >
                                                <MdDelete className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Selection Indicator */}
                                        {checked && (
                                            <div className="shrink-0 text-primary-content ml-2">
                                                <MdOutlineCheckCircleOutline className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Radio>
                    ))}
                </div>
            </RadioGroup>

            {/* Delete Confirmation Modal */}
            <Transition appear show={showDeleteModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={cancelDelete}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-base-content">
                                            Delete Address
                                        </h3>
                                        <button
                                            onClick={cancelDelete}
                                            className="btn btn-ghost btn-sm btn-circle"
                                        >
                                            <GrFormClose className="h-5 w-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <p className="text-base-content/80 mb-3">
                                            Are you sure you want to delete this address?
                                        </p>
                                        {addressToDelete && (
                                            <div className="bg-base-200 rounded-lg p-3 text-sm">
                                                <div className="font-medium text-base-content mb-1">
                                                    {addressToDelete.fname + " " + addressToDelete.lname}
                                                </div>
                                                <div className="text-base-content/70">
                                                    {addressToDelete.streetAddress}, {addressToDelete.city}, {addressToDelete.state}, {addressToDelete.country} - {addressToDelete.postalCode}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={cancelDelete}
                                            className="btn btn-ghost"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            className="btn btn-error"
                                        >
                                            Delete Address
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default ShippingSelector