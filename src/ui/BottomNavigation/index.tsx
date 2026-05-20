import React from 'react'
import { Link } from '@/i18n/navigation'
import { HiOutlineHeart, HiOutlineHome, HiOutlineMagnifyingGlass, HiOutlineSquares2X2, HiOutlineUserCircle } from 'react-icons/hi2'

const BottomNavigation = () => {
    const items = [
        { href: '/', label: 'Home', Icon: HiOutlineHome, active: true },
        { href: '/products/category', label: 'Categories', Icon: HiOutlineSquares2X2 },
        { href: '/products', label: 'Search', Icon: HiOutlineMagnifyingGlass },
        { href: '/user/wishlist', label: 'Wishlist', Icon: HiOutlineHeart },
        { href: '/user/profile', label: 'Account', Icon: HiOutlineUserCircle },
    ]

    return (
        <nav className='fixed bottom-2 left-0 right-0 z-[9999] px-3 md:hidden' aria-label="Mobile bottom navigation">
            <div className='mx-auto flex max-w-md justify-evenly rounded-2xl border border-primary/10 bg-white/95 px-1.5 py-1.5 shadow-[0_10px_28px_rgba(69,42,22,0.14)] backdrop-blur'>
                {items.map(({ href, label, Icon, active }) => (
                    <Link key={label} href={href} className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-medium ${active ? 'text-primary' : 'text-base-content/55'}`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        <span>{label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    )
}

export default BottomNavigation
