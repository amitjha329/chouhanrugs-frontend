import SignOutClient from '@/ui/SignOutClient'
import Link from 'next/link'
import React from 'react'

const UserMenu = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className='dropdown dropdown-hover'>
            <div tabIndex={0} role="button">
                {
                    children
                }
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[60] w-52 p-2 shadow border border-primary">
                <li><Link href={'/user/profile'}>My Profile</Link></li>
                <li><Link href={'/user/orders'}>My Orders</Link></li>
                <li><Link href={'/user/wishlist'}>My Wishlist</Link></li>
                <li><SignOutClient>Sign Out</SignOutClient></li>
            </ul>
        </div>
    )
}

export default UserMenu