// @ts-nocheck
'use client'
import { Disclosure, Transition } from '@headlessui/react'
import React, { Fragment, useMemo, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import { DHLShipment } from '@/types/DHLShipment'
import { DTDCShipment } from '@/types/DTDCShipment'
import OrderDataModel from '@/types/OrderDataModel'
import trackOrder from '@/backend/serverActions/trackorder'
import ShippingTracking from './ShippingTracking'

const OrderProductShippingDisclosure = ({ orderItem }: { orderItem: OrderDataModel }) => {
    const [shippingData, setShippingData] = useState<DHLShipment | DTDCShipment>()
    const [disclosureOpen, setDisclosureOpen] = useState(false)
    const getShippnigData = useMemo(async () => {
        if (disclosureOpen && !shippingData) {
            const trackingData = await trackOrder(orderItem.tracking.type, orderItem.tracking.trackingNum, orderItem.orderStatus == "delivered", orderItem._id);
            setShippingData(trackingData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disclosureOpen])
    return (
        <Disclosure as="div" className="" onClick={e => { e.preventDefault() }}>
            {
                ({ open }) => {
                    setDisclosureOpen(open)
                    if (!shippingData && open) {
                        getShippnigData
                    }
                    return <>
                        <Disclosure.Button className="w-full scale-y flex items-center justify-center py-2 hover:bg-gray-300 cursor-pointer">
                            {open ? <FaCaretUp /> : <FaCaretDown />}
                        </Disclosure.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-in duration-100"
                            enterFrom="scale-y-0"
                            enterTo="scale-y-100"
                            leave="transition ease-in duration-100"
                            leaveFrom="scale-y-100"
                            leaveTo="scale-y-0">
                            <Disclosure.Panel>
                                {shippingData && <ShippingTracking shipmentData={shippingData} />}
                            </Disclosure.Panel>
                        </Transition>
                    </>
                }
            }
        </Disclosure>
    )
}

export default OrderProductShippingDisclosure