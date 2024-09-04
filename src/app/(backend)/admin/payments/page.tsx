import getPaymentGatewayData from '@/lib/actions/getPaymentGatewayData'
import PayPalForm from '@/ui/backend/Forms/PayPalForm'
import PaytmForm from '@/ui/backend/Forms/PaytmForm'
import RazorpayForm from '@/ui/backend/Forms/RazorpayForm'
import StripeForm from '@/ui/backend/Forms/StripeForm'
import clsx from 'clsx'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Payment Gateway Configuration',
}

const PaymentGatewayConfigPage = async () => {
    const [rzpData, stripeData, paytmData, paypalData] = await Promise.all([getPaymentGatewayData("RZP"), getPaymentGatewayData("STRIPE"), getPaymentGatewayData("PAYTM"), getPaymentGatewayData("PAYPAL")])
    return (
        <>
            <div className={clsx('card card-normal bg-white', rzpData.activation ? 'shadow-[inset_0_-2px_4px_rgba(0,255,0,0.5)]' : 'shadow-[inset_0_-2px_4px_rgba(255,0,0,0.5)]')}>
                <RazorpayForm data={rzpData} />
            </div>
            <div className={clsx('card card-normal bg-white mt-5', stripeData.activation ? 'shadow-[inset_0_-2px_4px_rgba(0,255,0,0.5)]' : 'shadow-[inset_0_-2px_4px_rgba(255,0,0,0.5)]')}>
                <StripeForm data={stripeData} />
            </div>
            <div className={clsx('card card-normal bg-white mt-5', paypalData.activation ? 'shadow-[inset_0_-2px_4px_rgba(0,255,0,0.5)]' : 'shadow-[inset_0_-2px_4px_rgba(255,0,0,0.5)]')}>
                <PayPalForm data={paypalData} />
            </div>
            <div className={clsx('card card-normal bg-white mt-5', paytmData.activation ? 'shadow-[inset_0_-2px_4px_rgba(0,255,0,0.5)]' : 'shadow-[inset_0_-2px_4px_rgba(255,0,0,0.5)]')}>
                <PaytmForm data={paytmData} />
            </div>
        </>
    )
}

export default PaymentGatewayConfigPage