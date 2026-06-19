// @ts-nocheck
/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react'
import {
    FiX,
    FiShoppingBag,
    FiInfo,
    FiHelpCircle,
    FiHeart,
    FiHome,
    FiPackage,
    FiPhone,
    FiSearch,
} from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaPinterestP, FaRegUserCircle, FaWhatsapp } from 'react-icons/fa'
import { getSession } from '@/lib/auth-server'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import LoginLink from '@/components/LoginLink'
import {
    HiOutlineChevronRight,
    HiOutlineGlobeAlt,
    HiOutlineHeart,
    HiOutlineShieldCheck,
    HiOutlineSparkles,
    HiOutlineTruck,
} from 'react-icons/hi2'
import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import getSiteData from '@/backend/serverActions/getSiteData'
import type CategoriesDataModel from '@/types/CategoriesDataModel'
import SignoutButton from './SignoutButton'

type SessionUserNameFields = {
    displayName?: string | null
    displayUsername?: string | null
    username?: string | null
    name?: string | null
    email?: string | null
}

const readableEmailUsername = (email?: string | null) => {
    const emailName = email?.trim().split('@')[0]
    if (!emailName) return ''

    return emailName
        .replace(/[._-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(/\s+/)[0]
}

const getSessionDisplayName = (user?: SessionUserNameFields) => {
    const candidate = [
        user?.displayName,
        user?.displayUsername,
        user?.username,
        user?.name,
    ].find((value) => value?.trim())

    return candidate?.trim().split(/\s+/)[0] || readableEmailUsername(user?.email)
}

const SOCIAL_ICON_MAP = [
    { match: ['facebook.com', 'www.facebook.com', 'fb.me'], Icon: FaFacebook, label: 'Facebook' },
    { match: ['instagram.com', 'www.instagram.com'], Icon: FaInstagram, label: 'Instagram' },
    { match: ['pinterest.com', 'www.pinterest.com', 'in.pinterest.com'], Icon: FaPinterestP, label: 'Pinterest' },
] as const

const getSocialLinkMeta = (profile: string) => {
    try {
        const hostname = new URL(profile).hostname
        return SOCIAL_ICON_MAP.find((item) => item.match.includes(hostname))
    } catch {
        return null
    }
}

const toCategoryHref = (category?: Pick<CategoriesDataModel, 'slug' | 'name'> | null) =>
    `/products/category/${encodeURIComponent(category?.slug ?? category?.name ?? '')}`

const buildCategoryGroups = (categories: CategoriesDataModel[]) => {
    const activeCategories = categories.filter((category) => category.active)
    const rootCategories = activeCategories
        .filter((category) => !category.parent)
        .sort((a, b) => a.name.localeCompare(b.name))

    const rootByName = new Map(rootCategories.map((category) => [category.name, category]))
    const groups = rootCategories.map((root) => ({
        root,
        items: activeCategories
            .filter((category) => {
                const lineage = category.parent?.split('>').filter(Boolean) ?? []
                return lineage[0] === root.name
            })
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 6),
    }))

    const orphanGroups = activeCategories
        .filter((category) => {
            const lineage = category.parent?.split('>').filter(Boolean) ?? []
            return lineage.length > 0 && !rootByName.has(lineage[0])
        })
        .reduce<Array<{ root: CategoriesDataModel; items: CategoriesDataModel[] }>>((accumulator, category) => {
            const lineage = category.parent?.split('>').filter(Boolean) ?? []
            const rootName = lineage[0]
            if (!rootName) return accumulator

            const groupIndex = accumulator.findIndex((item) => item.root.name === rootName)
            const virtualRoot = {
                ...category,
                _id: `virtual-${rootName}`,
                name: rootName,
                slug: rootName,
            }

            if (groupIndex === -1) {
                accumulator.push({ root: virtualRoot, items: [category] })
            } else {
                accumulator[groupIndex].items.push(category)
            }

            return accumulator
        }, [])

    return [...groups, ...orphanGroups].filter((group) => group.root?.name)
}

const SideNav = async () => {
    const [session, t, categories, siteData] = await Promise.all([
        getSession(),
        getTranslations('nav'),
        getCategoriesList(),
        getSiteData(),
    ])
    const userName = getSessionDisplayName(session?.user)

    const primaryLinks = [
        { href: '/', label: 'Home', Icon: FiHome },
        { href: '/products', label: 'Shop All', Icon: FiShoppingBag },
        { href: '/products/category', label: 'Categories', Icon: FiPackage },
        { href: '/products?sort=new', label: 'New Arrivals', Icon: HiOutlineSparkles },
        { href: '/products?tags=Top%20Selling', label: 'Best Sellers', Icon: HiOutlineHeart },
    ]

    const categoryGroups = buildCategoryGroups(categories)
    const socialProfiles = (siteData.profiles ?? [])
        .map((profile) => ({ profile, meta: getSocialLinkMeta(profile) }))
        .filter((item) => item.meta)

    return (
        <div
            id="mobile_menu_overlay"
            className='pointer-events-none fixed inset-0 z-[10000] h-screen max-h-full w-screen overflow-hidden bg-black/55 opacity-0 !text-primary transition-opacity duration-300 ease-out'
            aria-hidden="true"
        >
            <aside
                id="mobile_menu_panel"
                className='h-full w-[84vw] max-w-[22rem] -translate-x-full overflow-y-auto rounded-r-xl bg-[#fffaf5] px-4 py-4 shadow-2xl transition-transform duration-300 ease-out'
            >
                <button type="button" aria-label="Close menu" className="mb-4 flex h-8 w-8 items-center justify-center rounded-full text-primary" id="close_mobile_menu">
                    <FiX className="h-6 w-6" aria-hidden="true" />
                </button>

                {session?.user ? (
                    <Link href="/user/profile" className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0e1d6]">
                            <FaRegUserCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                            <div className="text-base font-semibold leading-5 text-base-content">
                                {userName ? `Hi, ${userName.split(' ')[0]}` : 'Welcome'}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-base-content/65">
                                View your profile <HiOutlineChevronRight className="h-4 w-4" aria-hidden="true" />
                            </div>
                        </div>
                    </Link>
                ) : (
                    <LoginLink className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0e1d6]">
                            <FaRegUserCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                            <div className="text-base font-semibold leading-5 text-base-content">
                                Welcome
                            </div>
                            <div className="flex items-center gap-1 text-xs text-base-content/65">
                                {t('logIn')} <HiOutlineChevronRight className="h-4 w-4" aria-hidden="true" />
                            </div>
                        </div>
                    </LoginLink>
                )}

                <div className="mb-4">
                    <div className="flex h-9 min-w-0 items-center gap-1.5 px-2 text-xs font-semibold">
                        <HiOutlineGlobeAlt className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <LocaleSwitcher />
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
                        {/* <HiOutlineChevronRight className="h-5 w-5 -rotate-90" aria-hidden="true" /> */}
                    </div>
                    <div className="space-y-1.5">
                        {categoryGroups.map((group, index) => (
                            <details key={group.root._id ?? group.root.name} className="rounded-lg bg-white" open={false}>
                                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-semibold marker:hidden">
                                    <Link href={toCategoryHref(group.root)} className="flex-1">
                                        {group.root.name}
                                    </Link>
                                    {group.items.length > 0 && (<HiOutlineChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" aria-hidden="true" />)}
                                </summary>
                                {group.items.length > 0 && (
                                    <ul className="space-y-1 px-7 pb-2 text-xs leading-5 text-base-content/80">
                                        {group.items.map((item) => (
                                            <li key={item._id} className="list-disc">
                                                <Link href={toCategoryHref(item)}>{item.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </details>
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
                    <Link href="/terms" className="flex items-center justify-between py-2 font-semibold"><span className="flex items-center gap-3"><FiHelpCircle />Terms</span><HiOutlineChevronRight /></Link>
                    <Link href="/policies" className="flex items-center justify-between py-2 font-semibold"><span className="flex items-center gap-3"><FiHelpCircle />Policies</span><HiOutlineChevronRight /></Link>
                    {session?.user && <SignoutButton />}
                </div>

                {socialProfiles.length > 0 && (
                    <div className="mb-4 flex justify-around border-t border-primary/10 pt-4 text-primary">
                        {socialProfiles.map(({ profile, meta }) => {
                            const Icon = meta!.Icon
                            return (
                                <Link key={profile} href={profile} target="_blank" rel="noreferrer" aria-label={meta!.label}>
                                    <Icon className="h-5 w-5" />
                                </Link>
                            )
                        })}
                        {siteData.contact_details?.whatsapp && (
                            <Link href={`https://wa.me/${siteData.contact_details.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                                <FaWhatsapp className="h-5 w-5" />
                            </Link>
                        )}
                    </div>
                )}
            </aside>
        </div>
    )
}

export default SideNav
