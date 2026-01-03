// @ts-nocheck
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { HiOutlineUser, HiOutlineMapPin, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineCube, HiOutlineCog6Tooth } from 'react-icons/hi2'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()

    const accountLinks = [
        { href: '/user/profile', label: 'Profile Settings', icon: HiOutlineUser },
        { href: '/user/address', label: 'Address Book', icon: HiOutlineMapPin },
    ]

    const activityLinks = [
        { href: '/user/orders', label: 'My Orders', icon: HiOutlineShoppingBag },
        { href: '/user/wishlist', label: 'Wishlist', icon: HiOutlineHeart },
        { href: '/user/bulk', label: 'Bulk Orders', icon: HiOutlineCube },
    ]

    const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
        const isActive = pathname === href
        return (
            <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                        ? 'bg-primary text-primary-content shadow-md shadow-primary/20'
                        : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                }`}
            >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{label}</span>
            </Link>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-200/50 to-base-100">
            <div className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <div className="lg:sticky lg:top-24">
                            {/* Mobile: Horizontal scroll menu */}
                            <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4">
                                <div className="flex gap-2 min-w-max">
                                    {[...accountLinks, ...activityLinks].map((link) => {
                                        const isActive = pathname === link.href
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-primary text-primary-content shadow-md'
                                                        : 'bg-base-100 text-base-content/70 border border-base-300 hover:border-primary/30'
                                                }`}
                                            >
                                                <link.icon className="w-4 h-4" />
                                                <span className="text-sm font-medium">{link.label}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Desktop: Vertical sidebar */}
                            <div className="hidden lg:block space-y-6">
                                {/* Account Settings Section */}
                                <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden">
                                    <div className="px-5 py-4 border-b border-base-300/50 bg-gradient-to-r from-primary/5 to-transparent">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <HiOutlineCog6Tooth className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-base-content">Account Settings</h3>
                                                <p className="text-xs text-base-content/60">Manage your account</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 space-y-1">
                                        {accountLinks.map((link) => (
                                            <NavLink key={link.href} {...link} />
                                        ))}
                                    </div>
                                </div>

                                {/* My Activity Section */}
                                <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden">
                                    <div className="px-5 py-4 border-b border-base-300/50 bg-gradient-to-r from-secondary/5 to-transparent">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                                                <HiOutlineShoppingBag className="w-5 h-5 text-secondary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-base-content">My Activity</h3>
                                                <p className="text-xs text-base-content/60">Orders & favorites</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 space-y-1">
                                        {activityLinks.map((link) => (
                                            <NavLink key={link.href} {...link} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default UserLayout