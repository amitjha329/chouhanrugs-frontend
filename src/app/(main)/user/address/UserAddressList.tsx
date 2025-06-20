'use client'
import clsx from 'clsx'
import { useState, Fragment } from 'react'
import { MdEdit, MdDelete } from 'react-icons/md'
import { BsPlus } from 'react-icons/bs'
import { GrFormClose } from 'react-icons/gr'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import UserAddressDataModel from '@/types/UserAddressDataModel'
import UserAddressFormForList from './UserAddressFormForList'
import updateUserAddress from '@/backend/serverActions/updateUserAddress'
import deleteUserAddress from '@/backend/serverActions/deleteUserAddress'
import getUserAddressList from '@/backend/serverActions/getUserAddressList'
import onPageNotifications from '@/utils/onPageNotifications'
import { useSession } from 'next-auth/react'

const UserAddressList = ({ addressList: initialAddressList }: { addressList: UserAddressDataModel[] }) => {
    const { data: session } = useSession()
    const [addressList, setAddressList] = useState<UserAddressDataModel[]>(initialAddressList)
    const [addingAddress, setAddingAddress] = useState(false)
    const [editingAddress, setEditingAddress] = useState<UserAddressDataModel | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [addressToDelete, setAddressToDelete] = useState<UserAddressDataModel | null>(null)

    const toggleAddingAddress = () => {
        if (!addingAddress) {
            // When opening the form, clear any editing state for fresh add
            setEditingAddress(null)
        }
        setAddingAddress(!addingAddress)
        if (addingAddress) {
            setEditingAddress(null) // Clear editing state when closing form
        }
    }

    const handleEditAddress = (address: UserAddressDataModel) => {
        setEditingAddress(address)
        setAddingAddress(true)
    }

    const handleDeleteClick = (address: UserAddressDataModel) => {
        setAddressToDelete(address)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        if (!addressToDelete || !session?.user?.id) {
            onPageNotifications("error", "Unable to delete address")
            return
        }

        try {
            const result = await deleteUserAddress(addressToDelete._id, (session.user as { id: string }).id)
            
            if (result.ack) {
                onPageNotifications("success", "Address deleted successfully")
                // Remove the deleted address from the local state
                setAddressList(prevAddresses => prevAddresses.filter(addr => addr._id !== addressToDelete._id))
                setShowDeleteModal(false)
                setAddressToDelete(null)
            } else {
                onPageNotifications("error", "Failed to delete address")
            }
        } catch (error) {
            console.error('Error deleting address:', error)
            onPageNotifications("error", "Something went wrong while deleting address")
        }
    }

    const cancelDelete = () => {
        setShowDeleteModal(false)
        setAddressToDelete(null)
    }

    const refreshAddressList = async () => {
        if (session?.user?.id) {
            try {
                console.log('Refreshing address list...')
                const updatedAddressList = await getUserAddressList((session.user as { id: string }).id)
                console.log('Updated address list:', updatedAddressList)
                setAddressList(updatedAddressList)
            } catch (error) {
                console.error('Error refreshing address list:', error)
            }
        } else {
            console.error('No user session found for refreshing address list')
        }
    }
    
    return (
        <>
            <div className="p-0">
                <div className="w-full flex mb-6">
                    <button
                        className={clsx(
                            addingAddress ? 'btn-outline btn-neutral' : 'btn-primary text-primary-content',
                            'ml-auto btn px-6 py-2 rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md'
                        )}
                        onClick={toggleAddingAddress}
                    >
                        {addingAddress ? (
                            <>
                                <GrFormClose className="w-5 h-5 mr-2" />
                                Cancel
                            </>
                        ) : (
                            <>
                                <BsPlus className="w-5 h-5 mr-2" />
                                Add Address
                            </>
                        )}
                    </button>
                </div>
                
                {!addingAddress && (
                    addressList && addressList.length > 0 ? (
                        <div className="space-y-4">
                            {addressList.map(address => (
                                <div key={address._id} className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden group hover:shadow-md transition-all duration-200 hover:border-primary/30">                                    <div className="p-6">
                                        {/* Horizontal layout with all info in one row */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <span className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-content rounded-full text-lg font-bold flex-shrink-0">
                                                    {address.fname[0]}{address.lname[0]}
                                                </span>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h3 className="text-lg font-bold text-base-content">{address.fname} {address.lname}</h3>
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                                                            Active
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/80">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{address.streetAddress}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span>{address.city}, {address.state}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{address.country}</span>
                                                            <span className="w-1 h-1 bg-current rounded-full opacity-50"></span>
                                                            <span>{address.postalCode}</span>
                                                        </div>
                                                        <div className="text-base-content/60">
                                                            {address.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex gap-2 ml-4 flex-shrink-0">
                                                <button
                                                    onClick={() => handleEditAddress(address)}
                                                    className="btn btn-sm btn-outline btn-primary hover:bg-primary hover:text-primary-content transition-all duration-200"
                                                    title="Edit Address"
                                                >
                                                    <MdEdit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(address)}
                                                    className="btn btn-sm btn-outline btn-error hover:bg-error hover:text-error-content transition-all duration-200"
                                                    title="Delete Address"
                                                >
                                                    <MdDelete className="h-4 w-4" />                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-72 w-full flex flex-col justify-center items-center bg-base-100 rounded-2xl border border-base-300">
                            <div className="text-6xl mb-4 opacity-20">📍</div>
                            <span className="opacity-60 text-xl md:text-2xl font-semibold text-center">No addresses found</span>
                            <span className="opacity-40 text-sm mt-2 text-center">Click &quot;Add Address&quot; to get started</span>
                        </div>
                    )
                )}
                
                {addingAddress && (
                    <UserAddressFormForList 
                        addAddressHandler={setAddingAddress} 
                        editingAddress={editingAddress}
                        onSaveComplete={refreshAddressList}
                    />
                )}
            </div>

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
                                            Are you sure you want to delete this address? This action cannot be undone.
                                        </p>
                                        {addressToDelete && (
                                            <div className="bg-base-200 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-content rounded-full text-sm font-bold">
                                                        {addressToDelete.fname[0]}{addressToDelete.lname[0]}
                                                    </span>
                                                    <div className="font-medium text-base-content">
                                                        {addressToDelete.fname + " " + addressToDelete.lname}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-base-content/70 ml-11">
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
                                            className="btn btn-error text-error-content"
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

export default UserAddressList