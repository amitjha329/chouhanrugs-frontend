'use client'
import saveAnalyticsToolsData from '@/lib/actions/saveAnalyticsToolsData'
import AnalyticsAndVerificationDataModel from '@/lib/types/AnalyticsAndVerificationDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import clsx from 'clsx'
import React, { FormEventHandler, useState } from 'react'

type propTypes = {
    data: AnalyticsAndVerificationDataModel
}

const BingForm = ({ data }: propTypes) => {
    const [tag_id, setRzPayKID] = useState<string>(data.code)
    const handleGTMChange: FormEventHandler = (e) => {
        e.preventDefault()
        saveAnalyticsToolsData("BING", tag_id).then((response) => {
            if (response.ack) {
                onPageNotifications("success", "Bing Site Verification Configuration Update").catch(e => console.log(e))
            } else {
                if (response.result.code == "NO_DATA") {
                    onPageNotifications("error", "Bing Site Verification Update Failed, No Data Passed.").catch(e => console.log(e))
                }
                onPageNotifications("error", "Check Log For Details.").catch(e => console.log(e))
                console.error(response.result)
            }
        }).catch(e => console.log(e))
    }
    return (
        <form id='rzp_form' onSubmit={handleGTMChange}>
            <div className='card-body'>
                <div className='card-title'>Bing Site Verification Code</div>
                <label className='join join-vertical overflow-hidden' >
                    <span className='join-item bg-gray-200 p-2'>Bing Site Verification Code</span>
                    <input type="text" className={clsx('join-item input input-bordered w-full')} name="cdn_domain" placeholder='Ex: 56BN1N1C4F5C4F5NN1C4F51N1C4F5C4F5789' required onChange={e => setRzPayKID(e.currentTarget.value)} value={tag_id} />
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='rzp_form'>Update</button>

                </div>
            </div>
        </form>
    )
}

export default BingForm