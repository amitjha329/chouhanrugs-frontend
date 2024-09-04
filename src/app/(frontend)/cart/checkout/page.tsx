import React from 'react'
import MainSection from '@/ui/frontend/Cart/Checkout/MainSection'
import getSiteData from '@/lib/actions/getSiteData'
import getAvailablePaymentOptions from '@/lib/actions/getAvailablePaymentOptions'
import getStripePublicKey from '@/lib/actions/getStripePublicKey'
import { getServerSession } from 'next-auth'
import AuthOpts from '@/lib/adapters/AuthOptions'
import getShippingList from '@/lib/actions/getShippingList'
import Script from 'next/script'
import getPaymentGatewayData from '@/lib/actions/getPaymentGatewayData'
import { generateClientToken } from '@/lib/utilities/paypal'
import { PaypalContextProvider } from '@/app/providers'

const CheckoutPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const [siteInfo, payOpts, stripeKey, session, shippingList, paypalData] = await Promise.all([getSiteData(), getAvailablePaymentOptions(), getStripePublicKey(), getServerSession(AuthOpts), getShippingList(), getPaymentGatewayData("PAYPAL")])

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            {
                paypalData.activation && !searchParams?.redirect_status ? <PaypalContextProvider client_token={await generateClientToken()} key_id={paypalData.key_id}>
                    <MainSection siteInfo={siteInfo} payOpts={payOpts} queryParams={searchParams} stripeKey={stripeKey} session={session} shippingList={shippingList} />
                </PaypalContextProvider> : <MainSection siteInfo={siteInfo} payOpts={payOpts} queryParams={searchParams} stripeKey={stripeKey} session={session} shippingList={shippingList} />
            }
        </>
    )
}

export default CheckoutPage