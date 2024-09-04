'use client'
import OrderDataModel from '@/lib/types/OrderDataModel'
import { customStyles } from '@/styles/dataTable'
import Link from 'next/link'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component'
import { FaEye } from 'react-icons/fa'
import { usePageHeading } from '../Contexts/PageHeadingContext'
import changeOrderStatus from '@/lib/actions/changeOrderStatus'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Dialog, Transition } from '@headlessui/react'
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull'
import { usePathname } from 'next/navigation'
import { useAdminDataContext } from '../Contexts/AdminDataPointsContext'
import { Button, CalendarCell, CalendarGrid, DateInput, DateRangePicker, DateSegment, Group, Heading, Label, Popover, RangeCalendar, Dialog as AriaDialog } from 'react-aria-components'
import '@/styles/AriaComponents/ReactDateRange.css'
import clsx from 'clsx'

const OrderListTable = ({ orderList, pageTitle }: { orderList: OrderDataModel[], pageTitle: string }) => {
    const { setPageHeading } = usePageHeading()
    setPageHeading(pageTitle)
    const { helpers } = useAdminDataContext()
    const [shippingDialog, setShippingDialog] = useState<boolean>(false)
    const [orderId, setOrderId] = useState<string>("")
    const [shippingType, setShippingType] = useState<string>("")
    const [orderStatus, setOrderStatus] = useState<"dispatched" | "cancelled">("dispatched")
    const [trackingNum, setTrackingNum] = useState<string>("")
    const pathname = usePathname()
    const [query, setQuery] = useState("")
    const [dateFilter, setDateFilter] = useState({ start: 0, end: Date.now() - 86399000 })
    const filteredData = useMemo(() => orderList.filter(order => {
        if (Number.isNaN(Number(query.replaceAll('-', '')))) {
            return order.user?.name ?
                order.user?.name.toLowerCase().includes(query) && order.orderPlacedOn > dateFilter.start && order.orderPlacedOn < dateFilter.end + 86399000
                :
                (order.user?.email ?? "").toLowerCase().includes(query) && order.orderPlacedOn > dateFilter.start && order.orderPlacedOn < dateFilter.end + 86399000
        } else {
            return order._id.replaceAll('-', '').includes(query.replaceAll('-', '')) && order.orderPlacedOn > dateFilter.start && order.orderPlacedOn < dateFilter.end + 86399000
        }

    }), [query, dateFilter])

    const columns = useMemo(() => [
        {
            id: "id",
            name: "Order Id",
            selector: (row: OrderDataModel) => row._id,
            sortable: true,
        }, {
            id: "customerName",
            name: "Customer",
            selector: (row: OrderDataModel) => row.user?.name || row.user?.email || "",
            sortable: true,
        }, {
            id: "orderDate",
            name: "Date",
            selector: (row: OrderDataModel) => row.orderPlacedOn,
            sortable: true,
            format: (row: OrderDataModel) => (
                Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(row.orderPlacedOn)
            )
        }, {
            id: "values",
            name: "Order Value",
            selector: (row: OrderDataModel) => row.orderValue,
            sortable: true,
            format: (row: OrderDataModel) => `${row.userCurrency.currencySymbol} ${row.orderValue}`
        }, {
            id: "status",
            name: "Status",
            selector: (row: OrderDataModel) => row.orderStatus,
            format: (row: OrderDataModel) => <span className={clsx(
                { 'text-red-500': row.orderStatus == "cancelled" },
                { 'text-orange-500': row.orderStatus == "pending" },
                { 'text-green-500': row.orderStatus == "delivered" },
                { 'text-blue-500': row.orderStatus == "transit" || row.orderStatus == "dispatched" || row.orderStatus == "placed" },
                "font-bold"
            )}>{row.orderStatus}</span>,
            sortable: true,
        }, {
            id: "action",
            name: "Actions",
            button: true,
            minWidth: "300px",
            cell: (row: OrderDataModel) => (
                <div className="flex flex-row gap-x-2 items-center"><div className='tooltip' data-tip="Change Order Status" onClick={() => {
                    setOrderId(row._id)
                    setShippingDialog(true)
                }}>
                    <div className='btn btn-outline btn-success btn-sm'>
                        Change Status
                    </div>
                </div>
                    <div className='tooltip' data-tip="View Order">
                        <Link href={`/admin/orders/view/${row._id}`} className='btn btn-outline btn-success btn-sm' >
                            <FaEye />
                        </Link>
                    </div>
                </div>
            )
        }
    ], [])

    useEffect(() => {
        switch (pathname) {
            case "/admin/orders/all":
                helpers?.clearDataCount('')
                helpers?.clearDataCount('')
                helpers?.clearDataCount('')
                break;
        }
        console.log(pathname)
    }, [pathname])

    return (
        <>
            <div className='flex items-end justify-start '>
                <div className='flex justify-between'>
                    <div className='flex gap-x-5'>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                        }} className='form-control items-center flex-row'>
                            <input type='text' name='query' id='query' placeholder='Enter Query To Search' defaultValue={query} onChange={e => setQuery(e.currentTarget.value)} className='input input-bordered mr-3' />
                        </form>
                    </div>
                </div>
                {/* <div className='w-96'> */}
                <DateRangePicker onChange={dat => {
                    setDateFilter({
                        end: dat.end.toDate("Asia/Kolkata").valueOf(),
                        start: dat.start.toDate("Asia/Kolkata").valueOf()
                    })
                }}>
                    <Group>
                        <DateInput slot="start">
                            {(segment) => <DateSegment segment={segment} />}
                        </DateInput>
                        <span aria-hidden="true">–</span>
                        <DateInput slot="end">
                            {(segment) => <DateSegment segment={segment} />}
                        </DateInput>
                        <Button>▼</Button>
                    </Group>
                    <Popover>
                        <AriaDialog>
                            <RangeCalendar>
                                <header>
                                    <Button slot="previous">◀</Button>
                                    <Heading />
                                    <Button slot="next">▶</Button>
                                </header>
                                <CalendarGrid>
                                    {(date) => <CalendarCell date={date} />}
                                </CalendarGrid>
                            </RangeCalendar>
                        </AriaDialog>
                    </Popover>
                </DateRangePicker>
                {/* </div> */}
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                customStyles={customStyles}
                responsive
                highlightOnHover
                pointerOnHover
                pagination
            />
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
                                            if (orderStatus == "dispatched" && (stringEmptyOrNull(trackingNum) || stringEmptyOrNull(shippingType))) {
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

export default OrderListTable