import SectionTitle from '@/ui/SectionTitle'
import getDevice from '@/utils/getDevice'
import React from 'react'
import { ColorList } from './ColorList'
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server'

const ShopByColor = async () => {
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    const t = await getTranslations('homepage')
    return (
        <section className='bg-[#fbfaf7] ~px-5/0 ~py-8/14'>
            <div className="fluid_container mx-auto">
                <div className="mx-auto mb-5 max-w-2xl text-center">
                    <SectionTitle title={t('shopByColor')} className='pb-2' />
                    <p className="text-sm leading-6 text-base-content/65">
                        Start with a palette. We surface a fresh set of colors on each visit so the collection feels easier to scan.
                    </p>
                </div>
                <ColorList limit={isMobile ? 8 : 12} />
            </div>
        </section>
    )
}

export default ShopByColor
