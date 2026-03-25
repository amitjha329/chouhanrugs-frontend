import SectionTitle from '@/ui/SectionTitle'
import getDevice from '@/utils/getDevice'
import React from 'react'
import { ColorList, ColorListMobile } from './ColorList'
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server'

const ShopByColor = async () => {
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    const t = await getTranslations('homepage')
    return (
        <div className='fluid_container ~py-5/14 ~px-5/0'>
            <SectionTitle title={t('shopByColor')} className='text-center py-5' />
            {
                isMobile ? <ColorListMobile /> : <ColorList />
            }
        </div>
    )
}

export default ShopByColor