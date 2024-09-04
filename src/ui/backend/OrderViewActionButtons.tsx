'use client'
import changeOrderStatus from '@/lib/actions/changeOrderStatus'
import OrderDataModel from '@/lib/types/OrderDataModel'
import React, { Fragment, useState } from 'react'
import { FaFileInvoiceDollar, FaLongArrowAltRight } from 'react-icons/fa'
import onPageNotifications from '../common/onPageNotifications'
import Link from 'next/link'
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull'
import { Dialog, Transition } from '@headlessui/react'

const OrderViewActionButtons = ({ orderData }: { orderData: OrderDataModel }) => {
    const [shippingDialog, setShippingDialog] = useState<boolean>(false)
    const [orderId, setOrderId] = useState<string>("")
    const [shippingType, setShippingType] = useState<string>("")
    const [orderStatus, setOrderStatus] = useState<"dispatched" | "cancelled">("dispatched")
    const [trackingNum, setTrackingNum] = useState<string>("")
    return (
        <>
            <Link href={`/invoice/${orderData._id}`} target='_blank' className='btn btn-outline w-full'><FaFileInvoiceDollar /> Invoice</Link>
            {
                !["dispatched", "out-for-delivery", "delivered"].includes(orderData.orderStatus) && <button className='btn btn-outline btn-success w-full' onClick={() => {
                    setOrderId(orderData._id)
                    setShippingDialog(true)
                }}><FaLongArrowAltRight /> Change Staus</button>
            }
            <Transition appear show={shippingDialog} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => {
                    setShippingDialog(false)
                    setOrderId("")
                }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-lg rounded-2xl transform overflow-hidden bg-white shadow-xl transition-all flex flex-col relative p-6">
                                    <Dialog.Title className="text-2xl text-start font-semibold">
                                        Add Shipping Information to Proceed
                                    </Dialog.Title>
                                    <Dialog.Description className="text-justify">
                                        <form className="w-full overflow-y-scroll my-12 space-y-5" onSubmit={e => {
                                            e.preventDefault()
                                            if (stringEmptyOrNull(trackingNum) || stringEmptyOrNull(shippingType)) {
                                                onPageNotifications("error", "Please Select Shipping Partner and Enter Tracking No. to proceed.")
                                                return;
                                            }
                                            changeOrderStatus(orderId, orderStatus, { trackingNum, type: shippingType }).then(res => {
                                                if (res.ack) {
                                                    onPageNotifications("success", "Order Processed").finally(() => {
                                                        window.location.reload()
                                                    })
                                                } else {
                                                    onPageNotifications("error", "Unable To Change Order Status")
                                                }
                                            })
                                        }}>
                                            <select className='select select-bordered w-full' required onChange={(e) => { setOrderStatus(e.currentTarget.value as any) }}>
                                                <option hidden disabled selected value="">Select Status</option>
                                                <option value="dispatched">Shipped/Dispatched</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            {
                                                orderStatus == "dispatched" && <>
                                                    <select className='select select-bordered w-full' required onChange={(e) => { setShippingType(e.currentTarget.value) }}>
                                                        <option hidden disabled selected value="">Select Shipping Partner</option>
                                                        <option>DHL</option>
                                                        <option>DTDC</option>
                                                    </select>
                                                    <input className='input input-bordered w-full' type='text' required onChange={(e) => { setTrackingNum(e.currentTarget.value) }} />
                                                </>
                                            }
                                            <div className='space-x-5'>
                                                <button type='submit' className='btn btn-primary'>Save</button>
                                                <button className='btn btn-error' onClick={() => {
                                                    setShippingDialog(false)
                                                    setOrderId("")
                                                }}>Cancel</button>
                                            </div>
                                        </form>
                                    </Dialog.Description>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default OrderViewActionButtons