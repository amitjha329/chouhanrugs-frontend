'use client'
import stringEmptyOrNull from '@/lib/stringEmptyOrNull'
import onPageNotifications from '@/utils/onPageNotifications'
import { useRouter } from 'next/navigation'
import React from 'react'

const TrackOrderForm = () => {
    const [orderNum, setOrderNum] = React.useState<string>("")
    const router = useRouter()
    return (
        <>
            <input className='input input-bordered w-full max-w-xs' placeholder='Enter Order number' min={1} maxLength={16} value={orderNum} onChange={e => {
                const data = e.currentTarget.value;
                if (data.length == 14) {
                    setOrderNum([data.slice(0, 4), data.slice(4, 10), data.slice(10, 14)].join('-'))
                    return
                } else {
                    setOrderNum(data.replaceAll("-", ""))
                }
            }} />
            <button className='btn btn-primary w-full max-w-xs' onClick={e => {
                if (stringEmptyOrNull(orderNum)) {
                    onPageNotifications("error", "Please Enter Order Number First")
                    return;
                }
                if (orderNum.length < 16 || /[a-zA-Z]/g.test(orderNum)) {
                    onPageNotifications("error", "Please Enter Valid Order Number")
                    return;
                }
                router.push(`/user/orders/${orderNum}`)
            }}>Track Order</button>
        </>
    )
}

export default TrackOrderForm