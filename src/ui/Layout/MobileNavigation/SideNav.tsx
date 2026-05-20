// @ts-nocheck
/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react'
import { FiX, FiShoppingBag, FiInfo, FiHelpCircle, FiHeart, FiHome, FiPackage, FiPhone, FiSearch } from 'react-icons/fi'
import SignoutButton from './SignoutButton'
import { FaInstagram, FaPinterestP, FaRegUserCircle, FaSignInAlt, FaWhatsapp } from 'react-icons/fa'
import { getSession } from '@/lib/auth-server'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import { HiOutlineChevronRight, HiOutlineGlobeAlt, HiOutlineHeart, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineTruck } from 'react-icons/hi2'

const SideNav = async () => {
    const session = await getSession()
    const t = await getTranslations('nav')
    const userName = session?.user?.name ?? session?.user?.email ?? ''

    const primaryLinks = [
        { href: '/', label: 'Home', Icon: FiHome },
        { href: '/products', label: 'Shop All', Icon: FiShoppingBag },
        { href: '/products/category', label: 'Categories', Icon: FiPackage },
        { href: '/products?sort=new', label: 'New Arrivals', Icon: HiOutlineSparkles },
        { href: '/products?tags=best-seller', label: 'Best Sellers', Icon: HiOutlineHeart },
    ]

    const categoryGroups = [
        {
            label: 'Rugs',
            items: ['Hemp Rugs', 'Cotton Rugs', 'Kilim Rugs', 'Moroccan Rugs', 'Rugs & Runners'],
        },
        {
            label: 'Bags',
            items: ['Hand Bags', 'Tote Bags'],
        },
        {
            label: 'Cushions & Pillows',
            items: ['Cushion & Pillow'],
        },
        {
            label: 'Jute Collection',
            items: ['Braided Jute Rug', 'Wool Jute Kilim Rugs'],
        },
    ]

    return (
        <div
            id="mobile_menu_overlay"
            className='pointer-events-none fixed inset-0 z-[10000] h-screen w-screen overflow-hidden bg-black/55 opacity-0 !text-primary transition-opacity duration-300 ease-out'
            aria-hidden="true"
        >
            <aside
                id="mobile_menu_panel"
                className='h-full w-[84vw] max-w-[22rem] -translate-x-full overflow-y-auto rounded-r-xl bg-[#fffaf5] px-4 py-4 shadow-2xl transition-transform duration-300 ease-out'
            >
                <button type="button" aria-label="Close menu" className="mb-4 flex h-8 w-8 items-center justify-center rounded-full text-primary" id="close_mobile_menu">
                    <FiX className="h-6 w-6" aria-hidden="true" />
                </button>

                <Link href={session?.user ? "/user/profile" : "/signin"} className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0e1d6]">
                        <FaRegUserCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                        <div className="text-base font-semibold leading-5 text-base-content">
                            {userName ? `Hi, ${userName.split(' ')[0]}` : 'Welcome'}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-base-content/65">
                            {userName ? 'View your profile' : t('logIn')} <HiOutlineChevronRight className="h-4 w-4" aria-hidden="true" />
                        </div>
                    </div>
                </Link>

                <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="flex h-9 min-w-0 items-center gap-1.5 rounded-lg border border-primary/10 bg-white px-2 text-xs font-semibold">
                        <HiOutlineGlobeAlt className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <LocaleSwitcher />
                    </div>
                    <div className="flex h-9 items-center justify-between rounded-lg border border-primary/10 bg-white px-3 text-xs font-semibold">
                        <span className="text-base">$</span>
                        <span>USD</span>
                        <HiOutlineChevronRight className="h-4 w-4 rotate-90" aria-hidden="true" />
                    </div>
                </div>

                <form action="/products" className="mb-4 flex h-10 items-center gap-2 rounded-lg border border-primary/10 bg-white px-3">
                    <FiSearch className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <input name="search" className="w-full bg-transparent text-xs outline-none placeholder:text-base-content/45" placeholder="Search rugs, bags & more..." />
                </form>

                <nav className="space-y-0.5">
                    {primaryLinks.map(({ href, label, Icon }) => (
                        <Link key={label} href={href} className="flex items-center gap-3 rounded-lg px-1 py-2 text-sm font-semibold text-base-content">
                            <Icon className="h-[18px] w-[18px] text-primary" aria-hidden="true" />
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="my-4 border-t border-primary/10 pt-4">
                    <div className="mb-2 flex items-center justify-between text-sm font-semibold text-primary">
                        <span>Shop by Categories</span>
                        <HiOutlineChevronRight className="h-5 w-5 -rotate-90" aria-hidden="true" />
                    </div>
                    <div className="space-y-1.5">
                        {categoryGroups.map((group, index) => (
                            <div key={group.label} className="rounded-lg bg-white">
                                <Link href={`/products?search=${encodeURIComponent(group.label)}`} className={`flex items-center justify-between px-3 py-2.5 text-sm font-semibold ${index === 0 ? 'rounded-lg bg-[#eadbd0]' : ''}`}>
                                    <span>{group.label}</span>
                                    <HiOutlineChevronRight className={`h-5 w-5 ${index === 0 ? 'rotate-90' : ''}`} aria-hidden="true" />
                                </Link>
                                {index === 0 && (
                                    <ul className="space-y-0.5 px-7 pb-2 text-xs leading-5 text-base-content/80">
                                        {group.items.map((item) => (
                                            <li key={item} className="list-disc">
                                                <Link href={`/products?search=${encodeURIComponent(item)}`}>{item}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-1 rounded-xl border border-primary/10 bg-white px-2 py-3 text-center text-[9px] font-medium leading-3 text-base-content">
                    <div><HiOutlineSparkles className="mx-auto mb-1 h-5 w-5 text-primary" />Sustainable</div>
                    <div><HiOutlineHeart className="mx-auto mb-1 h-5 w-5 text-primary" />Handcrafted</div>
                    <div><HiOutlineShieldCheck className="mx-auto mb-1 h-5 w-5 text-primary" />Premium</div>
                    <div><HiOutlineTruck className="mx-auto mb-1 h-5 w-5 text-primary" />Shipping</div>
                </div>

                <div className="my-4 border-t border-primary/10 pt-3 text-sm">
                    <Link href="/user/wishlist" className="flex items-center justify-between py-2 font-semibold"><span className="flex items-center gap-3"><FiHeart />Wishlist</span><HiOutlineChevronRight /></Link>
                    <Link href="/track-order" className="flex items-center justify-between py-2 font-semibold"><span className="flex items-center gap-3"><FiPackage />Track Order</span><HiOutlineChevronRight /></Link>
                    <Link href="/contact-us" className="flex items-center justify-between py-2 font-semibold"><span className="flex items-center gap-3"><FiPhone />Contact Us</span><HiOutlineChevronRight /></Link>
                    <Link href="/about-us" className="flex items-center justify-between py-2 font-semibold"><span className="flex items-center gap-3"><FiInfo />About Us</span><HiOutlineChevronRight /></Link>
                    <Link href="/policies" className="flex items-center justify-between py-2 font-semibold"><span className="flex items-center gap-3"><FiHelpCircle />FAQs</span><HiOutlineChevronRight /></Link>
                    {session?.user ? <SignoutButton /> : <Link href="/signin" className='mt-3 flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-content'>
                        <FaSignInAlt className="mr-3 h-4 w-4" />
                        {t('logIn')}
                    </Link>}
                </div>

                <div className="mb-4 flex justify-around border-t border-primary/10 pt-4 text-primary">
                    <FaInstagram className="h-5 w-5" />
                    <FaPinterestP className="h-5 w-5" />
                    <FaWhatsapp className="h-5 w-5" />
                    <FiPhone className="h-5 w-5" />
                </div>
            </aside>
        </div>
    )
}

export default SideNav
