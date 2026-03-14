import getGoogleAdsConfig from '@/backend/serverActions/getGoogleAdsConfig'
import React from 'react'

type propTypes = {
    orderId: string
    orderValue: number
    currency: string
}

const GtagEvent = async ({ orderId, orderValue, currency }: propTypes) => {
    const config = await getGoogleAdsConfig()
    if (!config.code || !config.conversionLabels.purchase) return null

    return <script
        dangerouslySetInnerHTML={{
            __html: `
                if (typeof gtag === 'function') {
                    gtag('event', 'conversion', {
                        'send_to': '${config.code}/${config.conversionLabels.purchase}',
                        'value': ${orderValue},
                        'currency': '${currency}',
                        'transaction_id': '${orderId}'
                    });
                }
            `
        }}
    />
}

export default GtagEvent