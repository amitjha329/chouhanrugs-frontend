'use client'
import ORDER_STAUTS from '@/lib/types/constants/order_status'
import React, { useEffect, useState } from 'react'

const OrderTrackingProgressbar = ({ orderStatus, className }: { orderStatus: string, className: string }) => {
    const [trackStatus, setTrackStatus] = useState(0)

    useEffect(() => {
        switch (orderStatus) {
            case ORDER_STAUTS.PENDING:
                setTrackStatus(0)
                break;
            case ORDER_STAUTS.PLACED:
                setTrackStatus(25)
                break;
            case ORDER_STAUTS.DISPATCHED:
                setTrackStatus(50)
                break;
            case ORDER_STAUTS.TRANSIT:
                setTrackStatus(75)
                break;
            case ORDER_STAUTS.OFDELIVERY:
                setTrackStatus(75)
                break;
            case ORDER_STAUTS.DELIVERED:
                setTrackStatus(100)
                break;
        }
    }, [])
    return (
        <div className={className}>
            <input type="range" min="0" max="100" value={trackStatus} className="!range !range-xs !range-primary" step="25" disabled />
            <div className="w-full flex justify-between text-xs px-2 mt-2">
                <span>Review</span>
                <span>Accepted</span>
                <span>Shipped</span>
                <span>Transit</span>
                <span>Delivered</span>
            </div>
        </div>
    )
}

export default OrderTrackingProgressbar