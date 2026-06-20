import React from 'react'
import TrustSection from './TrustSection'
import HeaderOptionsSwitcher from './HeaderOptions'
import { getSession } from '@/lib/auth-server'
import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import getSiteData from '@/backend/serverActions/getSiteData'
import { getTranslations } from 'next-intl/server'

const TestPage = async () => {
    const [session, categories, siteData, t] = await Promise.all([
        getSession(),
        getCategoriesList(),
        getSiteData(),
        getTranslations('nav'),
    ])

    const marketplaceLinks = (siteData.marketplaceLinks ?? []).filter(link => link.enabled && link.url)

    const labels = {
        home: t('home'),
        aboutUs: t('aboutUs'),
        contact: t('contact'),
        blog: t('blog'),
        policies: t('policies'),
        terms: t('termsShort'),
    }

    return (
        <>
            <HeaderOptionsSwitcher
                session={session}
                categories={categories}
                siteData={siteData}
                marketplaceLinks={marketplaceLinks}
                labels={labels}
            />
            <TrustSection />
        </>
    )
}

export default TestPage