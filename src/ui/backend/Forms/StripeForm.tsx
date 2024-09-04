'use client'
import savePaymentGatewayForm, { paymentGatewayActivation } from '@/lib/actions/savePaymentGatewayForm'
import PaymentGatewayDataModel from '@/lib/types/PaymentGatewayDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import clsx from 'clsx'
import React, { FormEventHandler, useState } from 'react'

type propTypes = {
    data: PaymentGatewayDataModel
}

const StripeForm = ({ data }: propTypes) => {
    const [stripe_key_id, setStripeKID] = useState(data.key_id)
    const [stripe_key_secret, setStripeKSecret] = useState(data.key_secret ?? "")
    const [stripe_wb_secret, setStripeWBSecret] = useState(data.webhook_secret)
    const [stripe_activation] = useState(data.activation)
    const handleStripeChange: FormEventHandler = (e) => {
        e.preventDefault()
        savePaymentGatewayForm("STRIPE", stripe_key_id, stripe_key_secret, stripe_wb_secret).then((response) => {
            if (response.ack) {
                onPageNotifications("success", "Stripe Configuration Updated").catch(e => console.log(e))
            } else {
                if (response.result.code == "NO_DATA") {
                    onPageNotifications("error", "Stripe Update Failed, No Data Passed.").catch(e => console.log(e))
                }
                onPageNotifications("error", "Check Log For Details.").catch(e => console.log(e))
                console.error(response.result)
            }
        }).catch(e => console.log(e))
    }
    const stripeActivation = (activation: boolean) => {
        paymentGatewayActivation("STRIPE", activation).then((response) => {
            if (response.ack) {
                onPageNotifications("success", "Razorpay Configuration Update").then(() => {
                    window.location.reload()
                }).catch(e => console.log(e))
            } else {
                onPageNotifications("error", "Failed!! Check Log For Details.").catch(e => console.log(e))
                console.log(response.result)
            }
        }).catch(e => console.log(e))
    }
    return (
        <form id='stripe_form' onSubmit={handleStripeChange}>
            <div className='card-body'>
                <div className='card-title'>Stripe Integration (<span className={clsx(stripe_activation ? 'text-success' : 'text-error')}>{stripe_activation ? "Active" : "Inactive"}</span>)</div>
                <label className='input-group input-group-lg input-group-vertical overflow-hidden'>
                    <span>KEY ID</span>
                    <input type="text" className={clsx('input input-bordered w-full')} name="cdn_domain" placeholder='Stripe Key ID' required onChange={e => setStripeKID(e.currentTarget.value)} value={stripe_key_id} />
                </label>
                <label className='input-group input-group-lg input-group-vertical overflow-hidden'>
                    <span>KEY SECRET</span>
                    <input type="text" className={clsx('input input-bordered w-full')} name="cdn_domain" placeholder='Stripe Key Secret' required onChange={e => setStripeKSecret(e.currentTarget.value)} value={stripe_key_secret} />
                </label>
                <label className='input-group input-group-lg input-group-vertical overflow-hidden'>
                    <span>WEBHOOK SECRET</span>
                    <input type="text" className={clsx('input input-bordered w-full')} name="cdn_domain" placeholder='Stripe Key Secret' required onChange={e => setStripeWBSecret(e.currentTarget.value)} value={stripe_wb_secret} />
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='stripe_form'>Update</button>
                    <button type='button' className={clsx('btn ', stripe_activation ? 'btn-error' : 'btn-success')} form='stripe_form' onClick={e => stripeActivation(!stripe_activation)}>{stripe_activation ? "Deactivate" : "Activate"}</button>
                </div>
            </div>
        </form>
    )
}

export default StripeForm