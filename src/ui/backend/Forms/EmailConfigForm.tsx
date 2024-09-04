'use client'
import AckResponse from '@/lib/types/AckResponse'
import axiosInstance from '@/lib/utilities/axiosInastances'
import onPageNotifications from '@/ui/common/onPageNotifications'
import clsx from 'clsx'
import React, { FormEventHandler, useState } from 'react'

type propTypes = {
    HOST: string,
    PORT: number,
    USER: string,
    PASS: string
}

const EmailConfigForm = ({ HOST, PASS, PORT, USER }: propTypes) => {
    const [smtpHost, setSmtpHost] = useState(HOST)
    const [smtpPort, setSmtpPort] = useState<number>(PORT)
    const [smtpUser, setSmtpUser] = useState(USER)
    const [smtpPass, setSmtpPass] = useState("⚫⚫⚫⚫⚫⚫⚫⚫")

    const handleEmailConfig: FormEventHandler = (e) => {
        e.preventDefault()
        axiosInstance().post('/admin/core/emailupdate', { smtpHost, smtpPass, smtpPort, smtpUser }).then(({ data }: { data: AckResponse }) => {
            if (data.ack) {
                onPageNotifications("success", "Email Configuration Update")
            } else {
                if (data.result.code == "NO_DATA") {
                    onPageNotifications("error", "Email Conig Update Failed, No Data Passed.")
                }
                onPageNotifications("error", "Check Log For Details.")
                console.error(data.result)
            }
        })
    }
    return (
        <form id='smtp_form' onSubmit={handleEmailConfig}>
            <div className='card-body'>
                <div className='card-title'>Email Configuration</div>
                <label className='join join-vertical overflow-hidden'>
                    <span className='join-item bg-gray-200 p-2'>SMTP Host:Port</span>
                    <div className='join input input-bordered w-full px-0 items-center'>
                        <input type="text" className={clsx('join-item w-full h-full input border-none ring-0 !rounded-t-none !rounded-r-none !rounded-bl-md')} name="cdn_domain" required value={smtpHost} onChange={e => { setSmtpHost(e.target.value) }} />
                        <span className='join-item bg-none h-full font-semibold text-3xl'>:</span>
                        <input type="number" className={clsx('join-item w-[150px] h-full input border-none ring-0 !rounded-t-none !rounded-bl-none')} name="cdn_domain" required value={smtpPort} onChange={e => { setSmtpPort(Number(e.target.value)) }} />
                    </div>
                </label>
                <label className='join join-vertical overflow-hidden'>
                    <span className='join-item bg-gray-200 p-2'>SMTP Username</span>
                    <div className='join-item input input-bordered w-full px-0'>
                        <input type="email" className={clsx('w-full border-none ring-0 !rounded-t-none input input-ghost')} name="cdn_domain" required value={smtpUser} onChange={e => { setSmtpUser(e.target.value) }} />
                    </div>
                </label>
                <label className='join join-vertical overflow-hidden'>
                    <span className='join-item bg-gray-200 p-2'>SMTP Password</span>
                    <div className='join-item input input-bordered w-full px-0'>
                        <input type="password" className={clsx('w-full border-none ring-0 !rounded-t-none !rounded-bl-md input-ghost input')} name="cdn_domain" required value={smtpPass} onChange={e => { setSmtpPass(e.target.value) }} />
                    </div>
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='smtp_form'>Save Config</button>
                </div>
            </div>
        </form>
    )
}

export default EmailConfigForm