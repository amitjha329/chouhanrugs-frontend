import { getSizesList } from '@/backend/serverActions/getSizesList'
import SectionTitle from '@/ui/SectionTitle'
import React from 'react'
import SizeItems from './SizeItems'
import { getTranslations } from 'next-intl/server'

const ShopBySize = async () => {
    const sizesList = await getSizesList()
    const t = await getTranslations('homepage')
    return (
        <div className='fluid_container'>
            <SectionTitle title={t('shopBySize')} className='text-center py-5' />
            <div className='grid grid-cols-2 overflow-y-scroll max-h-[70vh] gap-5 p-10'>
                {
                    sizesList.slice(0, 6).map((size) => {
                        return <SizeItems key={size._id} {...size} />
                    })
                }
            </div>
        </div>
    )
}

export default ShopBySize