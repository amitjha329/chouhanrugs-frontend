import React from 'react'
import { getLocale, getTranslations } from 'next-intl/server'
import { type Locale } from '@/i18n/routing'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { getHomePageShopByRoom } from '@/backend/serverActions/getHomePageShopByRoom'
import ShopByRoomClient from './ShopByRoomClient'

const roomImages = [
    '/test/room-entryway.png',
    '/test/room-bedroom.png',
    '/test/room-dining.png',
    '/test/room-living.png'
]

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
            image: item.image || roomImages[idx % roomImages.length],
        }))
        : [
            { id: 1, title: 'Entryway / Hallway', content: t('areaRugsDesc') || 'This area has heavy foot traffic, so choose a long runner rug. Darker shades and durable jute materials hide dirt easily.', image: roomImages[0] },
            { id: 2, title: 'Bedroom', content: t('bedRoomRugsDesc') || 'The bedroom is a relaxing sanctuary. Select soft, textured rugs with a cohesive color scheme, placed under or alongside the bed.', image: roomImages[1] },
            { id: 3, title: 'Dining Room', content: t('diningRoomRugsDesc') || 'The dining room needs a flat-weave or durable jute rug that fits completely under the table and chairs.', image: roomImages[2] },
            { id: 4, title: 'Living Room', content: t('livingRoomRugsDesc') || 'For the living room, match your rug to the scale of your sofa layout. Choose coordinating tones and textures.', image: roomImages[3] },
        ]

    return (
        <ShopByRoomClient
            items={items}
            title={t('shopByRoom') || 'Shop By Room'}
            headingTag={sectionHeadingTag}
        />
    )
}

export default ShopByRoom