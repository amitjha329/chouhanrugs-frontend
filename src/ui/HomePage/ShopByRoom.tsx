import React from 'react'
import SectionTitle from '../SectionTitle'
import { getLocale, getTranslations } from 'next-intl/server'
import { type Locale } from '@/i18n/routing'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { getHomePageShopByRoom } from '@/backend/serverActions/getHomePageShopByRoom'

const ShopByRoom = async () => {
    const [t, loc, data] = await Promise.all([
        getTranslations('homepage'),
        getLocale(),
        getHomePageShopByRoom(),
    ])
    const locale = loc as Locale
    const sectionHeadingTag = (data?.sectionHeadingTag || 'div') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'

    const items = data?.content?.length
        ? data.content.map((item, idx) => ({
            id: item.id || (idx + 1),
            title: resolveLocalizedString(item.title, locale),
            content: resolveLocalizedString(item.content, locale),
        }))
        : [
            { id: 1, title: t('areaRugs'), content: t('areaRugsDesc') },
            { id: 2, title: t('bedRoomRugs'), content: t('bedRoomRugsDesc') },
            { id: 3, title: t('diningRoomRugs'), content: t('diningRoomRugsDesc') },
            { id: 4, title: t('livingRoomRugs'), content: t('livingRoomRugsDesc') },
        ]

    return (
        <div className="py-16 px-4 bg-secondary/50">
            <div className='fluid_container'>
                <SectionTitle title={t('shopByRoom')} className='text-center mb-12' headingTag={sectionHeadingTag} />
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-12">
                    {items.map(item => (
                        <div key={item.id} className="flex items-start">
                            <div className="text-9xl text-secondary font-bold">{item.id}</div>
                            <div className="ml-6">
                                <div className="~text-lg/xl">{item.title}</div>
                                <p className="mt-2 text-neutral-700 font-light text-sm">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ShopByRoom