import getGoogleAdsConfig from '@/backend/serverActions/getGoogleAdsConfig'
import React from 'react'

type PurchaseItem = {
    item_id: string
    item_name: string
    item_category?: string
    item_brand?: string
    item_variant?: string
    price: number
    quantity: number
}

type propTypes = {
    orderId: string
    orderValue: number
    currency: string
    items: PurchaseItem[]
}

const GtagEvent = async ({ orderId, orderValue, currency, items }: propTypes) => {
    const config = await getGoogleAdsConfig()
    if (!config.code || !config.conversionLabels.purchase) return null

    const purchaseItems = JSON.stringify(items)

    return <script
        dangerouslySetInnerHTML={{
            __html: `
                (function() {
                    if (typeof window === 'undefined') return;
                    var transactionKey = 'chouhanrugs_purchase_tracked_${orderId}';
                    if (window.sessionStorage && window.sessionStorage.getItem(transactionKey) === 'true') {
                        return;
                    }

                    var purchasePayload = {
                        transaction_id: '${orderId}',
                        value: ${orderValue},
                        currency: '${currency}',
                        items: ${purchaseItems}
                    };

                    if (typeof window.gtag === 'function') {
                        window.gtag('event', 'conversion', {
                            send_to: '${config.code}/${config.conversionLabels.purchase}',
                            value: ${orderValue},
                            currency: '${currency}',
                            transaction_id: '${orderId}'
                        });
                        window.gtag('event', 'purchase', purchasePayload);
                    } else {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                            event: 'conversion',
                            send_to: '${config.code}/${config.conversionLabels.purchase}',
                            value: ${orderValue},
                            currency: '${currency}',
                            transaction_id: '${orderId}'
                        });
                        window.dataLayer.push({
                            event: 'purchase',
                            ...purchasePayload
                        });
                    }

                    if (window.sessionStorage) {
                        window.sessionStorage.setItem(transactionKey, 'true');
                    }
                })();
            `
        }}
    />
}

export default GtagEvent