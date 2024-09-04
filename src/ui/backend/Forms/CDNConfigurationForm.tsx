'use client'
import AckResponse from '@/lib/types/AckResponse'
import axiosInstance from '@/lib/utilities/axiosInastances'
import onPageNotifications from '@/ui/common/onPageNotifications'
import clsx from 'clsx'
import React, { FormEventHandler, useState } from 'react'
import { BsPencil } from 'react-icons/bs'

type propTypes = {
    CDN_URL: string
}

const CDNConfigurationForm = ({ CDN_URL }: propTypes) => {
    const [cdn, setCDN] = useState(CDN_URL)
    const [editingCDN, setCDNEditing] = useState(false)
    const handleConfigChange: FormEventHandler = (e) => {
        e.preventDefault()
        axiosInstance().post('/admin/core/cdnupdate', { CDNURL: cdn }).then(({ data }: { data: AckResponse }) => {
            if (data.ack) {
                onPageNotifications("success", "CDN Configuration Update")
            } else {
                if (data.result.code == "NO_DATA") {
                    onPageNotifications("error", "CDN Update Failed, No Data Passed.")
                }
                onPageNotifications("error", "Check Log For Details.")
                console.error(data.result)
            }
        })
    }
    return (
        <form id='site_core' onSubmit={handleConfigChange}>
            <div className='card-body'>
                <div className='card-title'>CDN Configuration</div>
                <label className='join join-vertical overflow-hidden'>
                    <span className='join-item bg-gray-200 p-2'>Content Delivery Network Domain(CDN)</span>
                    <div className='join-item join input input-bordered w-full px-0'>
                        <input pattern="^((?!-)[A-Za-z0-9-]{1,63}(?<!-).)+[A-Za-z]{2,6}$" type="text" className={clsx({ 'input-disabled': !editingCDN }, 'w-full border-none ring-0 !rounded-t-none !rounded-br-none !rounded-bl-md input')} name="cdn_domain" placeholder='*.domain.com, Ex.: cdn.example.com or example.com' required onChange={e => setCDN(e.currentTarget.value)} value={cdn} disabled={!editingCDN} />
                        <button type='button' className='px-5 btn !rounded-bl-none !rounded-t-none' onClick={() => { setCDNEditing(!editingCDN) }}><BsPencil className='w-7' /></button>
                    </div>
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='site_core'>Save Config</button>
                </div>
            </div>
        </form>
    )
}

export default CDNConfigurationForm