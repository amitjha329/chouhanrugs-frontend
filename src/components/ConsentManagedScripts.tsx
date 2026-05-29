'use client'

import Script from 'next/script'
import { useCookieConsent } from '@/components/CookieConsentProvider'
import GoogleAdsConfigDataModel from '@/types/GoogleAdsConfigDataModel'

export default function ConsentManagedScripts({
    gtmId,
    googleAdsConfig,
}: {
    gtmId?: string
    googleAdsConfig: GoogleAdsConfigDataModel
}) {
    const { isLoaded, preferences } = useCookieConsent()

    if (!isLoaded) return null

    const allowAnalytics = preferences.analytics
    const allowMarketing = preferences.marketing
    const shouldLoadGtm = allowMarketing && gtmId
    const shouldLoadGtag = googleAdsConfig.gtagId && (allowAnalytics || allowMarketing)

    return (
        <>
            {shouldLoadGtm ? (
                <Script
                    id="gtm-script"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${gtmId}');`
                    }}
                />
            ) : null}

            {shouldLoadGtag ? (
                <>
                    <Script
                        id="gtag-js"
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsConfig.gtagId}`}
                    />
                    <Script
                        id="gtag-init"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                                gtag('consent', 'default', {
                                    analytics_storage: '${allowAnalytics ? 'granted' : 'denied'}',
                                    ad_storage: '${allowMarketing ? 'granted' : 'denied'}',
                                    ad_user_data: '${allowMarketing ? 'granted' : 'denied'}',
                                    ad_personalization: '${allowMarketing ? 'granted' : 'denied'}'
                                });
                                gtag('js', new Date());
                                ${allowAnalytics ? `gtag('config', '${googleAdsConfig.gtagId}');` : ''}
                                ${allowMarketing && googleAdsConfig.code ? `gtag('config', '${googleAdsConfig.code}');` : ''}
                            `
                        }}
                    />
                </>
            ) : null}
        </>
    )
}
