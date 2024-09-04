'use client'
import savePaymentGatewayForm, { paymentGatewayActivation } from '@/lib/actions/savePaymentGatewayForm'
import PaymentGatewayDataModel from '@/lib/types/PaymentGatewayDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import clsx from 'clsx'
import React, { FormEventHandler, useState } from 'react'

type propTypes = {
    data: PaymentGatewayDataModel
}

const PaytmForm = ({ data }: propTypes) => {
    const [paytm_key_id, setpaytmKID] = useState(data.key_id)
    const [paytm_key_secret, setpaytmKSecret] = useState(data.key_secret??"")
    const [paytm_activation] = useState(data.activation)
    const handlepaytmChange: FormEventHandler = (e) => {
        e.preventDefault()
        savePaymentGatewayForm("PAYTM", paytm_key_id, paytm_key_secret).then((response) => {
            if (response.ack) {
                onPageNotifications("success", "Paytm Configuration Updated").catch(e => console.log(e))
            } else {
                if (response.result.code == "NO_DATA") {
                    onPageNotifications("error", "Paytm Update Failed, No Data Passed.").catch(e => console.log(e))
                }
                onPageNotifications("error", "Check Log For Details.").catch(e => console.log(e))
                console.error(response.result)
            }
        }).catch(e => console.log(e))
    }
    const paytmActivation = (activation: boolean) => {
        paymentGatewayActivation("PAYTM", activation).then((response) => {
            if (response.ack) {
                onPageNotifications("success", "Paytm Configuration Update").then(() => {
                    window.location.reload()
                }).catch(e => console.log(e))
            } else {
                onPageNotifications("error", "Failed!! Check Log For Details.").catch(e => console.log(e))
                console.log(response.result)
            }
        }).catch(e => console.log(e))
    }
    return (
        <form id='paytm_form' onSubmit={handlepaytmChange}>
            <div className='card-body'>
                <div className='card-title'>Paytm Integration (<span className={clsx(paytm_activation ? 'text-success' : 'text-error')}>{paytm_activation ? "Active" : "Inactive"}</span>)</div>
                <label className='join join-vertical overflow-hidden'>
                    <span className='join-item bg-gray-200 p-2'>KEY ID</span>
                    <input type="text" className={clsx('input input-bordered w-full join-item')} name="cdn_domain" placeholder='Paytm Key ID' required onChange={e => setpaytmKID(e.currentTarget.value)} value={paytm_key_id} />
                </label>
                <label className='join join-vertical overflow-hidden'>
                    <span className='join-item bg-gray-200 p-2'>KEY SECRET</span>
                    <input type="text" className={clsx('input input-bordered w-full join-item')} name="cdn_domain" placeholder='Paytm Key Secret' required onChange={e => setpaytmKSecret(e.currentTarget.value)} value={paytm_key_secret} />
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='paytm_form'>Update</button>
                    <button type='button' className={clsx('btn ', paytm_activation ? 'btn-error' : 'btn-success')} form='paytm_form' onClick={e => paytmActivation(!paytm_activation)}>{paytm_activation ? "Deactivate" : "Activate"}</button>
                </div>
            </div>
        </form>
    )
}

export default PaytmForm