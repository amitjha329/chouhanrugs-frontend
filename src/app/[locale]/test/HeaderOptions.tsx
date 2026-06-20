'use client'

import React, { useState } from 'react'
import { Link } from '@/i18n/navigation'
import LoginLink from '@/components/LoginLink'
import SignOutClient from '@/ui/SignOutClient'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import { FaAmazon, FaChevronDown, FaBars, FaTimes, FaSearch, FaRegHeart, FaRegUser, FaShoppingBag } from 'react-icons/fa'
import { SiEtsy } from 'react-icons/si'
import { TbBuildingStore } from 'react-icons/tb'
import { SearchButton } from './NewPremiumHeaderClient'
import { useDataConnectionContext } from '@/utils/Contexts/DataConnectionContext'
import CategoriesDataModel from '@/types/CategoriesDataModel'
import clsx from 'clsx'

interface HeaderOptionsSwitcherProps {
    session: any
    categories: CategoriesDataModel[]
    siteData: any
    marketplaceLinks: any[]
    labels: Record<string, string>
}

const PLATFORM_ICONS = {
    etsy: SiEtsy,
    amazon: FaAmazon,
    faire: TbBuildingStore,
    custom: TbBuildingStore,
} as const

// --- Client-Side Dropdown UserMenu ---
const ClientUserMenu = ({ session, children }: { session: any; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div 
            className="relative inline-block text-left" 
            onMouseEnter={() => setIsOpen(true)} 
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="cursor-pointer">
                {children}
            </div>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-lg shadow-xl bg-white border border-[#e5ccb5]/50 py-1.5 z-[120] animate-fade-in divide-y divide-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-[10px] font-bold text-[#8b7868] uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold text-[#6c4624] truncate">{session?.user?.name}</p>
                    </div>
                    <div className="py-1">
                        <Link href="/user/profile" className="block px-4 py-2 text-xs font-semibold text-[#5d3c1e] hover:bg-[#e5ccb5]/20 hover:text-[#6c4624] transition-colors">
                            My Profile
                        </Link>
                        <Link href="/user/orders" className="block px-4 py-2 text-xs font-semibold text-[#5d3c1e] hover:bg-[#e5ccb5]/20 hover:text-[#6c4624] transition-colors">
                            Orders
                        </Link>
                        <Link href="/user/wishlist" className="block px-4 py-2 text-xs font-semibold text-[#5d3c1e] hover:bg-[#e5ccb5]/20 hover:text-[#6c4624] transition-colors">
                            My Wishlist
                        </Link>
                    </div>
                    <div className="py-1">
                        <SignOutClient>
                            <button className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                                Sign Out
                            </button>
                        </SignOutClient>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- Client-Side Cart Badge component ---
const ClientCartBadge = ({ iconSize = 25 }: { iconSize?: number }) => {
    const { cartCount } = useDataConnectionContext()
    return (
        <div className="relative flex items-center justify-center">
            <img src="/vector/Cart.svg" alt="Cart" style={{ width: iconSize, height: iconSize }} className="opacity-90" />
            {cartCount !== undefined && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6c4624] text-[9px] font-bold text-white shadow-sm border border-white">
                    {cartCount < 11 ? cartCount : '10+'}
                </span>
            )}
        </div>
    )
}

// --- Dynamic Search Form (Direct Input Search Bar) ---
const DirectSearchBar = ({ placeholder = "Search for rugs..." }: { placeholder?: string }) => {
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const searchInput = (e.currentTarget.elements.namedItem('search') as HTMLInputElement)?.value
        if (searchInput) {
            window.location.href = `/products?search=${encodeURIComponent(searchInput)}`
        }
    }

    const openAlgoliaSearch = () => {
        const searchContainer = document.getElementById("search_container")
        if (searchContainer) {
            searchContainer.style.height = "65px"
            window.dispatchEvent(new CustomEvent("chouhanrugs:open-search"))
        }
    }

    return (
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-md">
            <input 
                type="text" 
                name="search" 
                placeholder={placeholder} 
                onClick={openAlgoliaSearch}
                className="w-full pl-4 pr-10 py-1.5 text-xs font-medium rounded-full bg-[#fdfaf4] border border-[#e5ccb5] focus:outline-none focus:border-[#6c4624] focus:ring-1 focus:ring-[#6c4624] transition-all text-[#5d3c1e]"
            />
            <button type="submit" className="absolute right-3 text-[#6c4624] hover:text-[#5d3c1e] transition-colors" aria-label="Submit search">
                <FaSearch className="w-3.5 h-3.5" />
            </button>
        </form>
    )
}

// --- Category Dropdown component with Hover submenus ---
const StandardCategoryItem = ({
    label,
    submenu,
    href,
    darkTheme = false,
}: {
    label: string
    href?: string
    submenu?: CategoriesDataModel[]
    darkTheme?: boolean
}) => {
    const hasSubmenu = (submenu?.length ?? 0) > 0
    return (
        <div className="relative group inline-block font-semibold">
            {hasSubmenu ? (
                <>
                    <button className={clsx(
                        "text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 py-2 cursor-pointer select-none transition-colors duration-150",
                        darkTheme ? "text-secondary-content/90 hover:text-white" : "text-[#5d3c1e] hover:text-[#6c4624]"
                    )}>
                        {label} <FaChevronDown className="w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 ease-out translate-y-2 group-hover:translate-y-0 z-[110]">
                        <div className="bg-white rounded-xl shadow-xl border border-[#e5ccb5]/40 py-2 min-w-[200px] overflow-hidden">
                            <ul className="list-none m-0 p-0 font-normal">
                                {submenu?.map((item) => (
                                    <li key={item._id}>
                                        <Link
                                            href={`/products/category/${encodeURIComponent(item.slug ?? item.name)}`}
                                            className="block px-5 py-2.5 text-xs font-semibold text-[#5d3c1e] hover:bg-[#e5ccb5]/20 hover:text-[#6c4624] transition-colors duration-150 text-left"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <Link
                    href={href ?? ''}
                    className={clsx(
                        "text-xs uppercase tracking-wider font-bold py-2 transition-colors duration-150 block",
                        darkTheme ? "text-secondary-content/90 hover:text-white" : "text-[#5d3c1e] hover:text-[#6c4624]"
                    )}
                >
                    {label}
                </Link>
            )}
        </div>
    )
}

// ==========================================
// --- OPTION 1: Current Live Header (Baseline Replica) ---
// ==========================================
function HeaderOptionCurrent({ session, categories, marketplaceLinks, labels }: HeaderOptionsSwitcherProps) {
    return (
        <div className="w-full bg-white border-b border-gray-100 hidden md:block">
            {/* Top Utility Bar */}
            <nav className="bg-secondary text-secondary-content text-xs z-50 relative py-2" id="page_links_current">
                <div className="fluid_container mx-auto flex flex-col gap-2 px-4 md:flex-row md:items-center md:justify-between md:px-0">
                    {marketplaceLinks.length > 0 ? (
                        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
                            <span className="font-semibold text-secondary-content/70">Shop on</span>
                            {marketplaceLinks.map(({ label, url, platform }) => {
                                const Icon = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] || TbBuildingStore
                                return (
                                    <a
                                        key={`${platform}-${url}`}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-full border border-secondary-content/20 px-2.5 py-1 font-medium transition-colors hover:bg-secondary-content hover:text-secondary text-[11px]"
                                    >
                                        <Icon className="h-3 w-3" />
                                        {label}
                                    </a>
                                )
                            })}
                        </div>
                    ) : <div />}

                    <div className="flex items-center justify-center gap-5 overflow-x-auto whitespace-nowrap font-[500] no-scrollbar">
                        <Link href="/">{labels.home || 'Home'}</Link>
                        <Link href="/about-us">{labels.aboutUs || 'About Us'}</Link>
                        <Link href="/contact-us">{labels.contact || 'Contact'}</Link>
                        <Link href="/blog">{labels.blog || 'Blog'}</Link>
                        <Link href="/policies">{labels.policies || 'Policies'}</Link>
                        <Link href="/terms">{labels.terms || 'Terms'}</Link>
                    </div>

                    <div className="flex justify-start md:justify-end">
                        <LocaleSwitcher />
                    </div>
                </div>
            </nav>

            {/* Main Header Bar */}
            <header className="flex items-center justify-between px-10 py-5 bg-base-100">
                <div className="flex gap-10 items-center">
                    <Link href="/track-order" className="gap-3 flex items-center cursor-pointer z-50 relative text-xs font-semibold text-gray-800">
                        <img src="/vector/TrackOrder.svg" alt="Track Order" className="w-[25px] h-[25px]" />
                        <span>Track Order</span>
                    </Link>
                    <div className="flex items-center cursor-pointer z-50 relative text-xs font-semibold text-gray-800">
                        <SearchButton />
                        <span className="ml-1">Search</span>
                    </div>
                </div>

                <div className="flex items-center shrink-0">
                    <Link href="/">
                        <img src="/chouhanrugs.png" alt="Chouhan Rugs Logo" className="h-20 w-auto object-contain" />
                    </Link>
                </div>

                <div className="flex gap-10 items-center">
                    <Link href="/user/wishlist" className="gap-3 flex items-center cursor-pointer z-50 relative text-xs font-semibold text-gray-800">
                        <img src="/vector/Heart.svg" alt="Wishlist" className="w-[25px] h-[25px]" />
                        <span>Wishlist</span>
                    </Link>

                    {session?.user == null ? (
                        <LoginLink>
                            <div className="gap-3 flex items-center cursor-pointer z-50 relative text-xs font-semibold text-gray-800">
                                <img src="/vector/UserIcon.svg" alt="Login" className="w-[25px] h-[25px]" />
                                <span>Login</span>
                            </div>
                        </LoginLink>
                    ) : (
                        <ClientUserMenu session={session}>
                            <div className="gap-3 flex items-center cursor-pointer z-50 relative text-xs font-semibold text-gray-800">
                                <img src="/vector/UserIcon.svg" alt="Account" className="w-[25px] h-[25px]" />
                                <span>{session?.user?.name?.split(' ')[0] ?? "Account"}</span>
                            </div>
                        </ClientUserMenu>
                    )}

                    <Link href="/cart" className="gap-3 flex items-center cursor-pointer z-50 relative text-xs font-semibold text-gray-800">
                        <ClientCartBadge iconSize={25} />
                        <span>Cart</span>
                    </Link>
                </div>
            </header>

            {/* Category Navigation Menu */}
            <nav className="bg-secondary text-secondary-content font-[500] flex items-center justify-center gap-8 py-4 sticky top-0 z-50" id="category_links_current">
                {categories.map((category) => {
                    return category.active && category.popular && (
                        <StandardCategoryItem
                            key={category._id}
                            label={category.name}
                            href={`/products/category/${encodeURIComponent(category.slug ?? category.name)}`}
                            submenu={categories.filter((i) => i.parent === category.name)}
                            darkTheme={true}
                        />
                    )
                })}
            </nav>
        </div>
    )
}

// ==========================================
// --- OPTION 2: The Artisan's Grid (Luxury Quad-Deck Layout) ---
// ==========================================
function HeaderOption1({ session, categories, marketplaceLinks, labels }: HeaderOptionsSwitcherProps) {
    return (
        <header className="w-full bg-[#fdfbf7] border-b border-[#e5ccb5]/20 hidden md:block z-40 relative">
            {/* Deck 1: Premium Utility Bar */}
            <div className="bg-[#f7ece1] text-[#5d3c1e] text-[11px] py-2 px-8 border-b border-[#e5ccb5]/30">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-bold opacity-75">Explore Chouhan Rugs on:</span>
                        <div className="flex items-center gap-2">
                            {marketplaceLinks.map(({ label, url, platform }) => {
                                const Icon = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] || TbBuildingStore
                                return (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 bg-white/60 hover:bg-white px-2.5 py-0.5 rounded-full border border-[#e5ccb5]/30 transition-all font-semibold"
                                    >
                                        <Icon className="h-3 w-3 text-[#6c4624]" />
                                        <span>{label}</span>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex items-center gap-6 font-semibold">
                        <Link href="/about-us" className="hover:text-[#6c4624] transition-colors">Our Story</Link>
                        <Link href="/policies" className="hover:text-[#6c4624] transition-colors">Store Policies</Link>
                        <Link href="/terms" className="hover:text-[#6c4624] transition-colors">Terms of Service</Link>
                        <span className="h-3 w-px bg-[#e5ccb5]/40" />
                        <LocaleSwitcher />
                    </div>
                </div>
            </div>

            {/* Deck 2: Main Brand & Search Deck */}
            <div className="bg-white border-b border-[#e5ccb5]/25 py-4.5 px-8">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
                    {/* Left: Interactive search bar */}
                    <div className="flex-1 max-w-sm">
                        <DirectSearchBar placeholder="Search for handloom, wool, jute rugs..." />
                    </div>

                    {/* Center: Brand Logo Image */}
                    <div className="flex justify-center shrink-0">
                        <Link href="/">
                            <img src="/chouhanrugs.png" alt="Chouhan Rugs" className="h-[75px] w-auto object-contain transition-transform hover:scale-[1.01] duration-200" />
                        </Link>
                    </div>

                    {/* Right: Full Actions Row with text labels */}
                    <div className="flex items-center justify-end gap-6 flex-1">
                        <Link href="/track-order" className="flex items-center gap-2 group text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624] transition-colors">
                            <img src="/vector/TrackOrder.svg" alt="" className="w-5 h-5 opacity-90 transition-transform group-hover:-translate-y-0.5" />
                            <span>Track Order</span>
                        </Link>

                        <Link href="/user/wishlist" className="flex items-center gap-2 group text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624] transition-colors">
                            <img src="/vector/Heart.svg" alt="" className="w-5 h-5 opacity-90 transition-transform group-hover:scale-105" />
                            <span>Wishlist</span>
                        </Link>

                        {session?.user == null ? (
                            <LoginLink>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624] transition-colors">
                                    <img src="/vector/UserIcon.svg" alt="" className="w-5 h-5 opacity-90" />
                                    <span>Sign In</span>
                                </div>
                            </LoginLink>
                        ) : (
                            <ClientUserMenu session={session}>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624] transition-colors">
                                    <img src="/vector/UserIcon.svg" alt="" className="w-5 h-5 opacity-90" />
                                    <span>{session.user.name?.split(' ')[0]}</span>
                                </div>
                            </ClientUserMenu>
                        )}

                        <span className="h-5 w-px bg-[#e5ccb5]/40" />

                        <Link href="/cart" className="flex items-center gap-2 group text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624] transition-colors">
                            <ClientCartBadge iconSize={20} />
                            <span>Shopping Cart</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Deck 3: Premium Category Deck */}
            <div className="bg-[#FAF6F0] py-3.5 px-8 shadow-sm">
                <nav className="max-w-[1600px] mx-auto flex items-center justify-center gap-10">
                    {categories
                        .filter((c) => c.active && c.popular)
                        .map((c) => (
                            <StandardCategoryItem
                                key={c._id}
                                label={c.name}
                                href={`/products/category/${encodeURIComponent(c.slug ?? c.name)}`}
                                submenu={categories.filter((i) => i.parent === c.name)}
                            />
                        ))}
                </nav>
            </div>
        </header>
    )
}

// ==========================================
// --- OPTION 3: Modern Executive Split-Panel ---
// ==========================================
function HeaderOption2({ session, categories, marketplaceLinks, labels }: HeaderOptionsSwitcherProps) {
    return (
        <header className="w-full bg-[#faf9f6] hidden md:block border-b border-[#e5ccb5]/25">
            {/* Top Deck: Grid Layout for Corporate Header */}
            <div className="bg-white border-b border-[#e5ccb5]/20 py-4 px-8">
                <div className="max-w-[1600px] mx-auto grid grid-cols-12 items-center gap-4">
                    {/* Brand Logo (Left 3 cols) */}
                    <div className="col-span-3">
                        <Link href="/">
                            <img src="/chouhanrugs.png" alt="Chouhan Rugs" className="h-[65px] w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Search Field (Center 5 cols) */}
                    <div className="col-span-5 flex justify-center">
                        <div className="w-full max-w-md">
                            <DirectSearchBar placeholder="Search rugs by style, color, or shape..." />
                        </div>
                    </div>

                    {/* Top Right Quick Links & Language (Right 4 cols) */}
                    <div className="col-span-4 flex items-center justify-end gap-5 text-xs font-semibold text-gray-500">
                        <Link href="/about-us" className="hover:text-[#6c4624]">{labels.aboutUs}</Link>
                        <Link href="/contact-us" className="hover:text-[#6c4624]">{labels.contact}</Link>
                        <Link href="/blog" className="hover:text-[#6c4624]">{labels.blog}</Link>
                        <span className="h-3 w-px bg-gray-200" />
                        <LocaleSwitcher />
                    </div>
                </div>
            </div>

            {/* Mid Deck: Symmetrical Info & Actions Ribbon */}
            <div className="bg-[#f4ebe1] py-2.5 px-8 text-xs text-[#5d3c1e] font-bold border-b border-[#e5ccb5]/30">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    {/* Marketplace Badges */}
                    <div className="flex items-center gap-2">
                        <span>Buy on Boutique Stores:</span>
                        {marketplaceLinks.map(({ label, url, platform }) => {
                            const Icon = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] || TbBuildingStore
                            return (
                                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-[#6c4624] ml-2">
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{label}</span>
                                </a>
                            )
                        })}
                    </div>

                    {/* Actions panel */}
                    <div className="flex items-center gap-6">
                        <Link href="/track-order" className="flex items-center gap-1.5 hover:text-[#6c4624]">
                            <img src="/vector/TrackOrder.svg" alt="" className="w-4 h-4 opacity-80" />
                            <span>Track Order</span>
                        </Link>
                        <Link href="/user/wishlist" className="flex items-center gap-1.5 hover:text-[#6c4624]">
                            <img src="/vector/Heart.svg" alt="" className="w-4 h-4 opacity-80" />
                            <span>My Wishlist</span>
                        </Link>
                        {session?.user == null ? (
                            <LoginLink className="flex items-center gap-1.5 hover:text-[#6c4624]">
                                <img src="/vector/UserIcon.svg" alt="" className="w-4 h-4 opacity-80" />
                                <span>Sign In / Register</span>
                            </LoginLink>
                        ) : (
                            <ClientUserMenu session={session}>
                                <div className="flex items-center gap-1.5 hover:text-[#6c4624]">
                                    <img src="/vector/UserIcon.svg" alt="" className="w-4 h-4 opacity-80" />
                                    <span>Account ({session.user.name?.split(' ')[0]})</span>
                                </div>
                            </ClientUserMenu>
                        )}
                        <span className="h-4.5 w-px bg-[#e5ccb5]/60" />
                        <Link href="/cart" className="flex items-center gap-1.5 hover:text-[#6c4624]">
                            <ClientCartBadge iconSize={18} />
                            <span>My Cart</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Deck: Category Dropdowns */}
            <div className="bg-white py-3 px-8 text-center shadow-inner">
                <nav className="max-w-[1600px] mx-auto flex items-center justify-center gap-9">
                    {categories
                        .filter((c) => c.active && c.popular)
                        .map((c) => (
                            <StandardCategoryItem
                                key={c._id}
                                label={c.name}
                                href={`/products/category/${encodeURIComponent(c.slug ?? c.name)}`}
                                submenu={categories.filter((i) => i.parent === c.name)}
                            />
                        ))}
                </nav>
            </div>
        </header>
    )
}

// ==========================================
// --- OPTION 4: Symmetric Gallery Wing (Double-Wing Banner) ---
// ==========================================
function HeaderOption3({ session, categories, marketplaceLinks, labels }: HeaderOptionsSwitcherProps) {
    return (
        <header className="w-full bg-[#fdfdfd] hidden md:block border-b border-gray-100">
            {/* Top Deck: Grand centered Logo */}
            <div className="bg-white py-5 px-8 flex justify-center border-b border-[#e5ccb5]/15">
                <Link href="/">
                    <img src="/chouhanrugs.png" alt="Chouhan Rugs" className="h-[90px] w-auto object-contain" />
                </Link>
            </div>

            {/* Mid Deck: Symmetrical Menu Bar splits Links & Marketplace Badges */}
            <div className="bg-[#faf7f2] border-b border-[#e5ccb5]/20 py-2.5 px-8 text-xs font-semibold text-[#5d3c1e]">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    {/* Left Wing Navigation */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="hover:text-[#6c4624]">Home</Link>
                        <Link href="/about-us" className="hover:text-[#6c4624]">About Us</Link>
                        <Link href="/contact-us" className="hover:text-[#6c4624]">Contact</Link>
                        <Link href="/blog" className="hover:text-[#6c4624]">Blog</Link>
                        <Link href="/policies" className="hover:text-[#6c4624]">Policies</Link>
                    </div>

                    {/* Right Wing Marketplace Badges */}
                    <div className="flex items-center gap-4">
                        <span className="opacity-75">Boutiques:</span>
                        {marketplaceLinks.map(({ label, url }) => (
                            <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#6c4624]">
                                {label}
                            </a>
                        ))}
                        <span className="h-3 w-px bg-[#e5ccb5]/40" />
                        <LocaleSwitcher />
                    </div>
                </div>
            </div>

            {/* Main Action deck: Search Bar Left, Actions Right */}
            <div className="bg-white border-b border-[#e5ccb5]/20 py-3.5 px-8">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    {/* Search box & Track Order Left */}
                    <div className="flex items-center gap-6 flex-1">
                        <Link href="/track-order" className="flex items-center gap-2 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                            <img src="/vector/TrackOrder.svg" alt="" className="w-5 h-5 opacity-90" />
                            <span>Track Order</span>
                        </Link>
                        <div className="w-64">
                            <DirectSearchBar placeholder="Quick search..." />
                        </div>
                    </div>

                    {/* Category Navigation Menu (Centered in structure) */}
                    <nav className="flex items-center justify-center gap-6 flex-2">
                        {categories
                            .filter((c) => c.active && c.popular)
                            .map((c) => (
                                <StandardCategoryItem
                                    key={c._id}
                                    label={c.name}
                                    href={`/products/category/${encodeURIComponent(c.slug ?? c.name)}`}
                                    submenu={categories.filter((i) => i.parent === c.name)}
                                />
                            ))}
                    </nav>

                    {/* Tools Left */}
                    <div className="flex items-center justify-end gap-6 flex-1">
                        <Link href="/user/wishlist" className="flex items-center gap-2 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                            <img src="/vector/Heart.svg" alt="" className="w-5 h-5 opacity-90" />
                            <span>Wishlist</span>
                        </Link>

                        {session?.user == null ? (
                            <LoginLink>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                                    <img src="/vector/UserIcon.svg" alt="" className="w-5 h-5 opacity-90" />
                                    <span>My Account</span>
                                </div>
                            </LoginLink>
                        ) : (
                            <ClientUserMenu session={session}>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                                    <img src="/vector/UserIcon.svg" alt="" className="w-5 h-5 opacity-90" />
                                    <span>Hi, {session.user.name?.split(' ')[0]}</span>
                                </div>
                            </ClientUserMenu>
                        )}

                        <span className="h-5 w-px bg-gray-200" />

                        <Link href="/cart" className="flex items-center gap-2 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                            <ClientCartBadge iconSize={20} />
                            <span>Cart</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

// ==========================================
// --- OPTION 5: High-End Catalog Grid (Asymmetrical Editorial) ---
// ==========================================
function HeaderOption4({ session, categories, marketplaceLinks, labels }: HeaderOptionsSwitcherProps) {
    return (
        <header className="w-full bg-[#FAF6F0] hidden md:block border-b border-[#e5ccb5]/40 z-40 relative">
            {/* Top Deck: Clean Catalog bar */}
            <div className="border-b border-[#e5ccb5]/25 py-2 px-8 text-xs font-bold text-[#5d3c1e]">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] uppercase tracking-widest text-[#8b7868]">Established 1988</span>
                        <span className="h-3 w-px bg-[#e5ccb5]/40" />
                        <div className="flex gap-4">
                            {marketplaceLinks.map(({ label, url }) => (
                                <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="hover:underline opacity-80">
                                    Official {label} Partner
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/contact-us" className="hover:text-[#6c4624]">Contact Support</Link>
                        <LocaleSwitcher />
                    </div>
                </div>
            </div>

            {/* Mid Deck: Bold Asymmetrical 3-Column Grid Layout */}
            <div className="bg-white py-6 px-8 border-b border-[#e5ccb5]/25">
                <div className="max-w-[1600px] mx-auto grid grid-cols-3 items-center gap-6">
                    {/* Col 1: Brand Logo on Left */}
                    <div className="flex items-center justify-start">
                        <Link href="/">
                            <img src="/chouhanrugs.png" alt="Chouhan Rugs" className="h-[78px] w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Col 2: Large Central Styled Search Bar */}
                    <div className="flex justify-center w-full">
                        <div className="w-full max-w-md">
                            <DirectSearchBar placeholder="Search collections (jute, wool, vintage)..." />
                        </div>
                    </div>

                    {/* Col 3: Actions Bar on Right */}
                    <div className="flex items-center justify-end gap-6">
                        <Link href="/track-order" className="flex items-center gap-2 group text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                            <img src="/vector/TrackOrder.svg" alt="" className="w-[22px] h-[22px] opacity-80 group-hover:-translate-y-0.5 transition-transform" />
                            <span>Track Order</span>
                        </Link>

                        <Link href="/user/wishlist" className="flex items-center gap-2 group text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                            <img src="/vector/Heart.svg" alt="" className="w-[22px] h-[22px] opacity-80 group-hover:scale-105 transition-transform" />
                            <span>My Wishlist</span>
                        </Link>

                        {session?.user == null ? (
                            <LoginLink>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                                    <img src="/vector/UserIcon.svg" alt="" className="w-[22px] h-[22px] opacity-80" />
                                    <span>Sign In</span>
                                </div>
                            </LoginLink>
                        ) : (
                            <ClientUserMenu session={session}>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                                    <img src="/vector/UserIcon.svg" alt="" className="w-[22px] h-[22px] opacity-80" />
                                    <span>Account: {session.user.name?.split(' ')[0]}</span>
                                </div>
                            </ClientUserMenu>
                        )}

                        <span className="h-5 w-px bg-gray-200" />

                        <Link href="/cart" className="flex items-center gap-2 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                            <ClientCartBadge iconSize={22} />
                            <span>Cart</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Deck: Extended Category Navigation & Top Links */}
            <div className="bg-[#FAF6F0] py-3.5 px-8">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    {/* Category Dropdowns */}
                    <nav className="flex items-center gap-8">
                        {categories
                            .filter((c) => c.active && c.popular)
                            .map((c) => (
                                <StandardCategoryItem
                                    key={c._id}
                                    label={c.name}
                                    href={`/products/category/${encodeURIComponent(c.slug ?? c.name)}`}
                                    submenu={categories.filter((i) => i.parent === c.name)}
                                />
                            ))}
                    </nav>

                    {/* Standard Pages links on Right */}
                    <div className="flex items-center gap-5 text-xs font-bold text-[#5d3c1e]">
                        <Link href="/" className="hover:underline">Home</Link>
                        <Link href="/about-us" className="hover:underline">About Us</Link>
                        <Link href="/blog" className="hover:underline">Blog Articles</Link>
                        <Link href="/policies" className="hover:underline">Policies</Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

// ==========================================
// --- OPTION 6: Floating Oasis Console (Glassmorphic Decks) ---
// ==========================================
function HeaderOption5({ session, categories, marketplaceLinks, labels }: HeaderOptionsSwitcherProps) {
    return (
        <header className="w-full bg-[#fdfdfd] hidden md:block relative z-40">
            {/* Top Deck: Fixed height utility and marketplace row */}
            <div className="bg-[#f6ebd9] border-b border-[#e5ccb5]/25 text-[11px] py-2 px-8 text-[#5d3c1e] font-semibold">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex gap-4">
                        {marketplaceLinks.map(({ label, url }) => (
                            <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#6c4624]">
                                Shop Chouhan Rugs on {label}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/track-order">Track Order</Link>
                        <Link href="/about-us">About Us</Link>
                        <Link href="/policies">Policies</Link>
                        <LocaleSwitcher />
                    </div>
                </div>
            </div>

            {/* Floating Glassmorphic Container Row */}
            <div className="w-full bg-white/75 backdrop-blur-md border-b border-[#e5ccb5]/25 py-4 px-8 sticky top-0 z-40 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
                    {/* Logo Left */}
                    <div className="flex items-center shrink-0">
                        <Link href="/">
                            <img src="/chouhanrugs.png" alt="Chouhan Rugs" className="h-[62px] w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Categories center */}
                    <nav className="flex items-center gap-7">
                        {categories
                            .filter((c) => c.active && c.popular)
                            .map((c) => (
                                <StandardCategoryItem
                                    key={c._id}
                                    label={c.name}
                                    href={`/products/category/${encodeURIComponent(c.slug ?? c.name)}`}
                                    submenu={categories.filter((i) => i.parent === c.name)}
                                />
                            ))}
                    </nav>

                    {/* Actions and direct Search box Right */}
                    <div className="flex items-center gap-5">
                        <div className="w-48 xl:w-56">
                            <DirectSearchBar placeholder="Search items..." />
                        </div>

                        <Link href="/user/wishlist" className="flex items-center gap-1.5 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]" title="Wishlist">
                            <img src="/vector/Heart.svg" alt="" className="w-5 h-5 opacity-90" />
                            <span className="hidden xl:inline">Wishlist</span>
                        </Link>

                        {session?.user == null ? (
                            <LoginLink className="flex items-center gap-1.5 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                                <img src="/vector/UserIcon.svg" alt="" className="w-5 h-5 opacity-90" />
                                <span className="hidden xl:inline">Account</span>
                            </LoginLink>
                        ) : (
                            <ClientUserMenu session={session}>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                                    <img src="/vector/UserIcon.svg" alt="" className="w-5 h-5 opacity-90" />
                                    <span className="hidden xl:inline">{session.user.name?.split(' ')[0]}</span>
                                </div>
                            </ClientUserMenu>
                        )}

                        <span className="h-4.5 w-px bg-gray-200" />

                        <Link href="/cart" className="flex items-center gap-1.5 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624]">
                            <ClientCartBadge iconSize={20} />
                            <span>Cart</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

// ==========================================
// --- Dynamic Selector Switcher (MAIN EXPORT) ---
// ==========================================
export default function HeaderOptionsSwitcher(props: HeaderOptionsSwitcherProps) {
    const [selectedOption, setSelectedOption] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

    return (
        <div className="w-full">
            {/* Dynamic Layout Control Bar */}
            <div className="w-full bg-[#1e130c] text-white py-3.5 px-6 flex flex-wrap items-center justify-between gap-4 shadow-md z-[1000] relative border-b border-[#3b2719]">
                <div className="flex items-center gap-3">
                    <span className="inline-flex h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#e5ccb5]">
                        Header Layout Switcher:
                    </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setSelectedOption(0)}
                        className={clsx(
                            'px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-150 border',
                            selectedOption === 0
                                ? 'bg-amber-700 text-white border-amber-600 shadow-md scale-105'
                                : 'bg-white/10 text-white/80 hover:bg-white/20 border-transparent'
                        )}
                    >
                        0. Current Live Header (Baseline)
                    </button>
                    {[1, 2, 3, 4, 5].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setSelectedOption(opt as any)}
                            className={clsx(
                                'px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-150 border',
                                selectedOption === opt
                                    ? 'bg-amber-700 text-white border-amber-600 shadow-md scale-105'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20 border-transparent'
                            )}
                        >
                            Layout {opt}
                        </button>
                    ))}
                </div>

                <div className="text-xs font-bold text-[#d2beae] bg-white/5 px-3 py-1 rounded border border-white/10">
                    Active Style: {
                        selectedOption === 0 ? 'Current Live Header' :
                        selectedOption === 1 ? 'Luxury Quad-Deck' :
                        selectedOption === 2 ? 'Modern Executive Split' :
                        selectedOption === 3 ? 'Symmetric Gallery Wing' :
                        selectedOption === 4 ? 'Catalog Column Grid' :
                        'Floating Oasis Console'
                    }
                </div>
            </div>

            {/* Render Selected Header Option */}
            <div className="bg-[#FAF6F0]/20 min-h-[140px]">
                {selectedOption === 0 && <HeaderOptionCurrent {...props} />}
                {selectedOption === 1 && <HeaderOption1 {...props} />}
                {selectedOption === 2 && <HeaderOption2 {...props} />}
                {selectedOption === 3 && <HeaderOption3 {...props} />}
                {selectedOption === 4 && <HeaderOption4 {...props} />}
                {selectedOption === 5 && <HeaderOption5 {...props} />}
            </div>
        </div>
    )
}
