'use client'
import { useDataConnectionContext } from '@/utils/Contexts/DataConnectionContext'
import Image from 'next/image'
import React, { useEffect } from 'react'

const HeaderCartItem = ({ icon, text, id }: { icon: string, text: string, id?: string }) => {
    const { cartCount } = useDataConnectionContext()
    useEffect(() => {
        console.log("===========>Cart COunt<============", cartCount)
    }, [cartCount])
    return <div className='gap-3 flex items-center cursor-pointer indicator' id={id}>
        {
            (cartCount ?? 0) > 0 && <span className="indicator-item badge badge-secondary">
                {(cartCount ?? 0) < 11 ? cartCount : '10+'}
            </span>
        }
        <Image src={icon} alt={text} height={25} width={25} />
        <span>{text}</span>
    </div>
}
export default HeaderCartItem