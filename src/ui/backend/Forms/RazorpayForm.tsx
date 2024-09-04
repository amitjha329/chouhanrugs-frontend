'use client'
import savePaymentGatewayForm, { paymentGatewayActivation } from '@/lib/actions/savePaymentGatewayForm'
import PaymentGatewayDataModel from '@/lib/types/PaymentGatewayDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import clsx from 'clsx'
import React, { FormEventHandler, useState } from 'react'

type propTypes = {
    data: PaymentGatewayDataModel
}

const RazorpayForm = ({ data }: propTypes) => {
    const [razorpay_key_id, setRzPayKID] = useState<string>(data.key_id)
    const [razorpay_key_secret, setRzPayKSecret] = useState<string>(data.key_secret ?? "")
    const [razorpay_activation] = useState(data.activation)
    const handleRazorpayChange: FormEventHandler = (e) => {
        e.preventDefault()
        savePaymentGatewayForm("RZP", razorpay_key_id, razorpay_key_secret).then((response) => {
            if (response.ack) {
                onPageNotifications("success", "Razorpay Configuration Update").catch(e => console.log(e))
            } else {
                if (response.result.code == "NO_DATA") {
                    onPageNotifications("error", "Razorpay Update Failed, No Data Passed.").catch(e => console.log(e))
                }
                onPageNotifications("error", "Check Log For Details.").catch(e => console.log(e))
                console.error(response.result)
            }
        }).catch(e => console.log(e))
    }
    const rzpayActivation = (activation: boolean) => {
        paymentGatewayActivation("RZP", activation).then((response) => {
            if (response.ack) {
                onPageNotifications("success", "Razorpay Configuration Update").then(() => {
                    window.location.reload()
                }).catch(e => console.log(e))
            } else {
                onPageNotifications("error", "Failed!! Check Log For Details.").catch(e => console.log(e))
                console.error(response.result)
            }
        }).catch(e => console.log(e))
    }
    return (
        <form id='rzp_form' onSubmit={handleRazorpayChange}>
            <div className='card-body'>
                <div className='card-title'>Razorpay Integration (<span className={clsx(razorpay_activation ? 'text-success' : 'text-error')}>{razorpay_activation ? "Active" : "Inactive"}</span>)</div>
                < label className='join join-vertical overflow-hidden' >
                    <span className='join-item bg-gray-200 p-2'>KEY ID</span>
                    <input type="text" className={clsx('input input-bordered w-full join-item')} name="cdn_domain" placeholder='Razorpay Key ID' required onChange={e => setRzPayKID(e.currentTarget.value)} value={razorpay_key_id} />
                </label>
                <label className='join join-vertical overflow-hidden'>
                    <span className='join-item bg-gray-200 p-2'>KEY SECRET</span>
                    <input type="text" className={clsx('input input-bordered w-full join-item')} name="cdn_domain" placeholder='Razorpay Key Secret' required onChange={e => setRzPayKSecret(e.currentTarget.value)} value={razorpay_key_secret} />
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='rzp_form'>Update</button>
                    <button type='button' className={clsx('btn ', razorpay_activation ? 'btn-error' : 'btn-success')} form='rzp_form' onClick={e => rzpayActivation(!razorpay_activation)}>{razorpay_activation ? "Deactivate" : "Activate"}</button>
                </div>
            </div>
        </form>
    )
}

export default RazorpayForm