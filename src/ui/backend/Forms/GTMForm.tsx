'use client'
import saveAnalyticsToolsData from '@/lib/actions/saveAnalyticsToolsData'
import AnalyticsAndVerificationDataModel from '@/lib/types/AnalyticsAndVerificationDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import clsx from 'clsx'
import React, { FormEventHandler, useState } from 'react'

type propTypes = {
    data: AnalyticsAndVerificationDataModel
}

const GTMForm = ({ data }: propTypes) => {
    const [tag_id, setRzPayKID] = useState<string>(data.code)
    const handleGTMChange: FormEventHandler = (e) => {
        e.preventDefault()
        saveAnalyticsToolsData("GOOGLE", tag_id).then((response) => {
            if (response.ack) {
                onPageNotifications("success", "Google Tag Manager Configuration Update").catch(e => console.log(e))
            } else {
                if (response.result.code == "NO_DATA") {
                    onPageNotifications("error", "Google Tag Manager Update Failed, No Data Passed.").catch(e => console.log(e))
                }
                onPageNotifications("error", "Check Log For Details.").catch(e => console.log(e))
                console.error(response.result)
            }
        }).catch(e => console.log(e))
    }
    return (
        <form id='rzp_form' onSubmit={handleGTMChange}>
            <div className='card-body'>
                <div className='card-title'>Google Tag manager</div>
                <label className='join join-vertical overflow-hidden' >
                    <span className='join-item bg-gray-200 p-2'>Google Tag manager Id</span>
                    <input type="text" className={clsx('input input-bordered w-full join-item')} name="cdn_domain" placeholder='Ex: G-TN1C4F5789' required onChange={e => setRzPayKID(e.currentTarget.value)} value={tag_id} />
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='rzp_form'>Update</button>

                </div>
            </div>
        </form>
    )
}

export default GTMForm