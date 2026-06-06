// @ts-nocheck
'use client'

import UserAddressDataModel from '@/types/UserAddressDataModel'
import { Radio, RadioGroup } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { HiCheck, HiOutlineMapPin, HiOutlinePencil, HiOutlineTrash, HiXMark } from 'react-icons/hi2'

const ShippingSelector = ({ selectedAddress, selectionHandler, addresses, onEditAddress, onDeleteAddress }: {
    selectedAddress: UserAddressDataModel | null,
    selectionHandler: React.Dispatch<React.SetStateAction<UserAddressDataModel | null>>,
    addresses: UserAddressDataModel[],
    onEditAddress?: (address: UserAddressDataModel) => void,
    onDeleteAddress?: (addressId: string) => void
}) => {
    const [addressToDelete, setAddressToDelete] = useState<UserAddressDataModel | null>(null)

    const confirmDelete = () => {
        if (!addressToDelete) return
        onDeleteAddress?.(addressToDelete._id)
        setAddressToDelete(null)
    }

    return (
        <>
            <RadioGroup value={selectedAddress} onChange={selectionHandler} className="grid gap-2">
                {addresses.map((address) => (
                    <Radio
                        key={address._id}
                        value={address}
                        className={({ checked, focus }) => [
                            'group cursor-pointer rounded-lg border bg-base-100 p-4 transition focus:outline-none',
                            checked ? 'border-primary bg-primary/5 shadow-sm' : 'border-primary/10 hover:border-primary/35',
                            focus ? 'ring-2 ring-primary/20' : '',
                        ].join(' ')}
                    >
                        {({ checked }) => (
                            <div className="flex gap-3">
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <HiOutlineMapPin className="h-5 w-5" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-base-content">{address.fname} {address.lname}</p>
                                            <p className="mt-1 text-xs leading-5 text-base-content/65">
                                                {address.streetAddress}, {address.city}, {address.state}
                                            </p>
                                            <p className="text-xs text-base-content/50">{address.country} - {address.postalCode}</p>
                                        </div>
                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${checked ? 'border-primary bg-primary text-primary-content' : 'border-base-300'}`}>
                                            {checked && <HiCheck className="h-3.5 w-3.5" />}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                onEditAddress?.(address)
                                            }}
                                            className="inline-flex h-8 items-center gap-1 rounded-md border border-primary/10 px-2.5 text-xs font-semibold text-primary transition hover:bg-primary/5"
                                        >
                                            <HiOutlinePencil className="h-3.5 w-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                setAddressToDelete(address)
                                            }}
                                            className="inline-flex h-8 items-center gap-1 rounded-md border border-error/15 px-2.5 text-xs font-semibold text-error transition hover:bg-error/5"
                                        >
                                            <HiOutlineTrash className="h-3.5 w-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Radio>
                ))}
            </RadioGroup>

            <Transition appear show={Boolean(addressToDelete)} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddressToDelete(null)}>
                    <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/35" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 translate-y-2" enterTo="opacity-100 translate-y-0" leave="ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-2">
                                <DialogPanel className="w-full max-w-md rounded-lg border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-base font-semibold text-base-content">Delete address</h3>
                                            <p className="mt-1 text-sm text-base-content/60">This address will be removed from checkout.</p>
                                        </div>
                                        <button className="rounded-md p-1 text-base-content/50 hover:bg-base-200" onClick={() => setAddressToDelete(null)}>
                                            <HiXMark className="h-5 w-5" />
                                        </button>
                                    </div>
                                    {addressToDelete && (
                                        <div className="mt-4 rounded-md border border-primary/10 bg-primary/5 p-3 text-sm text-base-content/70">
                                            <p className="font-semibold text-base-content">{addressToDelete.fname} {addressToDelete.lname}</p>
                                            <p>{addressToDelete.streetAddress}, {addressToDelete.city}, {addressToDelete.state}</p>
                                        </div>
                                    )}
                                    <div className="mt-5 flex justify-end gap-2">
                                        <button className="rounded-md border border-base-300 px-4 py-2 text-sm font-semibold" onClick={() => setAddressToDelete(null)}>Cancel</button>
                                        <button className="rounded-md bg-error px-4 py-2 text-sm font-semibold text-error-content" onClick={confirmDelete}>Delete</button>
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
