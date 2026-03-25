import SignOutClient from '@/ui/SignOutClient'
import Link from 'next/link'
import React from 'react'
import { getTranslations } from 'next-intl/server'

const UserMenu = async ({ children }: { children: React.ReactNode }) => {
    const t = await getTranslations('nav')
    return (
        <div className='dropdown dropdown-hover'>
            <div tabIndex={0} role="button">
                {
                    children
                }
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[60] w-52 p-2 shadow border border-primary">
                <li><Link href={'/user/profile'}>{t('myProfile')}</Link></li>
                <li><Link href={'/user/orders'}>{t('orders')}</Link></li>
                <li><Link href={'/user/wishlist'}>{t('myWishlist')}</Link></li>
                <li><SignOutClient>{t('signOut')}</SignOutClient></li>
            </ul>
        </div>
    )
}

export default UserMenu