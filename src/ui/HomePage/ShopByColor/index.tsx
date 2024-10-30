import SectionTitle from '@/ui/SectionTitle'
import getDevice from '@/utils/getDevice'
import React from 'react'
import { ColorList, ColorListMobile } from './ColorList'
import { headers } from 'next/headers';

const ShopByColor = async () => {
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    return (
        <div className='fluid_container ~py-5/14 ~px-5/0'>
            <SectionTitle title='Shop By Color' className='text-center py-5' />
            {
                isMobile ? <ColorListMobile /> : <ColorList />
            }
        </div>
    )
}

export default ShopByColor