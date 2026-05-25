'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { stripLocaleFromPathname } from '@/i18n/routing'
import { usePathname } from 'next/navigation'
import { HiOutlineHeart, HiOutlineHome, HiOutlineMagnifyingGlass, HiOutlineSquares2X2, HiOutlineUserCircle } from 'react-icons/hi2'

const BottomNavigation = () => {
    const pathname = stripLocaleFromPathname(usePathname() || '/')
    const items = [
        { href: '/', label: 'Home', Icon: HiOutlineHome, match: (path: string) => path === '/' },
        { href: '/products/category', label: 'Categories', Icon: HiOutlineSquares2X2, match: (path: string) => path === '/products/category' || path.startsWith('/products/category/') },
        { type: 'search', label: 'Search', Icon: HiOutlineMagnifyingGlass, match: (path: string) => path === '/products' || (path.startsWith('/products/') && !path.startsWith('/products/category')) },
        { href: '/user/wishlist', label: 'Wishlist', Icon: HiOutlineHeart, match: (path: string) => path === '/user/wishlist' },
        { href: '/user/profile', label: 'Account', Icon: HiOutlineUserCircle, match: (path: string) => path === '/user/profile' || (path.startsWith('/user/') && path !== '/user/wishlist') },
    ] as const

    const triggerSearch = () => {
        window.dispatchEvent(new Event('mobile-search:focus'))
    }

    return (
        <nav
            id="mobile_bottom_nav"
            className='fixed bottom-2 left-0 right-0 z-[9999] translate-y-0 px-3 transition-transform duration-300 ease-out will-change-transform md:hidden'
            aria-label="Mobile bottom navigation"
        >
            <div className='mx-auto flex max-w-md justify-evenly rounded-2xl border border-primary/10 bg-white/95 px-1.5 py-1.5 shadow-[0_10px_28px_rgba(69,42,22,0.14)] backdrop-blur'>
                {items.map((item) => {
                    const { label, Icon, match } = item
                    const active = match(pathname)

                    if ('type' in item && item.type === 'search') {
                        return (
                            <button
                                key={label}
                                type="button"
                                aria-label="Search"
                                className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-medium transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-base-content/55'}`}
                                onClick={triggerSearch}
                            >
                                <Icon className="h-5 w-5" aria-hidden="true" />
                                <span>{label}</span>
                            </button>
                        )
                    }

                    return (
                        <Link
                            key={label}
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-medium transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-base-content/55'}`}
                        >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                            <span>{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

export default BottomNavigation
