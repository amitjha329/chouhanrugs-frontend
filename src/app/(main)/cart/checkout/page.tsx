import React from 'react'
import { PaypalContextProvider } from '@/app/providers'
import { auth } from '@/auth'
import getAvailablePaymentOptions from '@/backend/serverActions/getAvailablePaymentOptions'
import getPaymentGatewayData from '@/backend/serverActions/getPaymentGatewayData'
import getShippingList from '@/backend/serverActions/getShippingList'
import getSiteData from '@/backend/serverActions/getSiteData'
import getStripePublicKey from '@/backend/serverActions/getStripePublicKey'
import { generateClientToken } from '@/backend/serverActions/paypal'
import MainSection from '@/ui/Cart/Checkout/MainSection'
import Script from 'next/script'
import { cookies } from 'next/headers'
import getCurrencyList from '@/backend/serverActions/getCurrencyList'

const CheckoutPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const [siteInfo, payOpts, stripeKey, session, shippingList, paypalData, currencyList] = await Promise.all([getSiteData(), getAvailablePaymentOptions(), getStripePublicKey(), auth(), getShippingList(), getPaymentGatewayData("PAYPAL"), getCurrencyList()])
    const cookie = cookies()
    const userCurrency = cookie.get('userCurrency')?.value ? JSON.parse(cookie.get('userCurrency')!.value) : currencyList[0]

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            {
                paypalData.activation && !searchParams?.redirect_status ? <PaypalContextProvider client_token={await generateClientToken()} key_id={paypalData.key_id}>
                    <MainSection siteInfo={siteInfo} payOpts={payOpts} queryParams={searchParams} stripeKey={stripeKey} session={session} shippingList={shippingList} userCurrency={userCurrency} />
                </PaypalContextProvider> : <MainSection siteInfo={siteInfo} payOpts={payOpts} queryParams={searchParams} stripeKey={stripeKey} session={session} shippingList={shippingList} userCurrency={userCurrency} />
            }
        </>
    )
}

export default CheckoutPage