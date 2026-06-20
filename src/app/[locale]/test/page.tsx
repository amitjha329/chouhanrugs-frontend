import React from 'react'
import { notFound } from 'next/navigation'
import TrustSection from './TrustSection'
import CategoryOptionsSwitcher from './CategoryOptions'
import RoomOptionsSwitcher from './RoomOptions'
import { getHomePagePopularCategories } from '@/backend/serverActions/getHomePagePopularCategories'
import { getTranslations, getLocale } from 'next-intl/server'
import { type Locale } from '@/i18n/routing'

const TestPage = async () => {
    if (process.env.NODE_ENV === 'production') {
        notFound()
    }

    const [dynamicSection, tHomepage, tCommon, loc] = await Promise.all([
        getHomePagePopularCategories(),
        getTranslations('homepage'),
        getTranslations('common'),
        getLocale(),
    ])
    const locale = loc as Locale

    return (
        <div className="bg-[#fbf7ef] min-h-screen">
            <CategoryOptionsSwitcher
                dynamicSection={dynamicSection}
                tHomepage={{
                    ourPopularCategories: tHomepage('ourPopularCategories')
                }}
                tCommon={{
                    viewAll: tCommon('viewAll')
                }}
                locale={locale}
            />
            <div className="py-8">
                <TrustSection />
            </div>
            <div className="py-8">
                <RoomOptionsSwitcher />
            </div>
        </div>
    )
}

export default TestPage