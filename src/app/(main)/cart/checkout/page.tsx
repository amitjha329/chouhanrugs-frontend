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
import getCurrencyList from '@/backend/serverActions/getCurrencyList'
import getUserCartitems from '@/backend/serverActions/getUserCartitems'
import dynamic from 'next/dynamic'

const GuestMainSection = dynamic(() => import('@/ui/Cart/Checkout/GuestMainSection'))

const CheckoutPage = async (
    props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) => {
    const searchParams = await props.searchParams;
    const [siteInfo, payOpts, stripeKey, session, shippingList, paypalData, currencyList] = await Promise.all([getSiteData(), getAvailablePaymentOptions(), getStripePublicKey(), auth(), getShippingList(), getPaymentGatewayData("PAYPAL"), getCurrencyList()])
    // const cookie = await cookies()
    // const userCurrency = cookie.get('userCurrency')?.value ? JSON.parse(cookie.get('userCurrency')!.value) : currencyList[0]
    const cart = await getUserCartitems((session?.user as { id: string })?.id)

    // if(cart.length === 0) {
    //     redirect('/cart')
    // }

    // Render guest section if not logged in
    if (!session || !session.user) {
        return <GuestMainSection userCurrency={{
            _id: "",
            active: true,
            currency: "USD",
            exchangeRates: 1,
            ISO: "US",
            country: "US",
            currencySymbol: "$",
            default: true
        }} />
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            {
                paypalData.activation && !searchParams?.redirect_status ? <PaypalContextProvider client_token={await generateClientToken()} key_id={paypalData.key_id}>
                    <MainSection siteInfo={siteInfo} payOpts={payOpts} queryParams={searchParams} stripeKey={stripeKey} session={session} shippingList={shippingList} userCurrency={{
                        _id: "",
                        active: true,
                        currency: "USD",
                        exchangeRates: 1,
                        ISO: "US",
                        country: "US",
                        currencySymbol: "$",
                        default: true
                    }} />
                </PaypalContextProvider> : <MainSection siteInfo={siteInfo} payOpts={payOpts} queryParams={searchParams} stripeKey={stripeKey} session={session} shippingList={shippingList} userCurrency={{
                    _id: "",
                    active: true,
                    currency: "USD",
                    exchangeRates: 1,
                    ISO: "US",
                    country: "US",
                    currencySymbol: "$",
                    default: true
                }} />
            }
        </>
    )
}

export default CheckoutPage