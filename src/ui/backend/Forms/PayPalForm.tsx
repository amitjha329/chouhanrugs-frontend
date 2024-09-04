'use client'
import savePaymentGatewayForm, { paymentGatewayActivation } from '@/lib/actions/savePaymentGatewayForm'
import PaymentGatewayDataModel from '@/lib/types/PaymentGatewayDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import clsx from 'clsx'
import React, { FormEventHandler, useState } from 'react'

type propTypes = {
    data: PaymentGatewayDataModel
}

const PayPalForm = ({ data }: propTypes) => {
    const [paypal_key_id, setpaypalKID] = useState(data.key_id)
    const [paypal_key_secret, setpaypalKSecret] = useState(data.key_secret??"")
    const [paypal_activation] = useState(data.activation)
    const handlepaypalChange: FormEventHandler = (e) => {
        e.preventDefault()
        savePaymentGatewayForm("PAYPAL", paypal_key_id, paypal_key_secret).then((response) => {
            if (response.ack) {
                onPageNotifications("success", "PayPal Configuration Updated").catch(e => console.log(e))
            } else {
                if (response.result.code == "NO_DATA") {
                    onPageNotifications("error", "PayPal Update Failed, No Data Passed.").catch(e => console.log(e))
                }
                onPageNotifications("error", "Check Log For Details.").catch(e => console.log(e))
                console.error(response.result)
            }
        }).catch(e => console.log(e))
    }
    const paypalActivation = (activation: boolean) => {
        paymentGatewayActivation("PAYPAL", activation).then((response) => {
            if (response.ack) {
                onPageNotifications("success", "PayPal Configuration Update").then(() => {
                    window.location.reload()
                }).catch(e => console.log(e))
            } else {
                onPageNotifications("error", "Failed!! Check Log For Details.").catch(e => console.log(e))
                console.log(response.result)
            }
        }).catch(e => console.log(e))
    }
    return (
        <form id='paypal_form' onSubmit={handlepaypalChange}>
            <div className='card-body'>
                <div className='card-title'>PayPal Integration (<span className={clsx(paypal_activation ? 'text-success' : 'text-error')}>{paypal_activation ? "Active" : "Inactive"}</span>)</div>
                <label className='join join-vertical overflow-hidden'>
                    <span className='join-item bg-gray-200 p-2'>KEY ID</span>
                    <input type="text" className={clsx('input input-bordered w-full join-item')} name="cdn_domain" placeholder='PayPal Key ID' required onChange={e => setpaypalKID(e.currentTarget.value)} value={paypal_key_id} />
                </label>
                <label className='join join-vertical overflow-hidden'>
                    <span className='join-item bg-gray-200 p-2'>KEY SECRET</span>
                    <input type="text" className={clsx('input input-bordered w-full join-item')} name="cdn_domain" placeholder='PayPal Key Secret' required onChange={e => setpaypalKSecret(e.currentTarget.value)} value={paypal_key_secret} />
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='paypal_form'>Update</button>
                    <button type='button' className={clsx('btn ', paypal_activation ? 'btn-error' : 'btn-success')} form='paypal_form' onClick={e => paypalActivation(!paypal_activation)}>{paypal_activation ? "Deactivate" : "Activate"}</button>
                </div>
            </div>
        </form>
    )
}

export default PayPalForm