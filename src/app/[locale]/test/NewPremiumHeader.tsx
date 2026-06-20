import React from 'react'
import { Link } from '@/i18n/navigation'
import { getSession } from '@/lib/auth-server'
import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import getSiteData from '@/backend/serverActions/getSiteData'
import { getTranslations } from 'next-intl/server'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import LoginLink from '@/components/LoginLink'
import UserMenu from '@/ui/Layout/Navigation/UserMenu'
import { FaAmazon, FaChevronDown } from 'react-icons/fa'
import { SiEtsy } from 'react-icons/si'
import { TbBuildingStore } from 'react-icons/tb'
import { MarketplaceLink } from '@/types/SiteDataModel'
import CategoriesDataModel from '@/types/CategoriesDataModel'
import { SearchButton, PremiumCartItem } from './NewPremiumHeaderClient'

const marketplaceIcons = {
    etsy: SiEtsy,
    amazon: FaAmazon,
    faire: TbBuildingStore,
    custom: TbBuildingStore,
} satisfies Record<MarketplaceLink['platform'], React.ComponentType<{ className?: string }>>

const CategoryMenuItem = ({ label, submenu, href }: { label: string, href?: string, submenu?: CategoriesDataModel[] }) => {
    const hasSubmenu = (submenu?.length ?? 0) > 0;
    return (
        hasSubmenu ? (
            <div className="relative group inline-block">
                <button className="text-xs uppercase tracking-wider font-bold text-[#5d3c1e] hover:text-[#6c4624] flex items-center gap-1 cursor-pointer select-none py-2 transition-colors duration-150">
                    {label} <FaChevronDown className="w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 ease-out translate-y-2 group-hover:translate-y-0 z-[100]">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-[#e5ccb5]/40 py-2 min-w-[200px] overflow-hidden">
                        <ul className="list-none m-0 p-0 font-normal">
                            {submenu?.map(item => (
                                <li key={item._id}>
                                    <Link 
                                        href={`/products/category/${encodeURIComponent(item.slug ?? item.name)}`} 
                                        className="block px-5 py-2.5 text-xs font-semibold text-[#5d3c1e] hover:bg-[#e5ccb5]/20 hover:text-[#6c4624] transition-colors duration-150"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        ) : (
            <Link href={href ?? ""} className="text-xs uppercase tracking-wider font-bold text-[#5d3c1e] hover:text-[#6c4624] py-2 transition-colors duration-150">
                {label}
            </Link>
        )
    );
}

export default async function NewPremiumHeader() {
    const [session, categories, siteData, t] = await Promise.all([
        getSession(),
        getCategoriesList(),
        getSiteData(),
        getTranslations('nav'),
    ])

    const marketplaceLinks = (siteData.marketplaceLinks ?? []).filter(link => link.enabled && link.url)

    return (
        <header className="w-full bg-[#fbf7ef] hidden md:block">
            {/* Top Slim Utility Bar */}
            <div className="bg-[#f5ebe2] border-b border-[#e5ccb5]/30 text-[11px] text-[#5d3c1e] font-semibold py-1.5 px-8">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    {/* Marketplace Shop Links */}
                    <div className="flex items-center gap-3">
                        {marketplaceLinks.length > 0 && (
                            <>
                                <span className="opacity-70">Shop on:</span>
                                <div className="flex items-center gap-2">
                                    {marketplaceLinks.map(({ label, url, platform }) => {
                                        const Icon = marketplaceIcons[platform] ?? TbBuildingStore
                                        return (
                                            <a
                                                key={`${platform}-${url}`}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 bg-white/40 hover:bg-white/90 px-2 py-0.5 rounded border border-[#e5ccb5]/20 transition-all duration-150"
                                            >
                                                <Icon className="h-3 w-3" />
                                                {label}
                                            </a>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Quick Info & Page Links */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="hover:text-[#6c4624] transition-colors">{t('home')}</Link>
                        <Link href="/about-us" className="hover:text-[#6c4624] transition-colors">{t('aboutUs')}</Link>
                        <Link href="/contact-us" className="hover:text-[#6c4624] transition-colors">{t('contact')}</Link>
                        <Link href="/blog" className="hover:text-[#6c4624] transition-colors">{t('blog')}</Link>
                        <Link href="/policies" className="hover:text-[#6c4624] transition-colors">{t('policies')}</Link>
                        <Link href="/terms" className="hover:text-[#6c4624] transition-colors">{t('termsShort')}</Link>
                        
                        <span className="h-3 w-px bg-[#e5ccb5]/60" />
                        
                        {/* Locale Switcher */}
                        <div className="flex items-center">
                            <LocaleSwitcher />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Slim Header Bar */}
            <div className="bg-white/90 backdrop-blur-md border-b border-[#e5ccb5]/25 py-2.5 px-8 sticky top-0 z-40 shadow-[0_2px_15px_rgba(93,60,30,0.03)]">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
                    {/* Logo (Left) */}
                    <div className="flex items-center shrink-0">
                        <Link href="/" className="flex items-center">
                            <img 
                                src="/chouhanrugs.png" 
                                alt="Chouhan Rugs" 
                                className="h-[42px] w-auto object-contain transition-transform hover:scale-[1.02] duration-150" 
                            />
                        </Link>
                    </div>

                    {/* Category Navigation Links (Center) */}
                    <nav className="flex items-center gap-7">
                        {categories
                            .filter(category => category.active && category.popular)
                            .map(category => (
                                <CategoryMenuItem
                                    key={category._id}
                                    label={category.name}
                                    href={`/products/category/${encodeURIComponent(category.slug ?? category.name)}`}
                                    submenu={categories.filter(i => i.parent === category.name)}
                                />
                            ))}
                    </nav>

                    {/* Actions Bar (Right) */}
                    <div className="flex items-center gap-3">
                        {/* Track Order Link */}
                        <Link 
                            href="/track-order" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#e5ccb5]/15 text-xs font-bold text-[#5d3c1e] hover:text-[#6c4624] transition-all duration-150"
                        >
                            <img src="/vector/TrackOrder.svg" alt="" className="w-4 h-4 opacity-80" />
                            <span className="hidden xl:inline">Track Order</span>
                        </Link>

                        {/* Search Button */}
                        <SearchButton />

                        {/* Wishlist Link */}
                        <Link 
                            href="/user/wishlist" 
                            aria-label="Wishlist" 
                            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e5ccb5]/15 transition-all duration-150"
                        >
                            <img src="/vector/Heart.svg" alt="Wishlist" className="w-[18px] h-[18px] opacity-90" />
                        </Link>

                        {/* User Profile / Login Link */}
                        {session?.user == null ? (
                            <LoginLink className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e5ccb5]/15 transition-all duration-150">
                                <img src="/vector/UserIcon.svg" alt="Login" className="w-[18px] h-[18px] opacity-90" />
                            </LoginLink>
                        ) : (
                            <UserMenu>
                                <button className="flex items-center gap-1.5 h-9 px-3 rounded-full hover:bg-[#e5ccb5]/15 transition-all duration-150">
                                    <img src="/vector/UserIcon.svg" alt="Account" className="w-[18px] h-[18px] opacity-90" />
                                    <span className="text-xs font-bold text-[#5d3c1e]">{session.user.name?.split(' ')[0] ?? "Account"}</span>
                                </button>
                            </UserMenu>
                        )}

                        <span className="h-4 w-px bg-[#e5ccb5]/40" />

                        {/* Cart */}
                        <Link 
                            href="/cart" 
                            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e5ccb5]/15 transition-all duration-150"
                        >
                            <PremiumCartItem icon="/vector/Cart.svg" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
