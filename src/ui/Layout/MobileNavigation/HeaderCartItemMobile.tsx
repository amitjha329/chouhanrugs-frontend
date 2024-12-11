'use client'
import { useDataConnectionContext } from '@/utils/Contexts/DataConnectionContext'
import Image from 'next/image'
import React, { useEffect } from 'react'

const HeaderCartItemMobile = ({ id }: { id?: string }) => {
    const { cartCount } = useDataConnectionContext()
    return <div className='gap-3 flex items-center cursor-pointer indicator' id={id}>
        {
            (cartCount ?? 0) > 0 && <span className="indicator-item badge badge-secondary text-xs p-1">
                {(cartCount ?? 0) < 11 ? cartCount : '10+'}
            </span>
        }
        <Image src="/vector/Cart.svg" alt="Cart" width={20} height={20} />
    </div>
}
export default HeaderCartItemMobile